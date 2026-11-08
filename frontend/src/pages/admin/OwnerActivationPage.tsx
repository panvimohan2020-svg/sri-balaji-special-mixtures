import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  Crown, 
  ShieldCheck, 
  Lock, 
  User, 
  Mail, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  Sparkles,
  KeyRound,
  Shield,
  Eye,
  EyeOff,
  Clock
} from 'lucide-react';
import { apiService } from '../../services/api';
import { BrandLogo } from '../../components/common/BrandLogo';

export const OwnerActivationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const tokenParam = searchParams.get('token') || '';
  const [tokenInput, setTokenInput] = useState<string>(tokenParam);
  const [fullName, setFullName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const [verifying, setVerifying] = useState<boolean>(true);
  const [tokenValid, setTokenValid] = useState<boolean>(false);
  const [ownerEmail, setOwnerEmail] = useState<string>('');
  const [ownerName, setOwnerName] = useState<string>('');
  const [alreadyActivated, setAlreadyActivated] = useState<boolean>(false);
  const [activatedAt, setActivatedAt] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'Enter password', color: 'bg-zinc-600', percent: 0 };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500', percent: 25 };
    if (score <= 2) return { score: 2, label: 'Fair', color: 'bg-amber-500', percent: 50 };
    if (score <= 3) return { score: 3, label: 'Good', color: 'bg-blue-400', percent: 75 };
    return { score: 4, label: 'Strong', color: 'bg-emerald-500', percent: 100 };
  };

  const strength = getPasswordStrength(password);

  useEffect(() => {
    const verifyToken = async () => {
      const activeToken = tokenInput.trim();
      if (!activeToken) {
        setVerifying(false);
        setTokenValid(false);
        setErrorMessage('Missing activation invitation token in URL. Please use the complete link sent to you.');
        return;
      }

      setVerifying(true);
      setErrorMessage('');
      try {
        const res = await apiService.verifyOwnerToken(activeToken);
        if (res.valid) {
          setTokenValid(true);
          setOwnerEmail(res.owner_email || '');
          const designatedName = res.owner_name || res.suggested_name || '';
          setOwnerName(designatedName);
          setFullName(designatedName);
        } else {
          setTokenValid(false);
          if (res.error_code === 'ALREADY_ACTIVATED' || res.error_code === 'ALREADY_USED') {
            setAlreadyActivated(true);
            setActivatedAt(res.activated_at || '');
            if (res.owner_name) setOwnerName(res.owner_name);
          } else {
            setErrorMessage(res.message || 'Activation token is invalid or expired.');
          }
        }
      } catch (err: any) {
        setTokenValid(false);
        setErrorMessage(err.message || 'Failed to verify activation token.');
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [tokenInput]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long for security.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify both fields.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      await apiService.activateOwnerAccount({
        token: tokenInput.trim(),
        full_name: fullName.trim() || ownerName,
        password: password
      });

      setSuccess(true);
      // Explicit redirect to /admin/login after 2.5 seconds
      setTimeout(() => {
        navigate('/admin/login');
      }, 2500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to activate Super Admin account.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-[#190D2B] via-[#28143F] to-[#120822] text-[#FFF8EB] selection:bg-[#F4C45E] selection:text-[#28143F]">
      <div className="max-w-xl w-full bg-[#190D2B]/95 backdrop-blur-md rounded-3xl border-2 border-[#F4C45E]/40 shadow-2xl p-6 sm:p-10 space-y-6">
        
        {/* Sri Balaji Brand Logo & Title */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-2">
            <BrandLogo variant="crest" size="md" className="mx-auto" />
          </div>
          
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4C45E]/10 border border-[#F4C45E]/30 text-[11px] font-bold text-[#F4C45E] uppercase tracking-wider">
              <Crown className="w-3.5 h-3.5 text-[#F4C45E]" />
              <span>Primary Super Admin Invitation</span>
            </div>
            <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#F4C45E] tracking-tight leading-snug">
              Welcome to Sri Balaji
            </h1>
            <p className="text-xs sm:text-sm text-[#FFF8EB]/80 font-sans max-w-md mx-auto">
              Business Owner Account Activation &amp; System Handover
            </p>
          </div>
        </div>

        {/* Loading State */}
        {verifying && (
          <div className="p-8 text-center space-y-3">
            <div className="w-8 h-8 mx-auto border-3 border-[#F4C45E] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-[#FFF8EB]/70 font-medium">Verifying invitation security token...</p>
          </div>
        )}

        {/* Already Activated State */}
        {!verifying && alreadyActivated && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-400">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Super Admin Account Already Activated</span>
              </div>
              <p className="leading-relaxed text-emerald-100/90 text-xs">
                {ownerName ? `${ownerName}'s` : 'The'} Super Admin account has already been activated using this invitation link. Invitations are single-use for security.
                {activatedAt && <span className="block mt-1 text-[11px] text-emerald-300">Activated on: {new Date(activatedAt).toLocaleString()}</span>}
              </p>
            </div>

            <div className="text-center pt-2">
              <Link
                to="/admin/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#F4C45E] hover:bg-[#FFE7A3] text-[#28143F] font-bold text-xs sm:text-sm shadow-royal transition-all cursor-pointer"
              >
                <span>Proceed to Staff &amp; Admin Login</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Invalid or Expired Token State */}
        {!verifying && !alreadyActivated && !tokenValid && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-5 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs sm:text-sm space-y-2">
              <div className="flex items-center gap-2 font-bold text-rose-400">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span>Invalid or Expired Activation Token</span>
              </div>
              <p className="leading-relaxed text-rose-100/90 text-xs">
                {errorMessage || 'This activation token is invalid or has expired (72-hour window exceeded). Please contact the deployment developer for a fresh invitation link.'}
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-[#F4C45E]">
                Enter Activation Token Manually:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Paste activation token here..."
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-[#F4C45E]/30 bg-[#28143F] text-xs text-[#FFF8EB] outline-none focus:border-[#F4C45E]"
                />
                <button
                  type="button"
                  onClick={() => setTokenInput(tokenInput.trim())}
                  className="px-4 py-3 bg-[#28143F] hover:bg-[#392052] border border-[#F4C45E]/50 rounded-xl text-xs font-bold text-[#F4C45E] cursor-pointer"
                >
                  Verify
                </button>
              </div>
            </div>

            <div className="text-center pt-2">
              <Link
                to="/admin/login"
                className="text-xs text-[#F4C45E]/80 hover:text-[#F4C45E] underline underline-offset-2"
              >
                Return to Staff &amp; Admin Login Portal
              </Link>
            </div>
          </div>
        )}

        {/* Success Transition State */}
        {success && (
          <div className="p-6 rounded-2xl bg-emerald-950/80 border-2 border-emerald-400 text-center space-y-4 animate-fadeIn">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif font-black text-xl text-emerald-300">
                Super Admin Account Activated!
              </h3>
              <p className="text-xs text-emerald-100 leading-relaxed max-w-md mx-auto">
                Congratulations, <strong className="text-emerald-200">{fullName || ownerName}</strong>! Your Super Admin account has been securely established. You now have full management authority over the website.
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/admin/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#F4C45E] hover:bg-[#FFE7A3] text-[#28143F] font-bold text-xs shadow-royal transition-all"
              >
                <span>Go to Login Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-[11px] text-[#FFF8EB]/50 mt-2">
                Redirecting automatically to the login portal...
              </p>
            </div>
          </div>
        )}

        {/* Valid Token Form: Business Owner Setup Form */}
        {!verifying && tokenValid && !success && (
          <form onSubmit={handleSubmit} className="space-y-5 animate-fadeIn">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Read-Only Invited Owner Email */}
            <div>
              <label className="block text-xs font-bold text-[#F4C45E] mb-1.5 flex items-center justify-between">
                <span>Invited Email Address</span>
                <span className="text-[10px] text-emerald-400 font-normal flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Locked &amp; Verified
                </span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#F4C45E]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  disabled
                  value={ownerEmail}
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-[#F4C45E]/20 bg-[#28143F]/80 text-[#FFF8EB]/80 text-xs sm:text-sm font-mono cursor-not-allowed select-none"
                />
              </div>
              <p className="text-[10px] text-[#FFF8EB]/50 mt-1">
                This account is bound to your invited email address and cannot be changed.
              </p>
            </div>

            {/* Owner Full Name */}
            <div>
              <label className="block text-xs font-bold text-[#F4C45E] mb-1.5">
                Owner Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#F4C45E]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sri Adari Krishna Rao"
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-[#F4C45E]/30 bg-[#28143F]/60 focus:bg-[#28143F] focus:border-[#F4C45E] outline-none text-xs sm:text-sm text-[#FFF8EB] placeholder-[#FFF8EB]/30 transition-all font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-[#F4C45E] mb-1.5">
                Create Super Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#F4C45E]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters..."
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-[#F4C45E]/30 bg-[#28143F]/60 focus:bg-[#28143F] focus:border-[#F4C45E] outline-none text-xs sm:text-sm text-[#FFF8EB] placeholder-[#FFF8EB]/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#F4C45E]/60 hover:text-[#F4C45E] cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#FFF8EB]/60">Strength:</span>
                    <span className={`font-bold ${
                      strength.score === 1 ? 'text-rose-400' :
                      strength.score === 2 ? 'text-amber-400' :
                      strength.score === 3 ? 'text-blue-400' : 'text-emerald-400'
                    }`}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#28143F] rounded-full overflow-hidden border border-[#F4C45E]/20">
                    <div 
                      className={`h-full ${strength.color} transition-all duration-300`} 
                      style={{ width: `${strength.percent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-[#F4C45E] mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#F4C45E]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password..."
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-[#F4C45E]/30 bg-[#28143F]/60 focus:bg-[#28143F] focus:border-[#F4C45E] outline-none text-xs sm:text-sm text-[#FFF8EB] placeholder-[#FFF8EB]/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#F4C45E]/60 hover:text-[#F4C45E] cursor-pointer"
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Privileges Brief */}
            <div className="p-4 rounded-2xl bg-[#28143F]/80 border border-[#F4C45E]/30 space-y-2 text-[11px] text-[#FFF8EB]/80">
              <span className="font-bold text-[#F4C45E] block flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#F4C45E]" />
                Super Admin Permissions Granted:
              </span>
              <ul className="space-y-1 pl-4 list-disc text-[#FFF8EB]/75">
                <li>Full access to orders, inventory, wholesale dealers, quotations, and analytics.</li>
                <li>Exclusive authority to appoint, manage, or remove staff accounts.</li>
                <li>Single-use activation: this token expires immediately upon completion.</li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#F4C45E] via-[#E5B242] to-[#D6A52D] hover:from-[#FFE7A3] hover:to-[#F4C45E] text-[#28143F] font-black text-sm tracking-wide shadow-royal hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#28143F] border-t-transparent rounded-full animate-spin" />
                  <span>Activating Account...</span>
                </>
              ) : (
                <>
                  <Crown className="w-5 h-5 text-[#28143F]" />
                  <span>Activate Super Admin Account</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="pt-2 text-center text-[10px] text-[#FFF8EB]/50 border-t border-[#F4C45E]/20">
          <span>Sri Balaji Special Mixtures • Paralakhemundi, Odisha • Gandhi School Road</span>
        </div>

      </div>
    </div>
  );
};
