# FAQ

## Does the demo call an LLM?

No. The default frontend uses labeled, deterministic fixtures so anyone can inspect the full interaction without credentials. Set `VITE_CODEPREP_MODE=live` for the authenticated API path.

## Does the backend download an 8B model?

No. It uses Hugging Face's hosted inference client. This keeps API startup and CI lightweight and makes model latency an explicit service dependency.

## Can I change the model?

Yes. Set `CODEPREP_MODEL_ID`. The replacement must support chat completion and return the JSON contract described in [Architecture](architecture.md).

## What happens when generation fails?

The request returns a generic `503`. The database transaction is rolled back, no challenge is stored, and the user's quota remains unchanged.

## How does quota work?

Each user starts with 50 generations. The quota resets after 24 hours. Challenge creation and the decrement occur in one transaction.

## Where is data stored?

Local development defaults to `backend/challenges.db`. Configure `DATABASE_URL` for another SQLAlchemy-supported database.

## How do I report a bug?

Open a focused issue in the [GitHub issue tracker](https://github.com/ethanvillalovoz/codeprep-ai/issues).
