# Figure contract: CodePrep decision flow

## Communication job

This figure should allow a skeptical technical reviewer to understand that CodePrep reveals a rationale only after answer commitment while its live path validates generated challenges and commits the challenge plus quota decrement atomically.

## Supported claim

The credential-free demo serves deterministic challenges through the same frontend request contract and keeps the explanation hidden until an option is selected. In live mode, a Clerk-authenticated request checks quota, obtains one provider response, validates an exact four-option Pydantic schema, and commits the new challenge with the quota decrement in one transaction; failures roll back.

## Evidence used

- `docs/figures/codeprep-decision-flow/media/committed-answer.png` for the complete default medium demo after answer commitment.
- `frontend/src/data/demo.js` and `frontend/src/utils/DemoApiProvider.jsx` for the deterministic challenge, history, and in-memory quota fixture.
- `frontend/src/challenge/MCQChallenge.jsx` for answer commitment and rationale reveal behavior.
- `backend/src/ai_generator.py` for provider parsing and exact challenge validation.
- `backend/src/routes/challenge.py` for authentication, quota checking, transaction commit, and rollback behavior.

## Evidence boundary

- The displayed challenge and quota are deterministic fixtures, not live model or user data.
- The figure makes no learning-outcome, interview-performance, question-quality, provider-accuracy, or usage-analytics claim.
- Demo mode does not exercise Clerk, the hosted model, or database transactions.
- Atomicity is local to the maintained database transaction; production scaling still requires migrations and managed persistence.

## Selection rule

The figure uses the default medium challenge after selecting its committed correct answer. The question, all four options, rationale, difficulty, and remaining-demo-quota state are shown; no question was selected for apparent quality.

## Delivery formats

- Editable source: `editable/codeprep-decision-flow.pptx`
- README export: `exports/codeprep-decision-flow.svg`
- Review export: `exports/codeprep-decision-flow.png`
- Print/preflight export: `exports/codeprep-decision-flow.pdf`
