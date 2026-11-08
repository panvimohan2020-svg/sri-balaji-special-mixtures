import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ShieldAlert, ArrowRight, Fingerprint, KeyRound, CheckCircle2, X } from 'lucide-react';
import { apiService } from '../../services/api';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passkeySupported, setPasskeySupported] = useState(false);
  const [passkeyLoading, setPasskeyLoading] = useState(false);
  const [ownerActivated, setOwnerActivated] = useState<boolean>(true);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState<'request' | 'reset'>('request');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Check if device supports WebAuthn / Passkeys
    if (window.PublicKeyCredential && typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function') {
      window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        .then(supported => setPasskeySupported(supported))
        .catch(() => setPasskeySupported(false));
    }

    // Check if owner has been activated
    apiService.getOwnerSetupStatus().then((status) => {
      setOwnerActivated(status.is_activated);
    }).catch(() => {});
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await apiService.login(email.trim(), password);
      localStorage.setItem('sri_balaji_admin_token', data.access_token);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid administrator credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasskeyLogin = async () => {
    setPasskeyLoading(true);
    setError('');

    try {
      const challengeData = await apiService.passkeyLoginChallenge();
      const challengeStr = challengeData.challenge;

      // WebAuthn request options
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: Uint8Array.from(atob(challengeStr.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0)),
          rpId: window.location.hostname || 'localhost',
          userVerification: 'preferred',
          timeout: 60000
        }
      }) as any;

      if (!credential) {
        throw new Error('Passkey verification was cancelled or failed.');
      }

      const credId = credential.id;
      const verifyRes = await apiService.passkeyLoginVerify({
        challenge: challengeStr,
        credential_id: credId
      });

      localStorage.setItem('sri_balaji_admin_token', verifyRes.access_token);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Biometric / Passkey sign-in failed. Please use your password.');
    } finally {
      setPasskeyLoading(false);
    }
  };

  const handleForgotRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError('');
    setForgotMsg('');

    try {
      const res = await apiService.forgotPassword(forgotEmail.trim());
      setForgotMsg(res.message);
      if (res.reset_token) {
        setResetToken(res.reset_token);
      }
      setForgotStep('reset');
    } catch (err: any) {
      setForgotError(err.message || 'Unable to request password recovery.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError('');

    try {
      await apiService.resetPassword(resetToken.trim(), newPassword);
      setForgotMsg('Password reset successfully. You may now sign in.');
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotStep('request');
        setPassword('');
      }, 2000);
    } catch (err: any) {
      setForgotError(err.message || 'Failed to update password with provided token.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-[#190D2B] via-[#28143F] to-[#120822]">
      <div className="max-w-md w-full bg-[#190D2B]/90 backdrop-blur-md rounded-3xl border border-[#F4C45E]/30 shadow-2xl p-8 space-y-6 text-[#FFF8EB]">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#28143F] border-2 border-[#F4C45E] flex items-center justify-center text-[#F4C45E] shadow-lg shadow-[#F4C45E]/20">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="font-serif font-bold text-2xl text-[#F4C45E] tracking-wide" style={{ fontFamily: 'Cinzel, Georgia, serif' }}>
            Sri Balaji Management
          </h1>
          <p className="text-xs text-[#FFF8EB]/75 font-sans">
            Secure administrative control portal for authorized personnel.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs sm:text-sm font-sans">
          <div>
            <label className="block font-semibold text-[#F4C45E] mb-1.5">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#F4C45E]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sribalaji.com"
                className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-[#F4C45E]/25 bg-[#28143F]/60 focus:bg-[#28143F] focus:border-[#F4C45E] focus:ring-2 focus:ring-[#F4C45E]/20 outline-none text-[#FFF8EB] placeholder-[#FFF8EB]/30 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-semibold text-[#F4C45E]">
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(true);
                  setForgotEmail(email);
                  setForgotError('');
                  setForgotMsg('');
                }}
                className="text-[11px] text-[#F4C45E]/80 hover:text-[#F4C45E] underline underline-offset-2 transition-colors"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#F4C45E]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-[#F4C45E]/25 bg-[#28143F]/60 focus:bg-[#28143F] focus:border-[#F4C45E] focus:ring-2 focus:ring-[#F4C45E]/20 outline-none text-[#FFF8EB] placeholder-[#FFF8EB]/30 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F4C45E] to-[#e6b142] hover:brightness-105 text-[#28143F] font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#F4C45E]/20 transition-all disabled:opacity-50 active:scale-95"
          >
            {loading ? (
              <span>Authenticating Session...</span>
            ) : (
              <>
                <span>Sign in to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Biometrics / Passkey Option */}
        <div className="pt-2 border-t border-[#F4C45E]/15">
          <button
            type="button"
            onClick={handlePasskeyLogin}
            disabled={passkeyLoading}
            className="w-full py-3 px-4 rounded-xl border border-[#F4C45E]/30 bg-[#28143F]/40 hover:bg-[#28143F] text-[#FFF8EB] hover:text-[#F4C45E] text-xs font-semibold flex items-center justify-center gap-2.5 transition-all"
          >
            <Fingerprint className="w-4 h-4 text-[#F4C45E]" />
            <span>{passkeyLoading ? 'Verifying Device Passkey...' : 'Sign in with Passkey / Device Biometrics'}</span>
          </button>
          <p className="text-[10px] text-[#FFF8EB]/50 text-center mt-2">
            Protected by client-side enclave security. Biometric templates never leave your device.
          </p>

          {!ownerActivated && (
            <div className="mt-4 pt-3 border-t border-[#F4C45E]/15 text-center text-xs">
              <span className="text-[#FFF8EB]/70">Business Owner handover? </span>
              <Link
                to="/admin/owner-activation"
                className="text-[#F4C45E] hover:underline font-bold inline-flex items-center gap-1"
              >
                <span>Activate Super Admin Account</span>
                <ArrowRight className="w-3 h-3 inline" />
              </Link>
            </div>
          )}
        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="max-w-md w-full bg-[#190D2B] border border-[#F4C45E]/30 rounded-3xl p-6 space-y-4 text-[#FFF8EB] relative shadow-2xl">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute right-4 top-4 text-[#FFF8EB]/60 hover:text-[#F4C45E]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#28143F] border border-[#F4C45E] flex items-center justify-center text-[#F4C45E]">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-[#F4C45E]" style={{ fontFamily: 'Cinzel, Georgia, serif' }}>
                  Admin Password Recovery
                </h3>
                <p className="text-xs text-[#FFF8EB]/70">
                  Self-service reset for verified administrators.
                </p>
              </div>
            </div>

            {forgotError && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs">
                {forgotError}
              </div>
            )}

            {forgotMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{forgotMsg}</span>
              </div>
            )}

            {forgotStep === 'request' ? (
              <form onSubmit={handleForgotRequest} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-semibold text-[#F4C45E] mb-1">
                    Registered Admin Email
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="admin@sribalaji.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#F4C45E]/25 bg-[#28143F]/60 text-[#FFF8EB] outline-none focus:border-[#F4C45E]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-2.5 rounded-xl bg-[#F4C45E] text-[#28143F] font-bold text-xs hover:brightness-105 disabled:opacity-50"
                >
                  {forgotLoading ? 'Processing Request...' : 'Generate Recovery Token'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-3.5 text-xs sm:text-sm">
                <div>
                  <label className="block font-semibold text-[#F4C45E] mb-1">
                    Recovery Token
                  </label>
                  <input
                    type="text"
                    required
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    placeholder="Enter security token"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#F4C45E]/25 bg-[#28143F]/60 text-[#FFF8EB] outline-none font-mono text-xs focus:border-[#F4C45E]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#F4C45E] mb-1">
                    New Secure Password (min 8 chars)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#F4C45E]/25 bg-[#28143F]/60 text-[#FFF8EB] outline-none focus:border-[#F4C45E]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-2.5 rounded-xl bg-[#F4C45E] text-[#28143F] font-bold text-xs hover:brightness-105 disabled:opacity-50"
                >
                  {forgotLoading ? 'Updating Password...' : 'Save New Password & Sign In'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
