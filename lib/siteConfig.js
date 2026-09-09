export const SITE_CONFIG = {
  name: 'Nicky Collections',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://nickycollections.com',
  description: 'Shop fashion-forward sneakers, jackets, accessories and collectibles from Nicky Collections.',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '13502208962',
  phoneNumber: process.env.NEXT_PUBLIC_PHONE_NUMBER || '13502208962',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'nickycollection01@gmail.com',
  tiktokUrl: process.env.NEXT_PUBLIC_TIKTOK_URL || 'https://www.tiktok.com/@shopwithnickycollections',
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/nickycollections',
};

export const CONTACT_LINKS = {
  whatsapp: `https://wa.me/${SITE_CONFIG.whatsappNumber}`,
  call: `tel:+${SITE_CONFIG.phoneNumber}`,
  sms: `sms:+${SITE_CONFIG.phoneNumber}`,
};

export const formatPhone = (number) => {
  if (number === '13502208962') return '+1 (350) 220-8962';
  return number.startsWith('+') ? number : `+${number}`;
};
