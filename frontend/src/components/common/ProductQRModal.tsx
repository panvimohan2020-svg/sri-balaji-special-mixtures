import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, X, Copy, Check } from 'lucide-react';
import type { Product } from '../../types';

interface ProductQRModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductQRModal: React.FC<ProductQRModalProps> = ({
  product,
  isOpen,
  onClose
}) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  const productUrl = product 
    ? `${window.location.origin}/product/${product.slug}`
    : '';

  useEffect(() => {
    if (isOpen && product && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, productUrl, {
        width: 240,
        margin: 2,
        color: {
          dark: '#771D1D', // Deep royal crimson
          light: '#FFFDF9'  // Warm cream
        }
      });
    }
  }, [isOpen, product, productUrl]);

  if (!product) return null;

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `SriBalaji-QR-${product.slug}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(productUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="qr-dialog-title"
      className="p-0 rounded-2xl bg-white shadow-elevated border border-cream-border text-spice max-w-sm w-[92vw] overflow-hidden m-auto"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-crimson-800 to-crimson-900 text-cream-warm p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gold-500/20 border border-gold-400/40 flex items-center justify-center">
            <QrCode className="w-4 h-4 text-gold-300" />
          </div>
          <div>
            <h2 id="qr-dialog-title" className="font-display font-bold text-base text-white">
              Product QR Code
            </h2>
            <p className="text-[11px] text-gold-200">Printable Packaging Code</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-cream-surface/80 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close QR dialog"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 text-center space-y-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700">
            {product.category?.name || 'Snacks'}
          </span>
          <h3 className="font-display font-bold text-base text-spice-dark">
            {product.name}
          </h3>
          <p className="text-[11px] text-spice-muted mt-0.5">
            Scan to reorder fresh wholesale batches or view certified ingredients.
          </p>
        </div>

        {/* Canvas QR Code Display */}
        <div className="p-4 bg-cream-surface rounded-2xl border border-cream-border inline-block shadow-inner">
          <canvas ref={canvasRef} className="rounded-xl" />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleDownload}
            className="flex-1 py-2.5 px-3 rounded-xl bg-crimson-800 hover:bg-crimson-900 text-cream-warm text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
          >
            <Download className="w-4 h-4 text-gold-300" />
            <span>Download PNG</span>
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className="py-2.5 px-3 rounded-xl border border-cream-border hover:bg-cream-warm text-spice text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-spice-muted" />
                <span>Copy URL</span>
              </>
            )}
          </button>
        </div>
      </div>
    </dialog>
  );
};

