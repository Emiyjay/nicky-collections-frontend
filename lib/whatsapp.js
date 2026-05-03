const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '17073626557';

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
  window.open(url, '_blank');
};

export const contactOnWhatsApp = (subject = '') => {
  let message = `Hello Nicky Collections! 👋`;
  if (subject) message += `\n\nI'm reaching out about: ${subject}`;
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
};

export const TIKTOK_URL = 'https://www.tiktok.com/@shopwithnickycollections';
export const INSTAGRAM_URL = 'https://www.instagram.com/nickycollections';
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;
