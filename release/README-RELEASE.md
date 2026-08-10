# Where the Last Light Sleeps 1.1.0 — Bilingual Windows RC2

## Playtest Artifact

`windows/TheLastLight-1.1.0-win-x64.exe` is a portable Windows x64 build. It requires no installation.

English is the default language. Select **Settings · Accessibility → Language / 언어 → 한국어** to play the complete Korean version. Language choice persists locally and can be changed during a saved voyage.

## Steam/Store Depot Artifact

Upload the contents of `steampipe/content/` as the Windows depot. Configure the launch executable as `TheLastLight.exe` with no arguments.

The game runs entirely offline. The renderer is sandboxed, Node integration is disabled, and external navigation and permission requests are blocked.

## Verification

- English full completion: pass
- Korean full completion: pass
- 42 scenes, 14 encounters, 7 voyages, 5 storm choices, 4-stage broadcast, hidden dawn ending: pass in both languages
- English runtime Hangul residue: 0
- Desktop default-English and Korean language switch: pass
- Version: 1.1.0 RC2
- Executable signature: unsigned

Public paid distribution still requires final publisher/legal confirmation, a code-signing decision, and external blind playtests.
