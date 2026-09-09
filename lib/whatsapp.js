const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '13502208962').replace(/\D/g, '');
const PHONE_NUMBER = (process.env.NEXT_PUBLIC_PHONE_NUMBER || '+1 (350) 220-8962').trim();
const SMS_NUMBER = (process.env.NEXT_PUBLIC_SMS_NUMBER || '+1 (350) 220-8962').trim();

export const CONTACT = {
  whatsappNumber: WHATSAPP_NUMBER,
  phone: PHONE_NUMBER,
  sms: SMS_NUMBER,
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'nickycollection01@gmail.com',
};

export const orderOnWhatsApp = ({ productName, price, userName = null, color = null, size = null }) => {
  let message = `Hello! 👋 I want to order from *Nicky Collections* 🛍️\n\n`;
  message += `*Product:* ${productName}\n`;
  message += `*Price:* $${price}\n`;
  if (color) message += `*Color:* ${color}\n`;
  if (size) message += `*Size:* ${size}\n`;
  if (userName) message += `*My Name:* ${userName}\n`;
  message += `\nPlease let me know availability and next steps. Thank you! 🙏`;

  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};

export const contactOnWhatsApp = (subject = '') => {
  let message = `Hello Nicky Collections! 👋`;
  if (subject) message += `\n\nI'm reaching out about: ${subject}`;
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};

export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;
export const CALL_LINK = `tel:${PHONE_NUMBER.replace(/[^\d+]/g, '')}`;
export const SMS_LINK = `sms:${SMS_NUMBER.replace(/[^\d+]/g, '')}`;
export const TIKTOK_URL = process.env.NEXT_PUBLIC_TIKTOK_URL || 'https://www.tiktok.com/@shopwithnickycollections';
export const INSTAGRAM_URL = process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/nickycollections';
