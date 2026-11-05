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
npm run preview  # serve the build with the account API
npm start        # standalone app + account API, port 5174
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

## Parent and specialist accounts

Requires Node.js 22.13 or newer (tested with Node 24). The landing page leads to
`/connexion`, where adults choose Parent or Specialist and sign in or create an
account. Children keep the existing on-device face-recognition flow, including
adult-assisted setup. Child recognition is a convenience flow, not an adult session.

`npm run dev`, `npm run preview`, and `npm start` all expose the same account API.
Accounts and sessions persist in `.data/auth.sqlite` (excluded from Git). Passwords
use salted scrypt hashes; random session tokens are stored hashed server-side and
sent in HttpOnly, SameSite cookies. Sessions expire after seven days and are revoked
on logout. Adult pages require the corresponding server-issued account role;
changing a browser-stored role never authenticates an adult. The same email can
have separate Parent and Specialist accounts. Names and roles are self-declared;
creating a Specialist account does not verify professional credentials.

Workspace, calendar, routines and observation data remain browser-local and are
namespaced by account. They do not sync across devices or accounts. Existing child
face descriptors remain on the device and are not uploaded. Email ownership
verification and password recovery are not implemented: an email delivery service
must be connected before adding those flows.

For deployment, run `npm run build` then `npm start` behind an HTTPS reverse proxy.
Set `NODE_ENV=production`, `AUTH_ORIGIN` to the exact public HTTPS origin, and persist
`AUTH_DATABASE_PATH` on the server. Secure cookies are enabled for HTTPS origins.
Never serve only `dist/` on static hosting: the account API needs the Node process.
Back up the database and restrict filesystem access to the server account.

Run `npm run test:auth` for account persistence, password checking, role separation,
session rotation, expiry, logout, cross-origin rejection, and rate-limit checks.

## Child lists and associations

A parent account is restricted server-side to one associated child. Specialist
accounts can manage multiple child profiles. The parent dashboard focuses on that
child; the specialist opens individual dossiers from a searchable directory. Selecting a child opens that child's dossier; local game progress, routines,
settings, calendar tasks, and observations stay separated by child ID.

The profile creator can generate a code for an adult in the opposite role. The
other adult chooses **Associer avec un code** on their dashboard. This links the
same child ID to both accounts. Codes expire after 24 hours, work once, are stored
hashed server-side, and are replaced when a new code is generated. Associated adults
cannot create further invitations for a profile they do not own. There is no public
child search. Child metadata and memberships persist in the account database and
are available on other devices after sign-in. Existing educational records still
remain local to each account/browser; association does not sync those records.

When a signed-in adult prepares face recognition, the child login offers a profile
choice if their list contains multiple children. Recognition/enrollment applies only
to the selected child and face descriptors remain on that device.

## Shared child profiles

Both linked adults can open **Modifier le profil** for the selected child. Profiles
include first and last name, optional age, a photo, observed behavior, strengths,
support needs, communication, interests, calming strategies, and other useful notes.
These fields are saved on the server and shared with associated adults. Use
**Actualiser le profil** to retrieve another adult's changes. Conflicting edits are
rejected so an older form cannot silently overwrite a newer profile.

Photo uploads accept JPEG, PNG, or WebP files up to 5 MB. The browser resizes and
re-encodes them before uploading (maximum stored size: 256 KB). Photos are served
only to authenticated adults associated with the child, without public image URLs.
Removing a photo deletes its stored bytes. A profile photo is separate from the
on-device face-recognition descriptors and does not enroll a child's face.

## Family dashboard and specialist directory

The parent workspace has Overview, Calendar, Profile and Settings tabs. It shows
only the parent's associated child. Existing parent memberships are retained in
the database, while a single primary child (Peter when present) controls list,
profile, photo and invitation access. A parent cannot add or associate a second
child. The specialist directory lists authorized children and opens dossiers using
`/specialiste?child=<id>`; dossier tools preserve this child selection in the URL.

Representative content requested for presentation is initialized once per child:
Peter for a new parent, and Peter, Lina, Youssef, Emma, Noah and Amir for a specialist.
Existing matching children and populated profile fields are preserved. Activity
history uses the internal `presentation` source, distinct from recorded completions;
the interface does not display sample labels. Reloads do not reset seeded dates,
new completions, edited tasks, archived tasks or checked routine steps.

Parent tasks have a date, optional daily recurrence, a time and short steps. The
child follows the same routines at `/enfant/routines`. Checking a step updates the
parent's task progress within the same signed-in account/browser. These routines
still use local storage, rather than cross-device synchronization. The specialist's
representative roster is private to that account; unrelated real child records are
never exposed by roster initialization.
