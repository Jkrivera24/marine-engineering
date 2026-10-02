# Marine Engineering

Shipboard references and tools for marine engineers and ETOs.

## Unlisted Alarm Desk

Interactive troubleshooting for:

- **BAM unlisted alerts** (IEC 62923-2 manufacturer IDs `10000–9999999`)
- **AMS/UMS points** missing from the approved alarm list

Open the desk: [`app/index.html`](./app/index.html)

Guides and templates:

- [Unlisted alarm troubleshooting](./docs/unlisted-alarms.md)
- [BAM identifier ranges](./docs/bam-identifiers.md)
- [AMS / UMS procedures](./docs/ams-procedures.md)
- [Investigation template](./docs/templates/alarm-investigation.md)
- [Inhibit register](./docs/templates/inhibit-register.md)

### Run locally

Serve the repo root (required so the app can load `app/data/procedures.json`):

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/app/`.
