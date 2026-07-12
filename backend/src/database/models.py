import os
from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./challenges.db")
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    echo=os.getenv("SQLALCHEMY_ECHO") == "1",
)
Base = declarative_base()


class Challenge(Base):
    """
    SQLAlchemy model for a coding challenge.
    Stores challenge details such as difficulty, title, options, correct answer, and explanation.
    """

    __tablename__ = "challenges"

    id = Column(Integer, primary_key=True)
    difficulty = Column(String, nullable=False)
    date_created = Column(DateTime, default=datetime.now)
    created_by = Column(String, nullable=False)
    title = Column(String, nullable=False)
    options = Column(String, nullable=False)  # Stored as JSON string
    correct_answer_id = Column(Integer, nullable=False)  # Index of correct option
    explanation = Column(String, nullable=False)


class ChallengeQuota(Base):
    """
    SQLAlchemy model for tracking a user's daily challenge quota.
    Stores how many challenges a user can generate and when their quota was last reset.
    """

    __tablename__ = "challenge_quotas"

    id = Column(Integer, primary_key=True)
    user_id = Column(String, nullable=False, unique=True)
    quota_remaining = Column(Integer, nullable=False, default=50)
    last_reset_date = Column(DateTime, default=datetime.now)


# Create all tables in the database
Base.metadata.create_all(engine)

# Session factory for database connections
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """
    Dependency for getting a database session.
    Ensures the session is closed after use.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
