# Demo Strategy

CodePrep ships an interactive local demo instead of a nonfunctional public shell.

## Public Review Path

1. Run `npm install && npm run dev` in `frontend/`.
2. Select a difficulty and generate a deterministic challenge.
3. Commit to an answer and inspect the explanation.
4. Open History to review completed questions.

The demo is labeled in the interface and never implies that fixtures are live model output.

## README Media

`docs/media/codeprep-demo.mp4` is an 8-second, 1280 x 720 recording of the running workbench:

- Difficulty selection.
- Generation in progress.
- A medium data-structures challenge.
- A committed answer and its explanation.

`docs/media/codeprep-poster.webp` preserves the reviewed challenge for surfaces that do not play video.

## Hosted Deployment Criteria

Only advertise a hosted live mode after the following are deployed and monitored together:

- Vite frontend with Clerk production keys.
- FastAPI service with restricted origins.
- Hosted relational database and migrations.
- Hugging Face inference token and known provider limits.
- Error monitoring, request limits, and cost controls.
