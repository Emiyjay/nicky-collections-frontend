export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://nickycollections.com').replace(/\/$/, '');
export const SITE_NAME = 'Nicky Collections';
export const SITE_DESCRIPTION = 'Shop fashion-forward footwear, outerwear, accessories and collectibles from Nicky Collections. Discover new arrivals and trending drops, then place your order by email.';

export const PHONE_NUMBER = (process.env.NEXT_PUBLIC_PHONE_NUMBER || '').replace(/\D/g, '');
export const DISPLAY_PHONE_NUMBER = process.env.NEXT_PUBLIC_DISPLAY_PHONE_NUMBER || '';
export const PHONE_LINK = PHONE_NUMBER ? `tel:${PHONE_NUMBER}` : '';

export const TIKTOK_URL = process.env.NEXT_PUBLIC_TIKTOK_URL || 'https://www.tiktok.com/@shopwithnickycollections';
export const INSTAGRAM_URL = process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/nickycollections';
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'nickycollection01@gmail.com';

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;
