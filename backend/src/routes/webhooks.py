import json
import logging
import os
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from svix.webhooks import Webhook, WebhookVerificationError

from ..database.db import create_challenge_quota
from ..database.models import get_db

router = APIRouter()
logger = logging.getLogger(__name__)
DatabaseSession = Annotated[Session, Depends(get_db)]


@router.post("/clerk")
async def handle_user_created(
    request: Request,
    db: DatabaseSession,
):
    """
    Endpoint to handle Clerk webhook events for user creation.
    When a new user is created in Clerk, this endpoint is called to
    create a corresponding challenge quota record in the database.
    """
    # Get the Clerk webhook secret from environment variables
    webhook_secret = os.getenv("CLERK_WEBHOOK_SECRET")

    if not webhook_secret:
        # If the secret is not set, return a server error
        raise HTTPException(status_code=503, detail="Webhook processing is temporarily unavailable")

    # Read the raw request body and headers
    body = await request.body()
    payload = body.decode("utf-8")
    headers = dict(request.headers)

    try:
        # Verify the webhook signature using svix
        wh = Webhook(webhook_secret)
        wh.verify(payload, headers)

        # Parse the webhook payload as JSON
        data = json.loads(payload)

        # Only handle 'user.created' events
        if data.get("type") != "user.created":
            return {"status": "ignored"}

        # Extract user data and user ID from the payload
        user_data = data.get("data", {})
        user_id = user_data.get("id")
        if not user_id:
            raise HTTPException(status_code=400, detail="Missing user identifier")

        # Create a challenge quota record for the new user
        create_challenge_quota(db, user_id)

        return {"status": "success"}
    except HTTPException:
        raise
    except (WebhookVerificationError, json.JSONDecodeError) as exc:
        raise HTTPException(status_code=401, detail="Invalid webhook") from exc
    except Exception as exc:
        db.rollback()
        logger.exception("Unable to process Clerk webhook")
        raise HTTPException(status_code=500, detail="Unable to process webhook") from exc
