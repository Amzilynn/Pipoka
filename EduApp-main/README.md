# EduApp

A bilingual (French / Arabic) educational web app for children aged 3–5. Kids pick an
age level, a language and a voice, then play drag-and-drop activities that teach
family members, colours, shapes, the alphabet and numbers. Every instruction and item
is spoken aloud.

Built with React 18, Vite 6, React Router, Framer Motion, dnd-kit and Tailwind.

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run preview  # serve the build
```

## How the app works

```
index.html
src/
├── main.jsx                   app entry
├── App.jsx                    routes: /  →  /categories  →  /activity/:categoryId
├── screens/
│   ├── ConfigScreen           level (3/4/5) + language (fr/ar) + voice (girl/boy)
│   ├── CategoryMenuScreen     subject cards for the chosen level
│   └── ActivityScreen         runs one activity
├── components/
│   ├── activities/            the five activity types
│   │   • ColorMixer           mix two colours
│   │   • DragTextToImage      drag a word onto the right picture
│   │   • DragImageToZone      drag a picture onto a zone
│   │   • LetterSequencer      order letters to spell a word
│   │   • NumberMatcher        match a number to a quantity
│   ├── layout/ feedback/      ScreenWrapper, SuccessOverlay
│   ├── ui/                    buttons, tiles, cards, drag chips
│   └── illustrations/ icons/  SVG artwork for each subject
├── context/SettingsContext    level, language, voice (in-memory)
├── data/
│   ├── content.js             all activity content, per level and language
│   └── recordingsManifest.js  phrase list + text → audio path mapping
├── hooks/useSpeech.js         thin React wrapper around the speech engine
└── utils/tts.js               plays local recordings, keeps voice preferences
public/
├── assets/images               activity artwork (family, colours, shapes, 3d/)
├── recordings/                 manifest.json + generated .wav per voice
└── test-*.html                 standalone pages for auditioning recordings
```

### Audio

`utils/tts.js` plays a pre-generated recording from `public/recordings/<lang>/<voice>/`.
`getRecordingPath()` in `src/data/recordingsManifest.js` normalises a phrase into the
file name: lowercase, non-alphanumerics → `_`, Arabic diacritics stripped, 50 chars max.
Audio is served as `/recordings/...` and is **not** in the repo — see
[docs/audio-pipeline.md](docs/audio-pipeline.md) for how it is produced.

## Tooling

| Path | Purpose |
| --- | --- |
| `scripts/generate-recordings.mjs` | Main generator: reads `src/data/recordingsManifest.js`, calls the XTTS backend (`TTS_BACKEND_URL`, default `http://localhost:7860`), writes wavs + `manifest.json` |
| `scripts/generate_recordings_direct.py` | Offline variant using local `pyttsx3` (no XTTS server needed) |
| `scripts/audio/generate/` | Bulk/parameterised generation from phrase lists |
| `scripts/audio/regen/` | Targeted regeneration of specific phrases |
| `scripts/audio/fix/` | Surgical repairs of individual files |
| `scripts/audio/curate/` | Promote a chosen `_vN` variant to the final file, export sorted folders |
| `scripts/audio/audit/` | Coverage/format/filename audits and mapping checks |
| `scripts/audio/test/` | Throw-away synthesis smoke tests |
| `scripts/audio/docker/` | `.bat`/`.ps1` wrappers that run scripts in the `xtts-tester` container |
| `scripts/data/` | Reference dumps of keys and file inventories |
| `archive/` | Pre-existing logs, installer, crash dumps — untracked |
| `reference_voices/` | Speaker samples per language/voice (local, gitignored) |

## Known gaps / things to fix in a new project

- **No recordings are present.** `public/recordings/` only holds `manifest.json` and a
  README, so the UI runs but stays silent. Generate audio (see the pipeline doc) or
  copy the wav files in.
- **Legacy Docker path.** Most `scripts/audio/*` Python scripts hardcode `/mnt/EDUAPP`,
  and the `.bat` wrappers mount `C:\Users\Dr.console\Desktop\EDUAPP-Antigravity`. They
  were written for the original machine. Either mount this project at `/mnt/EDUAPP` or
  update those paths if you reuse them.
- **`server/` and `xtts-backend/` are empty leftovers** (also gitignored) from an earlier
  TTS backend attempt; nothing references them.
- **Scratch scripts assume local XTTS-v2** (`pip install TTS`) and `ffmpeg` on `PATH`.
- `src/data/content.js` and `recordingsManifest.js` must stay in sync by hand: a phrase
  added to content without a manifest entry will simply fail to speak.
