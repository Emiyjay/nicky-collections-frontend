export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://nickycollections.com').replace(/\/$/, '');
export const SITE_NAME = 'Nicky Collections';
export const SITE_DESCRIPTION = 'Shop fashion-forward footwear, outerwear, accessories and collectibles from Nicky Collections. Discover new arrivals and trending drops, then order directly via WhatsApp.';

export const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '13502208962').replace(/\D/g, '');
export const SMS_NUMBER = (process.env.NEXT_PUBLIC_SMS_NUMBER || '17194090286').replace(/\D/g, '');
export const PHONE_NUMBER = (process.env.NEXT_PUBLIC_PHONE_NUMBER || WHATSAPP_NUMBER).replace(/\D/g, '');
export const DISPLAY_PHONE_NUMBER = process.env.NEXT_PUBLIC_DISPLAY_PHONE_NUMBER || '+1 (350) 220-8962';
export const DISPLAY_SMS_NUMBER = process.env.NEXT_PUBLIC_DISPLAY_SMS_NUMBER || '+1 (719) 409-0286';
export const SMS_LINK = `sms:${SMS_NUMBER}`;
export const PHONE_LINK = `tel:${PHONE_NUMBER}`;
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

export const TIKTOK_URL = process.env.NEXT_PUBLIC_TIKTOK_URL || 'https://www.tiktok.com/@shopwithnickycollections';
export const INSTAGRAM_URL = process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/nickycollections';
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'nickycollection01@gmail.com';

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;
