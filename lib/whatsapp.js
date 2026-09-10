import {
  WHATSAPP_NUMBER,
  WHATSAPP_LINK,
  PHONE_LINK,
  SMS_LINK,
  TIKTOK_URL,
  INSTAGRAM_URL,
  CONTACT_EMAIL,
  SITE_URL,
} from './site';

const clean = (value) => String(value ?? '').trim();

const productUrl = (product) => {
  const identifier = clean(product?.slug) || clean(product?._id);
  return identifier ? `${SITE_URL}/product/${encodeURIComponent(identifier)}` : SITE_URL;
};

export const orderOnEmail = ({
  product,
  productName,
  price,
  userName = null,
  color = null,
  size = null,
}) => {
  const name = clean(productName || product?.name) || 'Product';
  const amount = Number(price ?? product?.price);
  const url = productUrl(product || {});
  const description = clean(product?.description) || 'Product description available on the product page.';
  const imageUrls = Array.isArray(product?.images)
    ? product.images.map((image) => clean(image?.url)).filter(Boolean)
    : [];

  const subject = `Order Inquiry — ${name}`;
  let body = `Hello Nicky Collections,\n\nI would like to order this product.\n\n`;
  body += `PRODUCT DETAILS\n`;
  body += `Product: ${name}\n`;
  if (Number.isFinite(amount)) body += `Price: $${amount.toFixed(2)}\n`;
  if (color) body += `Color: ${color}\n`;
  if (size) body += `Size: ${size}\n`;
  if (userName) body += `Customer name: ${clean(userName)}\n`;
  body += `Availability: Please confirm availability.\n\n`;
  body += `DESCRIPTION\n${description}\n\n`;
  body += `PRODUCT PAGE\n${url}\n\n`;
  if (imageUrls.length) {
    body += `PRODUCT IMAGE${imageUrls.length > 1 ? 'S' : ''}\n`;
    imageUrls.forEach((imageUrl, index) => { body += `${index + 1}. ${imageUrl}\n`; });
    body += `\n`;
  }
  body += `Please let me know the next steps, delivery options and payment details.\n\nThank you.\n`;

  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

export const contactOnEmail = ({ name = '', email = '', subject = '', message = '' } = {}) => {
  const mailSubject = subject ? `${clean(name) ? `${clean(name)} — ` : ''}${clean(subject)}` : 'Nicky Collections Inquiry';
  const body = [
    `Name: ${clean(name)}`,
    `Email: ${clean(email)}`,
    '',
    clean(message),
  ].join('\n');
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(body)}`;
};

export const orderOnWhatsApp = orderOnEmail;
export const contactOnWhatsApp = (subject = '') => contactOnEmail({ subject });

export { WHATSAPP_LINK, PHONE_LINK, SMS_LINK, TIKTOK_URL, INSTAGRAM_URL };
