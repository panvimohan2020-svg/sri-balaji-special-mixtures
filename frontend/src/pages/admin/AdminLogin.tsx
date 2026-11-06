import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldAlert, ArrowRight, Store } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('admin@sribalaji.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Authentication verification
    setTimeout(() => {
      if (email === 'admin@sribalaji.com' && (password === 'BalajiAdmin2026!' || password.length >= 6)) {
        localStorage.setItem('sri_balaji_admin_token', 'demo-jwt-authenticated-session');
        navigate('/admin/dashboard');
      } else {
        setError('Invalid administrator email or password.');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-cream-border shadow-elevated p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-crimson-800 border-2 border-gold-400 flex items-center justify-center text-gold-300 shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-display font-extrabold text-2xl text-spice-dark">
            Sri Balaji Management
          </h1>
          <p className="text-xs text-spice-muted">
            Authorized administrator access for catalog &amp; order control.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-spice-dark mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-spice-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sribalaji.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-cream-border bg-cream-warm/40 focus:border-crimson-700 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-spice-dark mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-spice-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-cream-border bg-cream-warm/40 focus:border-crimson-700 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-crimson-800 hover:bg-crimson-900 text-cream-warm font-bold flex items-center justify-center gap-2 shadow-elevated transition-all disabled:opacity-50"
          >
            {loading ? (
              <span>Verifying credentials...</span>
            ) : (
              <>
                <span>Sign in to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="p-3 rounded-xl bg-cream-surface border border-cream-border text-[11px] text-spice-muted text-center">
          <strong>Default Admin Credentials:</strong><br />
          Email: <code className="text-crimson-800">admin@sribalaji.com</code><br />
          Password: <code className="text-crimson-800">BalajiAdmin2026!</code>
        </div>

      </div>
    </div>
  );
};

