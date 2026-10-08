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

## Vessel Fit (calorie tracker + workout plan)

Offline app combining:

- Food / protein / water / weight tracking (ship-mess quick-adds)
- Your **4-day vessel gym spreadsheet** (sets, cues, YouTube form videos, session logging)

Open: [`app/calorie-tracker/`](./app/calorie-tracker/) → `http://localhost:8080/app/calorie-tracker/`

Tabs: **Food** · **Train** · **Progress**

On phone: open in browser → **Add to Home Screen**. Data stays on device.
The Excel source remains at [`docs/fitness/`](./docs/fitness/) if you still want Google Sheets.
