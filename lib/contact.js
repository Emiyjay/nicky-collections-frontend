import {
  TIKTOK_URL,
  INSTAGRAM_URL,
  CONTACT_EMAIL,
  SITE_URL,
} from './site';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const clean = (value) => String(value ?? '').trim();

const productUrl = (product) => {
  const identifier = clean(product?.slug) || clean(product?._id);
  return identifier ? `${SITE_URL}/product/${encodeURIComponent(identifier)}` : SITE_URL;
};

const buildMailto = ({ product, productName, price, userName, color, size }) => {
  const name = clean(productName || product?.name) || 'Product';
  const amount = Number(price ?? product?.price);
  const url = productUrl(product || {});
  const description = clean(product?.description) || 'Product description available on the product page.';
  const imageUrls = Array.isArray(product?.images)
    ? product.images.map((image) => clean(image?.url)).filter(Boolean)
    : [];

  const subject = `Order Inquiry — ${name}`;
  let body = `Hello Nicky Collections,\n\nI would like to order this product.\n\n`;
  body += `PRODUCT DETAILS\nProduct: ${name}\n`;
  if (Number.isFinite(amount)) body += `Price: $${amount.toFixed(2)}\n`;
  if (color) body += `Color: ${clean(color)}\n`;
  if (size) body += `Size: ${clean(size)}\n`;
  if (userName) body += `Customer name: ${clean(userName)}\n`;
  body += `Availability: Please confirm availability.\n\nDESCRIPTION\n${description}\n\nPRODUCT PAGE\n${url}\n\n`;
  if (imageUrls.length) {
    body += 'PRODUCT IMAGES\n';
    imageUrls.forEach((imageUrl, index) => { body += `${index + 1}. ${imageUrl}\n`; });
    body += '\n';
  }
  body += 'Please let me know the next steps, delivery options and payment details.\n\nThank you.\n';

  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

export const orderOnEmail = async ({
  product,
  productName,
  price,
  userName = null,
  color = null,
  size = null,
}) => {
  const identifier = clean(product?.slug) || clean(product?._id);

  if (!identifier || typeof window === 'undefined') {
    if (typeof window !== 'undefined') buildMailto({ product, productName, price, userName, color, size });
    return { sent: false, fallback: true };
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(`${API_URL}/site/product-inquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        productId: product?._id || undefined,
        productSlug: product?.slug || undefined,
        color: color || undefined,
        size: size || undefined,
        quantity: 1,
        customerName: userName || undefined,
        productUrl: productUrl(product),
      }),
    });

    if (response.ok) {
      const data = await response.json().catch(() => ({}));
      return { sent: true, fallback: false, reference: data.reference || null };
    }
  } catch (error) {
    console.warn('Direct product inquiry unavailable; opening email draft instead.', error);
  } finally {
    window.clearTimeout(timeout);
  }

  buildMailto({ product, productName, price, userName, color, size });
  return { sent: false, fallback: true };
};

export const contactOnEmail = ({ name = '', email = '', subject = '', message = '' } = {}) => {
  const mailSubject = subject ? `${clean(name) ? `${clean(name)} — ` : ''}${clean(subject)}` : 'Nicky Collections Inquiry';
  const body = [`Name: ${clean(name)}`, `Email: ${clean(email)}`, '', clean(message)].join('\n');
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(body)}`;
};

export { TIKTOK_URL, INSTAGRAM_URL };
