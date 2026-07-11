from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from . import models

MAX_DAILY_CHALLENGES = 50


def get_challenge_quota(db: Session, user_id: str):
    """
    Retrieve the challenge quota record for a given user.
    """
    return db.query(models.ChallengeQuota).filter(models.ChallengeQuota.user_id == user_id).first()


def create_challenge_quota(db: Session, user_id: str):
    """
    Create a new challenge quota record for a user.
    """
    existing_quota = get_challenge_quota(db, user_id)
    if existing_quota:
        return existing_quota

    db_quota = models.ChallengeQuota(user_id=user_id)
    db.add(db_quota)
    db.commit()
    db.refresh(db_quota)
    return db_quota


def reset_quota_if_needed(db: Session, quota: models.ChallengeQuota):
    """
    Reset the user's quota if 24 hours have passed since the last reset.
    """
    now = datetime.now()
    if now - quota.last_reset_date >= timedelta(hours=24):
        quota.quota_remaining = MAX_DAILY_CHALLENGES
        quota.last_reset_date = now
        db.commit()
        db.refresh(quota)
    return quota


def create_challenge(
    db: Session,
    difficulty: str,
    created_by: str,
    title: str,
    options: str,
    correct_answer_id: int,
    explanation: str,
):
    """
    Create and store a new coding challenge in the database.
    """
    db_challenge = models.Challenge(
        difficulty=difficulty,
        created_by=created_by,
        title=title,
        options=options,
        correct_answer_id=correct_answer_id,
        explanation=explanation,
    )
    db.add(db_challenge)
    db.flush()
    return db_challenge


def get_user_challenges(db: Session, user_id: str):
    """
    Retrieve all challenges created by a specific user.
    """
    return (
        db.query(models.Challenge)
        .filter(models.Challenge.created_by == user_id)
        .order_by(models.Challenge.date_created.desc())
        .limit(100)
        .all()
    )
