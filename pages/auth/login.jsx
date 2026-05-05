import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../../lib/AuthContext';
import toast from 'react-hot-toast';

const Particle = ({ delay, duration, x, y, size }) => (
  <motion.div
    className="absolute rounded-full bg-brand-pink pointer-events-none"
    style={{ width: size, height: size, left: x + '%', top: y + '%' }}
    animate={{ y: [0, -40, 0], opacity: [0.05, 0.2, 0.05], scale: [1, 1.3, 1] }}
    transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
);

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const particles = Array.from({ length: 10 }, (_, i) => ({
    id: i, delay: i * 0.5, duration: 4 + i * 0.7,
    x: (i * 11) % 100, y: (i * 17) % 100, size: 10 + (i * 7) % 40,
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      toast.success('Welcome back, ' + data.user.name + '!');
      router.push(data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head><title>Login — Nicky Collections</title></Head>
      <div className="min-h-screen flex items-center justify-center px-6 py-20 bg-brand-dark overflow-hidden relative">
        {particles.map(p => <Particle key={p.id} {...p} />)}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-brand-pink/10 blur-[100px] pointer-events-none"
          animate={{ scale: [1, 1.3, 1], opacity: [0.08, 0.2, 0.08] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-brand-gold/10 blur-[100px] pointer-events-none"
          animate={{ scale: [1, 1.4, 1], opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#FF1F6D 1px, transparent 1px), linear-gradient(90deg, #FF1F6D 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="text-center mb-10">
            <Link href="/" className="inline-block mb-6">
              <motion.div whileHover={{ scale: 1.05 }}>
                <span className="font-display text-4xl font-light tracking-widest text-brand-light block">NICKY</span>
                <span className="font-body text-[9px] tracking-[0.4em] uppercase text-brand-pink">Collections</span>
              </motion.div>
            </Link>
            <h1 className="font-display text-3xl font-light text-brand-light">Welcome Back</h1>
            <p className="font-body text-brand-gray text-sm mt-2">Sign in to your account</p>
          </div>
          <motion.div
            className="glass-card p-8 border border-white/10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <label className="label-tag block mb-2">Email</label>
                <div className="relative">
                  <FiMail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray" />
                  <input type="email" required value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    className="input-field pl-11 w-full" />
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <label className="label-tag block mb-2">Password</label>
                <div className="relative">
                  <FiLock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray" />
                  <input type={showPass ? 'text' : 'password'} required value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="input-field pl-11 pr-11 w-full" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-gray hover:text-brand-light transition-colors">
                    {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <motion.button
                  type="submit" disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.97 }}
                  className="btn-primary w-full flex items-center justify-center gap-3 py-4 relative overflow-hidden"
                >
                  {loading ? (
                    <>
                      <motion.div
                        className="absolute bottom-0 left-0 h-1 bg-white/40"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2, ease: 'easeInOut' }}
                      />
                      <motion.div
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      />
                      <span>Signing In...</span>
                    </>
                  ) : <span>Sign In</span>}
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
          <p className="text-center font-body text-sm text-brand-gray mt-6">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-brand-pink hover:underline font-medium">Create one</Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}

Login.noLayout = true;
