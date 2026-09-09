import { FaWhatsapp } from 'react-icons/fa';
import { FiMessageCircle, FiPhone } from 'react-icons/fi';
import { CONTACT_LINKS, formatPhone } from '../lib/siteConfig';

export default function ContactActions({ compact = false }) {
  const base = compact
    ? 'px-4 py-3 text-xs'
    : 'px-6 py-4 text-sm';

  return (
    <div className="flex flex-wrap gap-3">
      <a
        href={CONTACT_LINKS.whatsapp}
        target="_blank"
        rel="noreferrer"
        className={`bg-green-500 hover:bg-green-400 text-white font-body font-semibold tracking-widest uppercase flex items-center justify-center gap-2 transition-colors ${base}`}
        aria-label={`Chat with Nicky Collections on WhatsApp at ${formatPhone('13502208962')}`}
      >
        <FaWhatsapp size={compact ? 15 : 18} />
        WhatsApp
      </a>
      <a
        href={CONTACT_LINKS.call}
        className={`btn-outline font-body font-semibold tracking-widest uppercase flex items-center justify-center gap-2 ${base}`}
        aria-label={`Call Nicky Collections at ${formatPhone('13502208962')}`}
      >
        <FiPhone size={compact ? 15 : 17} />
        Call
      </a>
      <a
        href={CONTACT_LINKS.sms}
        className={`btn-outline font-body font-semibold tracking-widest uppercase flex items-center justify-center gap-2 ${base}`}
        aria-label={`Send SMS to Nicky Collections at ${formatPhone('13502208962')}`}
      >
        <FiMessageCircle size={compact ? 15 : 17} />
        SMS
      </a>
    </div>
  );
}
