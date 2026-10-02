# AMS / UMS unlisted-point procedures

Use this when the machinery Alarm Monitoring System shows a point that is absent from the approved alarm list, set-point schedule, or maker IOM.

## Immediate classification

| Pattern | Likely class | First move |
| --- | --- | --- |
| Single unknown tag, stable value | Undocumented config / spare channel | Freeze ID, search AMS database + red-line drawings |
| Unknown tag after yard/service | Orphaned retrofit point | Compare I/O map versions and last download |
| Cluster in one zone | Power, earth, rack, or serial flood | Check 24 V earth monitor and supply ripple; raise manning if needed |
| Extension call with weak panel text | Presentation / first-up masking | Correlate history timestamps; repair HMI text |

## Safe isolation notes

- Cancel UMS / increase watchkeeping if protection confidence is low.
- Trace **positive earth** by isolating branch fuses only when logged and safe.
- Trace **negative earth** by lifting instrument earths methodically with labels — only under active watchkeeping.
- Prefer proving the loop at the **sensor**, then confirming panel priority, audible, and extension.

## Close-out standard

A point is not closed until **all** are true:

1. Process or signal root cause corrected (or point deliberately removed).
2. Alarm list / set-point schedule updated.
3. Configuration backup stored with version/location.
4. Function test recorded (sensor → AMS → extension as fitted).
5. Any inhibit sits in the inhibit register with restore-by time.
