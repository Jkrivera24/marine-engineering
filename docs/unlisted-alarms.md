# Unlisted Alarm Troubleshooting

Practical shipboard reference for alarms that are **active but not covered by the standard / approved list**:

1. **Bridge Alert Management (BAM)** — manufacturer-defined alerts under **IEC 62923-2** with identifiers in **10000–9999999**
2. **Engine-room AMS / UMS** — points that appear on the AMS/HMI but are missing from the approved alarm list, set-point schedule, or IOM

Use the interactive desk: [`../app/index.html`](../app/index.html)

## Standing rules

- An unlisted alarm is still an alarm. Silence is not a repair.
- Do not permanently inhibit or widen a set point without owner, reason, and restore-by time.
- If protection or bridge awareness is in doubt, increase manning / cancel UMS / use backup navigation methods.
- Capture identifier, source, time, and operating context **before** resetting equipment.
- Close the loop in documentation: alarm list, BAM quick-reference, and configuration backup.

## BAM path (navigation)

1. Record alert ID, priority/category, source equipment, CAM state, and mode.
2. If ID ≥ 10000, open that equipment’s maker BAM catalogue (required by IEC 62923-2).
3. Confirm whether a real equipment/interface/power fault exists.
4. Apply maker bridge procedure; keep backups in use until clear.
5. Add the proven ID meaning to the vessel’s local quick-reference.

## AMS path (machinery)

1. Freeze tag/point number, text, group, value, and time.
2. Search configuration database **and** paper lists — many “unlisted” points exist in software only.
3. Prove process vs signal with local gauge / contact check, then power/earth/comms.
4. Commission and document legitimate new points; remove leftovers.
5. Function-test sensor → AMS → extension before returning to UMS.

## Related files

- [BAM identifier ranges](./bam-identifiers.md)
- [AMS / UMS procedures](./ams-procedures.md)
- [Investigation template](./templates/alarm-investigation.md)
- [Inhibit register template](./templates/inhibit-register.md)
