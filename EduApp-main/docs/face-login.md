# Local face login

Visit `/connexion/enfant` or `/login/enfant`. There are no fictional children: the app starts with one neutral local workspace and no invented progress. Older sessions containing the three demo children are migrated automatically.

**Ouvrir la caméra** always requests camera access, including when no face has been registered. The camera status becomes active only after actual video frames arrive. With an adult, tick the consent box and press **Enregistrer mon visage** to collect three consistent face descriptors. Afterwards, **Me reconnaître** checks two consecutive matches and opens the local workspace. No typing or profile selection is needed.

Permission refusal, missing camera, busy hardware, unsupported browser, insecure address and unanswered permission prompts have separate messages. Failed recognition loading leaves a working preview open. **J’ai besoin d’aide → Continuer sans caméra** opens the activities without fictional profiles.

Camera access requires HTTPS or localhost and browser permission. Embedded windows may block access: open the page directly in Chrome, Edge or Safari if that happens. Camera tracks are released on stop, navigation, hidden tabs, cancellation and late permission responses.

Images remain in memory; raw photos and video are not saved or uploaded. Three face descriptors are stored locally until **Supprimer le visage enregistré** or clearing site data. This is a local convenience shortcut, without liveness detection or protected account sessions. It has not been validated for children with Down syndrome.

The locally hosted runtime and models are `@vladmandic/face-api` 1.7.15, with the license in `public/assets/face-login`. Only detection, landmarks and identity descriptors are used. GPU inference falls back to CPU if necessary.

Regression checks: `node --test scripts/test-login-camera.mjs` and `npm run build`.
