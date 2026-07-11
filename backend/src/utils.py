import logging
import os
from functools import lru_cache
from pathlib import Path

from clerk_backend_api import AuthenticateRequestOptions, Clerk
from dotenv import load_dotenv
from fastapi import HTTPException

load_dotenv(Path(__file__).with_name(".env"))
logger = logging.getLogger(__name__)


@lru_cache(maxsize=1)
def get_clerk_client() -> Clerk:
    api_key = os.getenv("CLERK_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=503,
            detail="Authentication is temporarily unavailable",
        )
    return Clerk(bearer_auth=api_key)


def get_authorized_parties():
    raw_parties = os.getenv(
        "CLERK_AUTHORIZED_PARTIES",
        "http://localhost:5173,http://localhost:5174",
    )
    return [party.strip() for party in raw_parties.split(",") if party.strip()]


def authenticate_and_get_user_details(request):
    """
    Authenticate the incoming request using Clerk and return user details.
    Raises HTTPException if authentication fails.
    """
    try:
        # Authenticate the request using Clerk SDK
        request_state = get_clerk_client().authenticate_request(
            request,
            AuthenticateRequestOptions(
                authorized_parties=get_authorized_parties(), jwt_key=os.getenv("JWT_KEY")
            ),
        )
        # If the user is not signed in, raise an unauthorized error
        if not request_state.is_signed_in:
            raise HTTPException(status_code=401, detail="Invalid token")

        # Extract the user ID from the token payload
        user_id = request_state.payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")

        # Return the user ID in a dictionary
        return {"user_id": user_id}
    except HTTPException:
        raise
    except Exception as exc:
        logger.info("Request authentication failed: %s", type(exc).__name__)
        raise HTTPException(status_code=401, detail="Invalid credentials") from exc
