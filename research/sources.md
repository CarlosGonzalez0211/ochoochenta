# Sources

Fill this in as we settle on them. Always confirm kickoff and TV channel on the official source before setting `verified: true`.

| Sport | Source | Trust | Notes |
|-------|--------|-------|-------|
| Liga MX / FC Juárez | Official club + league sites | high | Check for schedule changes the week of the match |
| World Cup / international soccer | FIFA / federation sites | high | |
| NFL | NFL.com schedule | high | Sunday/Monday/Thursday slots; flex scheduling shifts times |
| Boxing / MMA | Promoter site, then ESPN/DAZN/PPV listing | medium | Cards change; re-verify 48h before |
| Aggregators (ESPN, TheSportsDB) | for discovery only | medium | Never the only source for `verified: true` |

## Venue fit
- Prioritize: FC Juárez, Mexico national team, Liga MX Sat/Sun primetime, big boxing/UFC nights, NFL Sundays.
- Skip anything that kicks off outside opening hours.

## Time zones
Mexican TV times are Mexico City time (UTC-6, no DST). Ciudad Juárez follows US DST, so in winter it is 1 hour *earlier* than CDMX. US sources (NFL, UFC, DAZN) are usually ET. Always store the offset the source uses (e.g. `-06:00`, `-05:00`); the site converts to Juárez time.
