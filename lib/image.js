const CLOUDINARY_HOST = 'res.cloudinary.com';

export function optimizeCloudinaryImage(url, { width, height, crop = false } = {}) {
  if (!url || typeof url !== 'string') return url;

  try {
    const parsed = new URL(url);
    if (parsed.hostname !== CLOUDINARY_HOST) return url;

    const segments = parsed.pathname.split('/').filter(Boolean);
    const uploadIndex = segments.indexOf('upload');
    if (uploadIndex === -1) return url;

    const existingTransformations = segments[uploadIndex + 1] || '';
    const transformation = [
      'f_auto',
      'q_auto',
      width ? `w_${Math.round(width)}` : null,
      height && crop ? `h_${Math.round(height)}` : null,
      crop ? 'c_fill' : null,
    ].filter(Boolean).join(',');

    if (!transformation || existingTransformations) return url;

    segments.splice(uploadIndex + 1, 0, transformation);
    parsed.pathname = `/${segments.join('/')}`;
    return parsed.toString();
  } catch {
    return url;
  }
}
