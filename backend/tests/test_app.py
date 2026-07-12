import pytest
from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from src import utils
from src.app import app, get_allowed_origins
from src.database.models import Base, Challenge, ChallengeQuota, get_db
from src.routes import challenge
from starlette.testclient import TestClient

client = TestClient(app)


def test_health_check():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_root_describes_api():
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {
        "name": "CodePrep API",
        "docs": "/docs",
        "health": "/health",
    }


def test_default_allowed_origins():
    assert get_allowed_origins() == [
        "http://localhost:5173",
        "http://localhost:5174",
    ]


def test_invalid_difficulty_is_rejected_before_generation():
    response = client.post("/api/generate-challenge", json={"difficulty": "legendary"})

    assert response.status_code == 422


def test_missing_clerk_configuration_returns_service_unavailable(monkeypatch):
    monkeypatch.delenv("CLERK_API_KEY", raising=False)
    utils.get_clerk_client.cache_clear()

    with pytest.raises(HTTPException) as error:
        utils.get_clerk_client()

    assert error.value.status_code == 503
    assert error.value.detail == "Authentication is temporarily unavailable"


@pytest.fixture()
def database_session():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)
    session = sessionmaker(bind=engine)()

    def override_get_db():
        try:
            yield session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    yield session
    app.dependency_overrides.clear()
    session.close()
    engine.dispose()


def test_generate_challenge_persists_result_and_decrements_quota(
    monkeypatch,
    database_session,
):
    monkeypatch.setattr(challenge, "get_authenticated_user_id", lambda _request: "user_123")
    monkeypatch.setattr(
        challenge,
        "generate_challenge_with_llm",
        lambda _difficulty: {
            "title": "What is the runtime of binary search?",
            "options": ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
            "correct_answer_id": 1,
            "explanation": "Binary search halves the remaining search interval at every step.",
        },
    )

    response = client.post("/api/generate-challenge", json={"difficulty": "medium"})

    assert response.status_code == 200
    assert response.json()["correct_answer_id"] == 1
    assert database_session.query(Challenge).count() == 1
    quota = database_session.query(ChallengeQuota).one()
    assert quota.quota_remaining == 49


def test_provider_failure_preserves_quota(monkeypatch, database_session):
    monkeypatch.setattr(challenge, "get_authenticated_user_id", lambda _request: "user_123")

    def fail_generation(_difficulty):
        raise challenge.ChallengeGenerationError("provider unavailable")

    monkeypatch.setattr(challenge, "generate_challenge_with_llm", fail_generation)

    response = client.post("/api/generate-challenge", json={"difficulty": "hard"})

    assert response.status_code == 503
    assert response.json() == {"detail": "Challenge generation is temporarily unavailable"}
    quota = database_session.query(ChallengeQuota).one()
    assert quota.quota_remaining == 50
    assert database_session.query(Challenge).count() == 0


def test_quota_endpoint_creates_default_quota(monkeypatch, database_session):
    monkeypatch.setattr(challenge, "get_authenticated_user_id", lambda _request: "user_123")

    response = client.get("/api/quota")

    assert response.status_code == 200
    assert response.json()["quota_remaining"] == 50


def test_unsigned_webhook_is_not_accepted(monkeypatch):
    monkeypatch.delenv("CLERK_WEBHOOK_SECRET", raising=False)

    response = client.post("/webhooks/clerk", content=b"{}")

    assert response.status_code == 503
    assert response.json() == {"detail": "Webhook processing is temporarily unavailable"}
