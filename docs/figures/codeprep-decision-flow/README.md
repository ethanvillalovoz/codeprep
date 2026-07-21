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

The sequence diagram contrasts the shared frontend request in demo and live modes across browser, adapter, identity, API, model, and database lifelines. It makes schema validation, one-transaction persistence, rollback, identity provisioning, and read routes explicit. It is not evidence of educational effectiveness or hosted-model quality.
