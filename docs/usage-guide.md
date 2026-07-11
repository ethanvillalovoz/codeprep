# Usage Guide

## Interactive Demo

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`. Demo mode is the default and requires no environment variables.

## Live Development

### Backend

```bash
python3 -m venv backend/.venv
source backend/.venv/bin/activate
pip install -r backend/requirements.txt
cp backend/src/.env.example backend/src/.env
cd backend
python server.py
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Add `VITE_CODEPREP_MODE=live` and your Clerk publishable key to `frontend/.env`.

## Practice Flow

1. Choose Easy, Medium, or Hard.
2. Generate one challenge.
3. Select an answer once.
4. Review the validated answer and explanation.
5. Open History to revisit recent generations.

## Clerk Webhooks

For local webhook testing, expose port `8000` through your preferred tunnel and configure Clerk to send `user.created` to `/webhooks/clerk`. The endpoint rejects unsigned payloads and safely ignores unrelated event types.

## Checks

```bash
cd frontend && npm run check
cd ../backend && ../backend/.venv/bin/ruff check src tests && ../backend/.venv/bin/pytest -q
```

## Troubleshooting

- `503 Authentication is temporarily unavailable`: set `CLERK_API_KEY`.
- `503 Challenge generation is temporarily unavailable`: verify `HUGGINGFACE_TOKEN`, model access, and provider availability.
- Browser CORS failure: add the exact frontend origin to `ALLOWED_ORIGINS`.
- Empty local data: confirm `DATABASE_URL` points to the expected database file.
