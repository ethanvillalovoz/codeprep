# Figure contract: CodePrep system architecture

## Communication job

This figure should let a technical reviewer follow CodePrep's shared browser request contract into its deterministic demo or authenticated backend, then inspect the live generation, schema gate, atomic persistence, rollback, provisioning, and read paths.

## Figure form

A request-sequence diagram with six lifelines and two alternate bands. The demo band terminates at a deterministic fixture response. The live band continues through Clerk, FastAPI, hosted inference, an API-owned Pydantic gate, and an explicitly enclosed SQLAlchemy transaction that couples challenge insertion with quota decrement. Provisioning and read paths appear as a separate asynchronous inset rather than another pipeline stage.

## Visual encoding

The figure directly reuses CodePrep's product tokens: warm off-white and neutral surfaces establish the paper, rust marks requests and active execution, charcoal marks authenticated backend traffic, green marks valid responses and the database transaction, and muted red marks rollback. Lifelines, arrow direction, alternate bands, and labels remain redundant with color.

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
