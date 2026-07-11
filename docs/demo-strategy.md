# Demo Strategy

CodePrep ships an interactive local demo instead of a nonfunctional public shell.

## Public Review Path

1. Run `npm install && npm run dev` in `frontend/`.
2. Select a difficulty and generate a deterministic challenge.
3. Commit to an answer and inspect the explanation.
4. Open History to review completed questions.

The demo is labeled in the interface and never implies that fixtures are live model output.

## README Media

`docs/media/codeprep-workspace.gif` is built from browser-verified product states:

- Ready workspace.
- Generation in progress.
- Unanswered challenge.
- Correct answer and explanation.
- Session history.

The underlying desktop and mobile captures remain in `docs/media/` for inspection.

## Hosted Deployment Criteria

Only advertise a hosted live mode after the following are deployed and monitored together:

- Vite frontend with Clerk production keys.
- FastAPI service with restricted origins.
- Hosted relational database and migrations.
- Hugging Face inference token and known provider limits.
- Error monitoring, request limits, and cost controls.
