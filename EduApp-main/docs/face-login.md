# Local child access

In the authenticated parent area, open **Son accès**. Each child has a personal eight-digit code. **Créer un nouveau code** invalidates the previous code immediately on this device.

Choose **Enregistrer son visage**, grant parental consent and camera permission, then let the child look at the camera for three consistent samples. Enrollment and deletion are available only in the parent area.

On `/connexion/enfant`, the camera starts automatically if a registered face is available. Two consecutive, unambiguous matches open the matching child's workspace without profile selection. Camera permissions may still require browser approval. If recognition is unavailable, a parent can enter the child's code. There is no unrestricted camera bypass.

Setup is specific to this browser and device. After adult logout, face/code entry loads only the registered child's basic activity workspace; it does not authenticate an adult or expose the parent dashboard. The child shortcut stores identity and settings locally; it does not sync adult progress or calendar data across accounts or devices.

Raw photos and video are not saved or uploaded. Three descriptors remain in local storage until deleted or site data is cleared. This is a local convenience shortcut without liveness detection or protected child account sessions. It has not been validated for children with Down syndrome. Codes are stored locally so parents can retrieve them; they are not server account credentials.

Camera access requires HTTPS or localhost. Camera tracks are released on stop, navigation, hidden tabs, cancellation and late permission responses. Models and runtime are served from `public/assets/face-login`.

Validation: `node --test scripts/test-login-camera.mjs src/bublii/utils/childAccess.test.js`, `npm run test:auth`, and `npm run build`.
