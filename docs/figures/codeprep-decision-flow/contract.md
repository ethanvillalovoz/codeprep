# Figure contract: CodePrep system architecture

## Communication job

This figure should let a technical reviewer follow CodePrep's shared browser request contract into its deterministic demo or authenticated backend, then inspect the live generation, schema gate, atomic persistence, rollback, provisioning, and read paths.

## Figure form

A split system architecture. The browser routes the same request contract to either a local fixture provider or a Clerk-authenticated API adapter. The backend passes generation through user/quota checks, hosted inference, and exact Pydantic validation before challenge insertion and quota decrement commit together. Failure and identity-provisioning branches remain explicit.

## Visual encoding

The figure uses an IDE-inspired dark palette: orange marks browser and authentication flow, violet marks generation, cyan marks validation and persisted state, lime marks commit, amber marks rollback, and red marks unsupported model-output assumptions. Labels and layout remain redundant with color.

## Supported claim

The credential-free demo implements the same frontend request contract without Clerk, hosted inference, or a database. In live mode, a Clerk-authenticated request checks quota, obtains one provider response, validates an exact four-option Pydantic schema, and commits the new challenge with the quota decrement in one SQLAlchemy transaction; failures roll back without consuming quota. Signed `user.created` webhooks provision quota records.

## Evidence used

- `frontend/src/utils/DemoApiProvider.jsx` and `frontend/src/utils/LiveApiProvider.jsx` for the shared frontend contract and its local/authenticated implementations.
- `backend/src/ai_generator.py` for provider parsing and exact challenge validation.
- `backend/src/routes/challenge.py` for authentication, quota checking, transaction commit, and rollback behavior.
- `backend/src/routes/webhooks.py` and `backend/src/database/` for signed identity provisioning, tables, and persistence.

## Evidence boundary

- The figure describes maintained code paths and contains no live model response or user data.
- The figure makes no learning-outcome, interview-performance, question-quality, provider-accuracy, or usage-analytics claim.
- Demo mode does not exercise Clerk, the hosted model, or database transactions.
- Atomicity is local to the maintained database transaction; production scaling still requires migrations and managed persistence.

## Scope rule

Only branches and transaction semantics verified in maintained source are shown. No learning outcome, provider quality, production-scale guarantee, or usage result is introduced.

## Delivery formats

- Editable source: `editable/codeprep-decision-flow.pptx`
- README export: `exports/codeprep-decision-flow.svg`
- Review export: `exports/codeprep-decision-flow.png`
- Print/preflight export: `exports/codeprep-decision-flow.pdf`
