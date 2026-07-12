import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import challenge, webhooks


def get_allowed_origins():
    raw_origins = os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:5173,http://localhost:5174",
    )
    return [origin.strip() for origin in raw_origins.split(",") if origin.strip()]


app = FastAPI(
    title="CodePrep API",
    description="Authenticated coding challenge generation and practice history.",
    version="1.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.get("/")
def root():
    return {"name": "CodePrep API", "docs": "/docs", "health": "/health"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


app.include_router(challenge.router, prefix="/api")
app.include_router(webhooks.router, prefix="/webhooks")
