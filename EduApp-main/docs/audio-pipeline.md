# Audio pipeline

The app never synthesises speech at runtime (the `SpeechEngine` falls back to silence if a
file is missing). Audio is pre-generated once and shipped as static wav files.

## Where the pieces live

| Piece | Location |
| --- | --- |
| Phrase inventory (source of truth) | `src/data/recordingsManifest.js` |
| Text → file name mapping | `getRecordingPath()` in the same file |
| Audio output | `public/recordings/{fr,ar}/{girl,boy}/*.wav` |
| File index | `public/recordings/manifest.json` |
| Speaker samples | `reference_voices/XTTSV2/{French,Frenchgirl,Arabicboy,Arabicgirl}/` |

Four voices exist: `fr/girl`, `fr/boy`, `ar/girl`, `ar/boy`. Each one is an XTTS-v2
clone driven by its own reference clip.

## File naming

`getRecordingPath()` performs:

1. lowercase + trim;
2. explicit overrides (`î → i_chapeau`, `é → e_accent`, `ç → c_cedille`);
3. for Arabic, strip harakat and look the phrase up in `AR_MAPPINGS` (which is why the
   files are often named after a transliterated key such as `qalam`, `baa`, `ummi`);
4. otherwise: non-`[a-z0-9\u0600-\u06FF]` characters become `_`, collapsed, trimmed,
   truncated to 50 chars.

Phrase variants are plain suffixes: `rouge.wav` is the accepted take, `rouge_v2.wav` and
`rouge_v3.wav` are auditions. Only the un-suffixed file is played by the app, so a variant
must be promoted (copied over the base name) before it is heard.

## Typical workflow

1. **Add phrases** to `src/data/recordingsManifest.js` (and to `content.js` if they are
   new activity items).
2. **Generate** — either:
   - `node scripts/generate-recordings.mjs` against a running XTTS backend
     (`TTS_BACKEND_URL`, default `http://localhost:7860`); it skips existing files and
     rewrites `manifest.json`, or
   - `python scripts/generate_recordings_direct.py` for a quick local `pyttsx3` pass.
3. **Audition** with `public/test-french-variants.html` / `test-arabic-variants.html`, or
   the ad-hoc scripts in `scripts/audio/test/`.
4. **Fix** the occasional bad take with a targeted script in `scripts/audio/fix/`
   (each one holds the exact text it re-synthesises).
5. **Promote** the take you like via `scripts/audio/curate/apply_*_selections.mjs`,
   which copies `key_vN.wav` over `key.wav` for the listed keys.
6. **Audit** coverage with `scripts/audio/audit/check_missing_audio.mjs` or
   `validate_tts_paths.mjs` — they replicate the path logic, so a mismatch here means the
   app will look for a file that does not exist.

## How the script folders differ

- `generate/` — batch jobs driven by the manifest or a full phrase list. Safe to re-run:
  existing files are skipped.
- `regen/` — re-synthesise a specific set of keys, often several variants at once.
  `REGEN_ALL_AR_PERFECTION.py` chains the Arabic boy/girl passes.
- `fix/` — one or two bad-sounding files, with phonetic rewrites in the source text
  (`"Le père."` instead of `"père"`, added articles, extra punctuation for intonation).
- `curate/` — selects variants, renames files to the expected convention, exports
  age/activity sorted copies (`final girl arabic/`, `final girl backup/`).
- `audit/` — read-only checks: which keys lack files, wav durations, filename drift
  against the mapping.
- `test/` — smoke tests for a reference voice or a handful of phrases.

## Environment notes

Nearly all Python scripts address the project by absolute path, following the original
Docker setup:

```bat
docker run --rm -v "<project>:/mnt/EDUAPP" -w /mnt/EDUAPP xtts-tester python <script>
```

They therefore expect `/mnt/EDUAPP` (Linux container) and write directly into
`/mnt/EDUAPP/public/recordings/...`. When reusing them on a new machine, either keep that
mount convention or replace the prefix with a path derived from the script location.
The handful of scripts that use project-relative paths resolve them from
`Path(__file__)` / `import.meta.url`, so they work from any working directory.
