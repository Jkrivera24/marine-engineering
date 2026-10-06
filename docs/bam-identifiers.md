# BAM alert identifier ranges (IEC 62923-2)

IEC 62923-2 assigns machine-readable alert identifiers for Bridge Alert Management so similar alerts share common IDs where possible.

| Range | Role | Operational note |
| --- | --- | --- |
| 0001–0099 | Emergency alarms | Emergency use only |
| 0100–0299 | Reserved | Future expansion |
| 0300–9999 | Standard / graded alerts | Use Annex A identifiers when the alert is listed |
| **10000–9999999** | **Unlisted / manufacturer-defined** | Maker must document every ID shipped in the equipment |

## Manufacturer obligations (for the equipment under test)

- Provide a **complete list** of all alerts with assigned identifiers.
- Annex A alerts must use the **standard** identifiers.
- Alerts not listed in Annex A must use **10000–9999999**.
- Cluster identifiers follow Annex B when applicable; otherwise the free range in IEC 62923-1.

## Watchkeeper actions when an unlisted ID appears

1. Treat priority/category seriously even if the text is weak.
2. Look up the ID in the **source equipment** catalogue, not only the CAM summary.
3. If the catalogue is missing on board, log a documentation defect to the maker/manager while still investigating the physical condition.
4. After resolution, store the ID + plain-language meaning in the bridge quick-reference for the next watch.

## Useful distinction

- **Listed alert** — standardised meaning across makers (Annex A).
- **Unlisted alert** — valid maker-specific alert with a private ID range; **not** an optional or ignorable alarm.
