# Contributing to CodePrep

Thanks for helping improve CodePrep. Contributions should keep the app easy to run locally and avoid committing real credentials, local databases, or generated build artifacts.

## Local Setup

```bash
git clone https://github.com/ethanvillalovoz/codeprep-ai.git
cd codeprep-ai
```

Backend:

```bash
python3 -m venv backend/.venv
source backend/.venv/bin/activate
pip install -r backend/requirements.txt
cp backend/src/.env.example backend/src/.env
```

Frontend:

```bash
cd frontend
npm install
cp .env.example .env
```

## Checks

Run these before opening a pull request:

```bash
cd frontend
npm run lint
npm test
npm run build
```

```bash
cd backend
pip install -r requirements-ci.txt
ruff check src tests
pytest
```

## Pull Request Guidelines

- Keep changes focused and explain the user-facing impact.
- Update docs when setup, configuration, routes, or UI behavior changes.
- Add or update tests for backend behavior when possible.
- Do not commit `.env` files, generated SQLite databases, caches, or model artifacts.

## Code of Conduct

Be respectful, constructive, and specific. See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
