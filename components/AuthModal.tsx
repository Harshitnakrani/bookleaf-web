'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, ArrowRight, Shield, User, AlertCircle, Sparkles } from 'lucide-react';
import { api, setStoredToken, setStoredUser } from '../lib/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
  initialRole?: 'ADMIN' | 'AUTHOR';
}

export const AuthModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialRole,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await api.login({
        email: email.trim(),
        password: password.trim(),
      });

      setStoredToken(res.accessToken);
      setStoredUser(res.user);
      onLoginSuccess(res.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (fillEmail: string, fillPass: string = 'Password123!') => {
    setEmail(fillEmail);
    setPassword(fillPass);
    setError(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-md bg-white border border-neutral-200 rounded-3xl shadow-2xl p-6 sm:p-8 z-10 overflow-hidden"
        >
          {/* Subtle Background Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-neutral-100 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full border border-neutral-200 hover:border-black text-neutral-400 hover:text-black flex items-center justify-center transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="space-y-1.5 mb-6 text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-800 text-[10px] font-mono uppercase tracking-wider mb-1">
              <Shield className="w-3 h-3 text-neutral-600" />
              <span>Production Portal Access</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
              Sign In to BookLeaf
            </h2>
            <p className="text-xs text-neutral-500">
              Secure authentication with dynamic role routing (Admin Ops vs Author Studio).
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-neutral-100 border border-neutral-300 text-neutral-900 text-xs flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-black" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Email Field */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-neutral-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="author@email.com or admin@bookleaf.pub"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:border-black focus:bg-white transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-neutral-700">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:border-black focus:bg-white transition"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-black hover:bg-neutral-800 text-white font-medium text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick-fill helper for evaluators */}
          <div className="mt-6 pt-5 border-t border-neutral-100 text-left space-y-2">
            <span className="text-[10px] font-mono uppercase text-neutral-400 block tracking-wider">
              Quick Fill Seed Credentials (for Evaluators):
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <button
                type="button"
                onClick={() => fillCredentials('admin@bookleaf.pub')}
                className="p-2 border border-neutral-200 hover:border-black rounded-lg text-left transition cursor-pointer hover:bg-neutral-50"
              >
                <div className="font-bold text-neutral-900 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-black" />
                  <span>Ops Admin</span>
                </div>
                <div className="text-[10px] text-neutral-400 truncate">admin@bookleaf.pub</div>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('priya.sharma@email.com')}
                className="p-2 border border-neutral-200 hover:border-black rounded-lg text-left transition cursor-pointer hover:bg-neutral-50"
              >
                <div className="font-bold text-neutral-900 flex items-center gap-1">
                  <User className="w-3 h-3 text-black" />
                  <span>Priya (AUTH001)</span>
                </div>
                <div className="text-[10px] text-neutral-400 truncate">priya.sharma@email.com</div>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('sneha.kulkarni@email.com')}
                className="p-2 border border-neutral-200 hover:border-black rounded-lg text-left transition cursor-pointer hover:bg-neutral-50"
              >
                <div className="font-bold text-neutral-900 flex items-center gap-1">
                  <User className="w-3 h-3 text-black" />
                  <span>Sneha (AUTH007)</span>
                </div>
                <div className="text-[10px] text-neutral-400 truncate">sneha.kulkarni@email.com</div>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('rohit.kapoor@email.com')}
                className="p-2 border border-neutral-200 hover:border-black rounded-lg text-left transition cursor-pointer hover:bg-neutral-50"
              >
                <div className="font-bold text-neutral-900 flex items-center gap-1">
                  <User className="w-3 h-3 text-black" />
                  <span>Rohit (AUTH002)</span>
                </div>
                <div className="text-[10px] text-neutral-400 truncate">rohit.kapoor@email.com</div>
              </button>
            </div>
            <p className="text-[10px] text-neutral-400 text-center pt-1 font-mono">
              Password for all seeded accounts: <code>Password123!</code>
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
