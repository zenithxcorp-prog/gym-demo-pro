import { useState } from 'react';
import { X, ShieldCheck, User, Lock, Phone, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLogin, gymName }) {
  const [role, setRole] = useState('owner');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const fillDemo = (selectedRole) => {
    setRole(selectedRole);
    setError('');
    if (selectedRole === 'owner') {
      setIdentifier('admin');
      setPassword('1234');
    } else {
      setIdentifier('9876543210');
      setPassword('1234');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (role === 'owner') {
      if (identifier.trim().toLowerCase() === 'admin' && password === '1234') {
        onLogin('owner');
        onClose();
      } else {
        setError('Invalid Owner ID or PIN. Use Demo Fill below.');
      }
    } else {
      if (identifier.trim() === '9876543210' && password === '1234') {
        onLogin('member');
        onClose();
      } else {
        setError('Invalid Member Mobile or PIN. Use Demo Fill below.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-[#111114] p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">
            {gymName}
          </p>
          <h2 className="mt-1 font-display text-3xl font-bold uppercase tracking-wide text-white">
            Portal Login
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Select your account type to access your private dashboard.
          </p>
        </div>

        {/* Role Switcher */}
        <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-[#09090B] p-1 border border-zinc-800/80">
          <button
            type="button"
            onClick={() => {
              setRole('owner');
              setIdentifier('');
              setPassword('');
              setError('');
            }}
            className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition ${
              role === 'owner'
                ? 'bg-amber-500 text-black shadow-lg'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            Owner / Admin
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('member');
              setIdentifier('');
              setPassword('');
              setError('');
            }}
            className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition ${
              role === 'member'
                ? 'bg-amber-500 text-black shadow-lg'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <User className="h-4 w-4" />
            Member Portal
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
              {role === 'owner' ? 'Admin ID' : 'Registered Mobile Number'}
            </label>
            <div className="relative">
              {role === 'owner' ? (
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              ) : (
                <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              )}
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={role === 'owner' ? 'Enter admin' : 'Enter 9876543210'}
                required
                className="w-full rounded-xl border border-zinc-800 bg-[#09090B] py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
              Security PIN
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••"
                required
                className="w-full rounded-xl border border-zinc-800 bg-[#09090B] py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3.5 text-sm font-bold text-black hover:bg-amber-400 transition"
          >
            Access {role === 'owner' ? 'Owner Dashboard' : 'Member Portal'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* 1-Tap Demo Credentials Box */}
        <div className="mt-5 rounded-xl border border-zinc-800/80 bg-[#09090B] p-3.5">
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs text-zinc-400">
              <span className="inline-flex items-center gap-1 font-semibold text-amber-500">
                <Sparkles className="h-3.5 w-3.5" /> Quick Demo Access
              </span>
              <p className="mt-0.5 text-[11px] text-zinc-500">
                {role === 'owner'
                  ? 'ID: admin | PIN: 1234'
                  : 'Mobile: 9876543210 | PIN: 1234'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => fillDemo(role)}
              className="shrink-0 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-400 hover:bg-amber-500 hover:text-black transition"
            >
              1-Tap Fill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
