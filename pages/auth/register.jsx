import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheck, FiX } from 'react-icons/fi';
import { useAuth } from '../../lib/AuthContext';
import toast from 'react-hot-toast';

const Particle = ({ delay, duration, x, y, size }) => (
  <motion.div
    className="absolute rounded-full bg-brand-gold pointer-events-none"
    style={{ width: size, height: size, left: x + '%', top: y + '%' }}
    animate={{ y: [0, -50, 0], opacity: [0.03, 0.15, 0.03], scale: [1, 1.4, 1] }}
    transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
);

const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: 'Very Weak', color: '#ef4444' };
  if (score === 2) return { score, label: 'Weak', color: '#f97316' };
  if (score === 3) return { score, label: 'Fair', color: '#eab308' };
  if (score === 4) return { score, label: 'Strong', color: '#22c55e' };
  return { score, label: 'Very Strong', color: '#10b981' };
};

const PasswordRule = ({ passed, text }) => (
  <div className="flex items-center gap-2">
    <motion.div
      animate={{ scale: passed ? [1, 1.3, 1] : 1 }}
      transition={{ duration: 0.3 }}
    >
      {passed
        ? <FiCheck size={12} className="text-green-400" />
        : <FiX size={12} className="text-brand-gray" />
      }
    </motion.div>
    <span className={'font-body text-xs ' + (passed ? 'text-green-400' : 'text-brand-gray')}>{text}</span>
  </div>
);

export default function Register() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const particles = Array.from({ length: 10 }, (_, i) => ({
    id: i, delay: i * 0.6, duration: 5 + i * 0.5,
    x: (i * 13) % 100, y: (i * 19) % 100, size: 8 + (i * 9) % 35,
  }));

  const strength = getPasswordStrength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Welcome 🎉');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head><title>Create Account — Nicky Collections</title></Head>
      <div className="min-h-screen flex items-center justify-center px-6 py-10 bg-brand-dark overflow-hidden relative">

        {particles.map(p => <Particle key={p.id} {...p} />)}

        <motion.div
          className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-brand-gold/8 blur-[120px] pointer-events-none"
          animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/4 w-72 h-72 rounded-full bg-brand-pink/8 blur-[100px] pointer-events-none"
          animate={{ scale: [1, 1.4, 1], opacity: [0.05, 0.12, 0.05] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />

        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#D4A843 1px, transparent 1px), linear-gradient(90deg, #D4A843 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-5">
              <motion.div whileHover={{ scale: 1.05 }}>
                <span className="font-display text-4xl font-light tracking-widest text-brand-light block">NICKY</span>
                <span className="font-body text-[9px] tracking-[0.4em] uppercase text-brand-pink">Collections</span>
              </motion.div>
            </Link>
            <h1 className="font-display text-3xl font-light text-brand-light">Join Us</h1>
            <p className="font-body text-brand-gray text-sm mt-2">Create your Nicky Collections account</p>
          </div>

          <motion.div
            className="glass-card p-8 border border-white/10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <label className="label-tag block mb-2">Full Name</label>
                <div className="relative">
                  <FiUser size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray" />
                  <input type="text" required value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Your Name" className="input-field pl-11 w-full" />
                </div>
              </motion.div>

              {/* Email */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
                <label className="label-tag block mb-2">Email</label>
                <div className="relative">
                  <FiMail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray" />
                  <input type="email" required value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com" className="input-field pl-11 w-full" />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <label className="label-tag block mb-2">Password</label>
                <div className="relative">
                  <FiLock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray" />
                  <input
                    type={showPass ? 'text' : 'password'} required value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    placeholder="Min 6 characters" className="input-field pl-11 pr-11 w-full" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-gray hover:text-brand-light transition-colors">
                    {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>

                {/* Password strength bar */}
                {form.password.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2"
                  >
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <motion.div
                          key={i}
                          className="h-1 flex-1 rounded-full"
                          style={{ backgroundColor: i <= strength.score ? strength.color : '#333' }}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: i * 0.05 }}
                        />
                      ))}
                    </div>
                    <p className="font-body text-xs" style={{ color: strength.color }}>
                      {strength.label}
                    </p>
                  </motion.div>
                )}

                {/* Password rules */}
                {(passwordFocused || form.password.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 p-3 bg-white/5 border border-white/10 space-y-1"
                  >
                    <PasswordRule passed={form.password.length >= 6} text="At least 6 characters" />
                    <PasswordRule passed={/[A-Z]/.test(form.password)} text="One uppercase letter" />
                    <PasswordRule passed={/[0-9]/.test(form.password)} text="One number" />
                    <PasswordRule passed={/[^A-Za-z0-9]/.test(form.password)} text="One special character (!@#$)" />
                  </motion.div>
                )}
              </motion.div>

              {/* Confirm password */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }}>
                <label className="label-tag block mb-2">Confirm Password</label>
                <div className="relative">
                  <FiLock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray" />
                  <input type="password" required value={form.confirm}
                    onChange={e => setForm({ ...form, confirm: e.target.value })}
                    placeholder="Repeat password" className="input-field pl-11 w-full" />
                  {form.confirm.length > 0 && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {form.password === form.confirm
                        ? <FiCheck size={16} className="text-green-400" />
                        : <FiX size={16} className="text-red-400" />
                      }
                    </div>
                  )}
                </div>
                {form.confirm.length > 0 && form.password !== form.confirm && (
                  <motion.p
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="font-body text-xs text-red-400 mt-1"
                  >
                    Passwords do not match
                  </motion.p>
                )}
              </motion.div>

              {/* Submit */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.97 }}
                  className="btn-primary w-full flex items-center justify-center gap-3 py-4 relative overflow-hidden mt-2"
                >
                  {loading ? (
                    <>
                      <motion.div
                        className="absolute bottom-0 left-0 h-1 bg-white/40"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2.5, ease: 'easeInOut' }}
                      />
                      <motion.div
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <span>Create Account</span>
                  )}
                </motion.button>
              </motion.div>
            </form>
          </motion.div>

          <p className="text-center font-body text-sm text-brand-gray mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-brand-pink hover:underline font-medium">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}

Register.noLayout = true;
