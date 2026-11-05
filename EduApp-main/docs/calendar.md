# Calendar: photos and voice

The calendar uses the existing Bublii palette, typography and logo. Adults create tasks at /parent/calendrier or /specialiste/calendrier; children follow them at /enfant/calendrier.

## Start photo verification

1. Install Ollama if needed: https://ollama.com
2. Run `ollama pull qwen2.5vl:3b` once (a multi-GB download).
3. Start Ollama with `ollama serve` if its desktop service is not already running.
4. Restart `npm run dev` after updating this app's Vite config.

No API key is needed. Optional server settings are in .env.example; copy to .env.local to override the host or vision model. The selected model must support images and structured JSON output. Existing text-only models cannot check photos.

The same endpoint is available with `npm run preview`. For a static production deployment, provide a server route for POST /api/calendar/verify using services/calendarVision.mjs; static hosting alone cannot run local vision. A remote deployment needs a reachable server-side Ollama host.

## Verification behavior

Photos are decoded, resized to at most 1280px and sent to the local vision service. The model checks the current step's visible result, including whether the requested object is INSIDE the bag. It returns verified, retry, or uncertain and a short French instruction. Only verified results with confidence at least 0.85 unlock the next step. An unavailable service, ambiguous photo, rejected result or storage failure never completes a step. Confidence is model-reported, not calibrated accuracy; photo checking is assistance and cannot prove hidden contents or an action's history.

Only accepted compressed photos and verification metadata are saved in IndexedDB on the current device. Old photos without a verification record remain available in storage but require a new verified photo before progressing. Steps are checked sequentially. No face identification is used. The camera opens a live preview on desktop and mobile (preferring the rear camera), takes one still photo, and releases the camera when captured, cancelled or closed. “Choisir une photo” provides a file-picker fallback.

## Voice

Écouter reads the current instruction using the existing French speech helper. Parler accepts “aide”, “répète”, “photo”, “aujourd’hui”, and “demain”. Voice never marks a step complete. All operations remain accessible with buttons. Microphone denial, no speech and unsupported browsers show French guidance. Speech recognition support varies; Chrome is recommended. Browser recognition may use the browser vendor's remote service and requires microphone permission. Microphone and speech output stop when leaving the calendar.

## Checks

`npm run build`
`node --test scripts/test-calendar-vision.mjs`

For real-model validation, try a notebook inside an open bag (accept), beside a bag (retry), a closed bag for the notebook step (uncertain/retry), and a blurry/unrelated image (retry/uncertain). Check permission denial and reload persistence. Automated tests use an injected model response and do not establish real-model accuracy.

The local model may take several minutes to load on the first check; requests allow up to four minutes and model output is bounded. After a check, Ollama keeps the model loaded for 30 minutes for faster reuse. On this machine a warm blank-image check took about 25 seconds and returned retry; this is a connectivity/rejection smoke check, not a validation of accuracy on real bag photos.

Optional browser integration check: node scripts/test-calendar-browser.mjs (requires Playwright and installed Chrome). It uses a fake camera and controlled vision/voice responses; screenshots are saved in artifacts/calendar. It checks desktop/mobile layout, speech output, voice navigation, camera capture, photo rejection/acceptance, sequential unlocking, persistence and adult task creation.

## Visual support and accessible steps

The outing example uses photographs of objects and places (transport card, bus stop, bus, seats and pharmacy). Short first-person instructions remain visible in full; opening one step closes the previous one. Audio starts only with the explicit listen button and stops when switching steps or leaving. Controls have large touch targets, keyboard focus and expanded-state labels. The example is an accompanied outing, not a real itinerary. Parents can choose these same photographs when creating their own activities.

Support needs vary by child; these changes are interface accommodations, not evidence of user validation. Prefer familiar objects and actual places for an individual child's plan. Guidance consulted: https://www.northerncarealliance.nhs.uk/patient-information/patient-leaflets/speech-and-language-therapy-communication-advice-children-downs-syndrome . Photo sources and licenses are listed in public/assets/images/day-routine/SOURCES.md.

## Focused child calendar

The child route uses a separate daily view: Today/Tomorrow navigation, a compact activity list and one active instruction with its picture, audio and camera actions. The example, other dates, microphone help and display settings are disclosures rather than competing primary panels. Large text and the optional step overview are saved locally. Only a verified photo advances a real activity; opening an example never changes the plan. The adult month calendar and task creation remain available on adult routes.
