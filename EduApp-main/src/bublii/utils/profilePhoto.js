export async function prepareProfilePhoto(file) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Choisissez une photo JPEG, PNG ou WebP.');
  if (file.size > 5 * 1024 * 1024) throw new Error('La photo doit peser moins de 5 Mo.');
  let image;
  try { image = await createImageBitmap(file); }
  catch { throw new Error('Cette image ne peut pas être ouverte. Choisissez une autre photo.'); }
  try {
    if (!image.width || !image.height || image.width > 16000 || image.height > 16000) throw new Error('Les dimensions de cette image ne sont pas prises en charge.');
    const scale = Math.min(1, 640 / Math.max(image.width, image.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.width * scale)); canvas.height = Math.max(1, Math.round(image.height * scale));
    const context = canvas.getContext('2d');
    context.fillStyle = '#ffffff'; context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const data = canvas.toDataURL('image/jpeg', .82);
    if (data.length > 350000) throw new Error('Cette photo reste trop volumineuse. Choisissez une image plus simple.');
    return data;
  } finally { image.close(); }
}
