# CodePrep system-architecture figure

This directory contains the public demo/live architecture overview and its traceable code inputs.

| File | Purpose |
| --- | --- |
| `contract.md` | Communication job, architecture scope, and trust boundary |
| `provenance.json` | Input and output checksums plus source revision |
| `editable/codeprep-decision-flow.pptx` | Editable composition |
| `exports/codeprep-decision-flow.svg` | README-ready vector export |
| `exports/codeprep-decision-flow.png` | Raster review export |
| `exports/codeprep-decision-flow.pdf` | Print/preflight artifact |
| `media/committed-answer.png` | Archival local demo capture; not an input to the architecture figure |
| `preflight/` | PowerPoint, final-size, grayscale, and PDF checks |

The diagram traces the shared frontend request contract into either local deterministic fixtures or the authenticated FastAPI path, including schema validation, one-transaction persistence, rollback, identity provisioning, and read routes. It is not evidence of educational effectiveness or hosted-model quality.
