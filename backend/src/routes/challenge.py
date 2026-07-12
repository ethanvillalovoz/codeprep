import json
import logging
from typing import Annotated, Literal

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session

from ..ai_generator import ChallengeGenerationError, generate_challenge_with_llm
from ..database.db import (
    create_challenge,
    create_challenge_quota,
    get_challenge_quota,
    get_user_challenges,
    reset_quota_if_needed,
)
from ..database.models import get_db
from ..utils import authenticate_and_get_user_details

router = APIRouter()
logger = logging.getLogger(__name__)
DatabaseSession = Annotated[Session, Depends(get_db)]


def get_authenticated_user_id(request: Request) -> str:
    user_id = authenticate_and_get_user_details(request).get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return user_id


class ChallengeRequest(BaseModel):
    difficulty: Literal["easy", "medium", "hard"]

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "difficulty": "easy",
            }
        }
    )


def serialize_challenge(challenge):
    return {
        "id": challenge.id,
        "difficulty": challenge.difficulty,
        "title": challenge.title,
        "options": json.loads(challenge.options),
        "correct_answer_id": challenge.correct_answer_id,
        "explanation": challenge.explanation,
        "timestamp": challenge.date_created.isoformat(),
    }


@router.post("/generate-challenge")
def generate_challenge(
    payload: ChallengeRequest,
    request: Request,
    db: DatabaseSession,
):
    try:
        user_id = get_authenticated_user_id(request)

        quota = get_challenge_quota(db, user_id)
        if not quota:
            quota = create_challenge_quota(db, user_id)
        quota = reset_quota_if_needed(db, quota)

        if quota.quota_remaining <= 0:
            raise HTTPException(status_code=429, detail="Quota exhausted")

        challenge_data = generate_challenge_with_llm(payload.difficulty)

        new_challenge = create_challenge(
            db=db,
            difficulty=payload.difficulty,
            created_by=user_id,
            title=challenge_data["title"],
            options=json.dumps(challenge_data["options"]),
            correct_answer_id=challenge_data["correct_answer_id"],
            explanation=challenge_data["explanation"],
        )

        quota.quota_remaining -= 1
        db.commit()
        db.refresh(new_challenge)

        return serialize_challenge(new_challenge)

    except HTTPException:
        db.rollback()
        raise
    except ChallengeGenerationError as exc:
        db.rollback()
        logger.warning("Challenge generation failed: %s", exc)
        raise HTTPException(
            status_code=503,
            detail="Challenge generation is temporarily unavailable",
        ) from exc
    except Exception as exc:
        db.rollback()
        logger.exception("Unexpected challenge generation failure")
        raise HTTPException(
            status_code=500,
            detail="Unable to generate a challenge",
        ) from exc


@router.get("/my-history")
def my_history(
    request: Request,
    db: DatabaseSession,
):
    user_id = get_authenticated_user_id(request)
    challenges = get_user_challenges(db, user_id)
    return {"challenges": [serialize_challenge(item) for item in challenges]}


@router.get("/quota")
def get_quota(
    request: Request,
    db: DatabaseSession,
):
    user_id = get_authenticated_user_id(request)

    quota = get_challenge_quota(db, user_id)
    if not quota:
        quota = create_challenge_quota(db, user_id)

    quota = reset_quota_if_needed(db, quota)
    return {
        "user_id": quota.user_id,
        "quota_remaining": quota.quota_remaining,
        "last_reset_date": quota.last_reset_date.isoformat(),
    }
