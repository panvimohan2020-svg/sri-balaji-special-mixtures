import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Info, Store, X, ArrowRight } from 'lucide-react';
import { useNotificationStore } from '../../store/useNotificationStore';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useNotificationStore();

  if (toasts.length === 0) return null;

  return (
    <div 
      aria-live="polite" 
      aria-atomic="true"
      className="fixed top-20 right-4 md:right-6 z-50 flex flex-col gap-2 max-w-sm w-[92vw] sm:w-auto pointer-events-none"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success' || !toast.type;
        const isWholesale = toast.type === 'wholesale';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto p-4 rounded-2xl bg-spice-dark text-cream-warm border border-gold-400/40 shadow-elevated flex items-start justify-between gap-3 animate-in slide-in-from-top-3 fade-in duration-300"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {isWholesale ? (
                  <Store className="w-5 h-5 text-amber-400" />
                ) : isSuccess ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Info className="w-5 h-5 text-gold-300" />
                )}
              </div>
              <div className="space-y-0.5 text-left">
                <h4 className="font-display font-bold text-sm text-white">{toast.title}</h4>
                {toast.description && (
                  <p className="text-xs text-cream-surface/80">{toast.description}</p>
                )}
                {toast.actionLabel && toast.actionUrl && (
                  <Link
                    to={toast.actionUrl}
                    onClick={() => removeToast(toast.id)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-gold-300 hover:text-white pt-1"
                  >
                    <span>{toast.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-cream-surface/60 hover:text-white p-1 rounded-lg"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
