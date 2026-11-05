export function cameraErrorMessage(error) {
  const messages = {
    InsecureContextError: 'La caméra nécessite une adresse HTTPS ou localhost. Ouvre cette page avec une adresse sécurisée.',
    UnsupportedCameraError: 'Ce navigateur ne donne pas accès à la caméra. Ouvre la page dans Chrome, Edge ou Safari.',
    NotAllowedError: 'L’accès à la caméra est refusé. Autorise la caméra dans les réglages du site, puis réessaie.',
    SecurityError: 'La caméra est bloquée dans cette fenêtre. Ouvre cette page dans ton navigateur, puis autorise la caméra.',
    NotFoundError: 'Aucune caméra trouvée. Branche ou active une caméra, puis réessaie.',
    NotReadableError: 'La caméra est occupée ou désactivée. Ferme les autres applications qui l’utilisent, puis réessaie.',
    TimeoutError: 'La caméra ne répond pas. Vérifie la demande d’autorisation du navigateur, puis réessaie.',
    VideoTimeoutError: 'La caméra ne transmet pas d’image. Vérifie ta caméra puis réessaie.',
  };
  return messages[error?.name] || 'La caméra ne peut pas démarrer. Vérifie son autorisation et réessaie.';
}
export function openCamera({ signal, timeout = 20000, facingMode = 'user', mediaDevices = navigator.mediaDevices, secure = window.isSecureContext } = {}) {
  if (!secure) return Promise.reject(new DOMException('HTTPS required', 'InsecureContextError'));
  if (!mediaDevices?.getUserMedia) return Promise.reject(new DOMException('Camera API missing', 'UnsupportedCameraError'));
  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (error, stream) => {
      if (settled) { stream?.getTracks().forEach(track => track.stop()); return; }
      settled = true; clearTimeout(timer); signal?.removeEventListener('abort', abort);
      if (error) reject(error); else resolve(stream);
    };
    const abort = () => finish(new DOMException('Cancelled', 'AbortError'));
    const timer = setTimeout(() => finish(new DOMException('Camera timeout', 'TimeoutError')), timeout);
    signal?.addEventListener('abort', abort, { once: true });
    if (signal?.aborted) { abort(); return; }
    const request = async () => {
      try { return await mediaDevices.getUserMedia({ audio: false, video: { facingMode: { ideal: facingMode }, width: { ideal: 640 }, height: { ideal: 480 } } }); }
      catch (error) {
        if (error.name === 'OverconstrainedError' && !signal?.aborted) return mediaDevices.getUserMedia({ audio: false, video: true });
        throw error;
      }
    };
    request().then(stream => finish(null, stream), error => finish(error));
  });
}
export async function playCamera(video, stream, signal) {
  video.srcObject = stream;
  video.muted = true;
  await video.play();
  if (video.readyState >= 2 && video.videoWidth > 0) return;
  await new Promise((resolve, reject) => {
    const cleanup = () => { clearTimeout(timer); video.removeEventListener('loadeddata', ready); signal.removeEventListener('abort', abort); };
    const ready = () => { if (video.videoWidth > 0) { cleanup(); resolve(); } };
    const abort = () => { cleanup(); reject(new DOMException('Cancelled', 'AbortError')); };
    const timer = setTimeout(() => { cleanup(); reject(new DOMException('No video frames', 'VideoTimeoutError')); }, 10000);
    video.addEventListener('loadeddata', ready); signal.addEventListener('abort', abort, { once: true });
    if (signal.aborted) abort(); else ready();
  });
}
