# NOR-41 QA Spot Check

- Generated: 2026-04-15T05:51:11.1046496Z
- Routes checked: 8
- Overall pass: 8/8
- Title parity: 8/8
- Meta description parity: 8/8
- Canonical parity: 8/8
- H1 parity: 8/8

| Path | Title | Meta | Canonical | H1 | Template Marker | Overall |
|---|---|---|---|---|---|---|
| / | pass | pass | pass | pass | no | pass |
| /seo-beratung/ | pass | pass | pass | pass | no | pass |
| /seo-neumuenster/ | pass | pass | pass | pass | no | pass |
| /agentur/ | pass | pass | pass | pass | no | pass |
| /category/wissen/ | pass | pass | pass | pass | no | pass |
| /impressum/ | pass | pass | pass | pass | no | pass |
| /kontakt/ | pass | pass | pass | pass | no | pass |
| /ueber-uns/ | pass | pass | pass | pass | no | pass |

## Notes

- Runtime spot-check executed against local Next.js app on port 4173.
- Observed titles are single-suffix (no duplicate `| NordPush`) on targeted routes.
- `/category/wissen/` renders visible H1 parity (`Wissen`).
