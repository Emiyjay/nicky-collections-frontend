const CLOUDINARY_HOST = 'res.cloudinary.com';
const TRANSFORMATION_MARKERS = new Set(['f_auto', 'q_auto']);

function isTransformationSegment(segment) {
  return segment.includes(',') || segment.startsWith('f_') || segment.startsWith('q_') || segment.startsWith('w_') || segment.startsWith('h_') || segment.startsWith('c_') || segment.startsWith('dpr_');
}

export function optimizeCloudinaryImage(url, { width, height, crop = false } = {}) {
  if (!url || typeof url !== 'string') return url;

  try {
    const parsed = new URL(url);
    if (parsed.hostname !== CLOUDINARY_HOST) return url;

    const segments = parsed.pathname.split('/').filter(Boolean);
    const uploadIndex = segments.indexOf('upload');
    if (uploadIndex === -1) return url;

    const nextSegment = segments[uploadIndex + 1] || '';
    const hasExistingTransformation = isTransformationSegment(nextSegment);
    const existing = hasExistingTransformation ? nextSegment.split(',') : [];
    const additions = [];

    for (const marker of TRANSFORMATION_MARKERS) {
      if (!existing.includes(marker)) additions.push(marker);
    }

    if (width && !existing.some((item) => /^w_\d+$/.test(item))) {
      additions.push(`w_${Math.round(width)}`);
    }

    if (height && crop && !existing.some((item) => /^h_\d+$/.test(item))) {
      additions.push(`h_${Math.round(height)}`);
    }

    if (crop && !existing.some((item) => item === 'c_fill')) {
      additions.push('c_fill');
    }

    if (!additions.length) return url;

    if (hasExistingTransformation) {
      segments[uploadIndex + 1] = [...additions, ...existing].join(',');
    } else {
      segments.splice(uploadIndex + 1, 0, additions.join(','));
    }

    parsed.pathname = `/${segments.join('/')}`;
    return parsed.toString();
  } catch {
    return url;
  }
}
