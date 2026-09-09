import {
  WHATSAPP_LINK,
  PHONE_LINK,
  SMS_LINK,
  TIKTOK_URL,
  INSTAGRAM_URL,
} from './site';

export const orderOnWhatsApp = ({ productName, price, userName = null, color = null, size = null }) => {
  let message = `Hello! 👋 I want to order from *Nicky Collections* 🛍️\n\n`;
  message += `*Product:* ${productName}\n`;
  message += `*Price:* $${price}\n`;
  if (color) message += `*Color:* ${color}\n`;
  if (size) message += `*Size:* ${size}\n`;
  if (userName) message += `*My Name:* ${userName}\n`;
  message += `\nPlease let me know availability and next steps. Thank you! 🙏`;

  const encodedMessage = encodeURIComponent(message);
  window.open(`${WHATSAPP_LINK}?text=${encodedMessage}`, '_blank', 'noopener,noreferrer');
};

export const contactOnWhatsApp = (subject = '') => {
  let message = 'Hello Nicky Collections! 👋';
  if (subject) message += `\n\nI'm reaching out about: ${subject}`;
  window.open(`${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
};

export { WHATSAPP_LINK, PHONE_LINK, SMS_LINK, TIKTOK_URL, INSTAGRAM_URL };
