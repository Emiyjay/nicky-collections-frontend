import { TIKTOK_URL, INSTAGRAM_URL, CONTACT_EMAIL, SITE_URL } from './site';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const clean = (value) => String(value ?? '').trim();

export const productUrl = (product) => {
  const identifier = clean(product?.slug) || clean(product?._id);
  return identifier ? `${SITE_URL}/product/${encodeURIComponent(identifier)}` : SITE_URL;
};

export const openProductEmailFallback = ({ product, productName, price, userName, customerEmail, customerPhone, color, size, quantity = 1, deliveryLocation, notes }) => {
  const name = clean(productName || product?.name) || 'Product';
  const amount = Number(price ?? product?.price);
  const url = productUrl(product || {});
  const description = clean(product?.description) || 'Product description available on the product page.';
  const imageUrls = Array.isArray(product?.images) ? product.images.map((image) => clean(image?.url)).filter(Boolean) : [];
  const subject = `Order Inquiry — ${name}`;
  let body = `Hello Nicky Collections,\n\nI would like to order this product.\n\nPRODUCT DETAILS\nProduct: ${name}\n`;
  if (Number.isFinite(amount)) body += `Price: $${amount.toFixed(2)}\n`;
  body += `Quantity: ${quantity}\n`;
  if (color) body += `Color: ${clean(color)}\n`;
  if (size) body += `Size: ${clean(size)}\n`;
  if (userName) body += `Customer name: ${clean(userName)}\n`;
  if (customerEmail) body += `Customer email: ${clean(customerEmail)}\n`;
  if (customerPhone) body += `Customer phone: ${clean(customerPhone)}\n`;
  if (deliveryLocation) body += `Delivery location: ${clean(deliveryLocation)}\n`;
  body += `Availability: Please confirm availability.\n\nDESCRIPTION\n${description}\n\nPRODUCT PAGE\n${url}\n\n`;
  if (notes) body += `CUSTOMER NOTES\n${clean(notes)}\n\n`;
  if (imageUrls.length) body += `PRODUCT IMAGES\n${imageUrls.map((imageUrl, index) => `${index + 1}. ${imageUrl}`).join('\n')}\n\n`;
  body += 'Please let me know the next steps, delivery options and payment details.\n\nThank you.\n';
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

export const sendProductInquiry = async ({ product, productName, price, userName = null, customerEmail = null, customerPhone = null, color = null, size = null, quantity = 1, deliveryLocation = null, notes = null }) => {
  const identifier = clean(product?.slug) || clean(product?._id);
  if (!identifier || typeof window === 'undefined') return { sent: false, fallback: true, message: 'The product could not be identified.' };

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(`${API_URL}/site/product-inquiry`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: controller.signal,
      body: JSON.stringify({ productId: product?._id || undefined, productSlug: product?.slug || undefined, color: color || undefined, size: size || undefined, quantity, customerName: userName || undefined, customerEmail: customerEmail || undefined, customerPhone: customerPhone || undefined, deliveryLocation: deliveryLocation || undefined, notes: notes || undefined, productUrl: productUrl(product) })
    });
    const data = await response.json().catch(() => ({}));
    if (response.ok) return { sent: true, fallback: false, reference: data.reference || null };
    return { sent: false, fallback: response.status >= 500, message: data.message || 'We could not send your inquiry.' };
  } catch (error) {
    console.warn('Direct product inquiry unavailable; email fallback will be used.', error);
    return { sent: false, fallback: true, message: 'The direct inquiry service is temporarily unavailable.' };
  } finally { window.clearTimeout(timeout); }
};

export const orderOnEmail = ({ product, productName, price, userName = null, userEmail = null, color = null, size = null }) => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('nc:order', { detail: { product, productName, price, userName, userEmail, color, size } }));
};

export const contactOnEmail = ({ name = '', email = '', subject = '', message = '' } = {}) => {
  const mailSubject = subject ? `${clean(name) ? `${clean(name)} — ` : ''}${clean(subject)}` : 'Nicky Collections Inquiry';
  const body = [`Name: ${clean(name)}`, `Email: ${clean(email)}`, '', clean(message)].join('\n');
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(body)}`;
};

export { TIKTOK_URL, INSTAGRAM_URL };
