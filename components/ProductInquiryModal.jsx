import { useEffect, useMemo, useState } from 'react';
import { FiCheck, FiMail, FiPhone, FiX } from 'react-icons/fi';
import { sendProductInquiry, openProductEmailFallback } from '../lib/contact';
import styles from './ProductInquiryModal.module.css';

const clean = (value) => String(value ?? '').trim();

export default function ProductInquiryModal() {
  const [request, setRequest] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', quantity: 1, location: '', notes: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');

  useEffect(() => {
    const handleOpen = (event) => {
      const detail = event.detail || {};
      setRequest(detail);
      setForm((current) => ({ ...current, name: clean(detail.userName), email: clean(detail.userEmail) }));
      setStatus('idle');
      setError('');
      setReference('');
    };
    window.addEventListener('nc:order', handleOpen);
    return () => window.removeEventListener('nc:order', handleOpen);
  }, []);

  useEffect(() => {
    if (!request) return undefined;
    const handleKeyDown = (event) => { if (event.key === 'Escape' && status !== 'sending') setRequest(null); };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [request, status]);

  useEffect(() => {
    if (!request) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [request]);

  const product = request?.product || {};
  const price = Number(request?.price ?? product.price);
  const availableStock = Number(product.stockCount);
  const maxQuantity = Number.isFinite(availableStock) && availableStock > 0 ? Math.min(99, availableStock) : 99;
  const quantity = Math.max(1, Math.min(maxQuantity, Number(form.quantity) || 1));
  const subtotal = Number.isFinite(price) ? price * quantity : null;
  const productLabel = clean(request?.productName || product.name) || 'Selected product';
  const selection = useMemo(() => ({ color: clean(request?.color), size: clean(request?.size) }), [request]);

  if (!request) return null;

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const close = () => { if (status !== 'sending') setRequest(null); };

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (!clean(form.name) || !clean(form.email) || !clean(form.location)) {
      setError('Please complete your name, email and delivery location.');
      return;
    }
    setStatus('sending');
    const payload = { product, productName: productLabel, price, userName: clean(form.name), customerEmail: clean(form.email), customerPhone: clean(form.phone) || null, color: selection.color || null, size: selection.size || null, quantity, deliveryLocation: clean(form.location), notes: clean(form.notes) || null };

    const result = await sendProductInquiry(payload);
    if (result.sent) {
      setReference(result.reference || '');
      setStatus('success');
      return;
    }
    if (result.fallback) {
      openProductEmailFallback(payload);
      setStatus('fallback');
      return;
    }
    setError(result.message || 'We could not send your inquiry. Please check the form and try again.');
    setStatus('idle');
  };

  return (
    <div className={styles.backdrop} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && close()}>
      <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="product-inquiry-title">
        <button className={styles.close} type="button" onClick={close} aria-label="Close order inquiry" disabled={status === 'sending'}><FiX size={20} /></button>
        {status === 'success' ? (
          <div className={styles.success}>
            <div className={styles.successIcon}><FiCheck size={28} /></div><p className={styles.eyebrow}>Inquiry received</p>
            <h2 id="product-inquiry-title">We have your request.</h2><p>Nicky Collections has received your product inquiry. We will confirm availability and the next steps by email.</p>
            {reference && <p className={styles.reference}>Reference: <strong>{reference}</strong></p>}<button className={styles.primary} type="button" onClick={() => setRequest(null)}>Done</button>
          </div>
        ) : status === 'fallback' ? (
          <div className={styles.success}>
            <div className={styles.successIcon}><FiMail size={28} /></div><p className={styles.eyebrow}>Email opened</p>
            <h2 id="product-inquiry-title">Finish your inquiry by email.</h2><p>The direct service was unavailable, so your device&apos;s email composer has been prepared with your order details.</p>
            <button className={styles.primary} type="button" onClick={() => setRequest(null)}>Done</button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <div className={styles.header}><p className={styles.eyebrow}>Private order inquiry</p><h2 id="product-inquiry-title">Let&apos;s arrange your order.</h2><p>Tell us where to reach you and what you need. Your request is sent securely to Nicky Collections for confirmation.</p></div>
            <div className={styles.product}>{product.images?.[0]?.url && <img src={product.images[0].url} alt="" />}<div><strong>{productLabel}</strong><span>{Number.isFinite(price) ? `$${price.toFixed(2)}` : 'Price on request'}</span>{(selection.color || selection.size) && <small>{[selection.color, selection.size].filter(Boolean).join(' · ')}</small>}</div></div>
            <div className={styles.grid}>
              <label>Full name<input required value={form.name} onChange={update('name')} autoComplete="name" placeholder="Your name" /></label>
              <label>Email<input required type="email" value={form.email} onChange={update('email')} autoComplete="email" placeholder="you@example.com" /></label>
              <label>Phone<input value={form.phone} onChange={update('phone')} autoComplete="tel" placeholder="Phone number" /></label>
              <label>Quantity<input required type="number" min="1" max={maxQuantity} value={form.quantity} onChange={update('quantity')} inputMode="numeric" /></label>
            </div>
            <label>Delivery location<input required value={form.location} onChange={update('location')} autoComplete="street-address" placeholder="City / delivery area" /></label>
            <label>Notes <span>(optional)</span><textarea value={form.notes} onChange={update('notes')} rows="3" placeholder="Anything we should know about your order?" /></label>
            {error && <p role="alert" className={styles.error}>{error}</p>}
            <div className={styles.summary}><span>Estimated subtotal</span><strong>{subtotal !== null ? `$${subtotal.toFixed(2)}` : 'To confirm'}</strong></div>
            <div className={styles.actions}><button className={styles.secondary} type="button" onClick={close}>Cancel</button><button className={styles.primary} type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : <><FiMail size={17} /> Send inquiry</>}</button></div>
            <p className={styles.privacy}><FiPhone size={14} /> We use your details only to respond to this order inquiry.</p>
          </form>
        )}
      </section>
    </div>
  );
}
