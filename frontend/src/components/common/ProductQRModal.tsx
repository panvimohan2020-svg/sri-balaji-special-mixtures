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
          dark: '#28143F', // Deep Imperial Purple
          light: '#FFF8EB'  // Warm Ivory
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
      className="p-0 rounded-3xl bg-white shadow-royal border border-gold/30 text-cocoa max-w-sm w-[92vw] overflow-hidden m-auto backdrop:bg-imperial-dark/80 backdrop:backdrop-blur-sm"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-imperial-dark via-imperial to-imperial-secondary text-white p-4 flex items-center justify-between border-b border-gold/30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gold/20 border border-gold/40 flex items-center justify-center text-gold">
            <QrCode className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-gold block">
              Packaging QR Code
            </span>
            <h3 id="qr-dialog-title" className="font-display font-bold text-sm text-white truncate max-w-[200px]">
              {product.name}
            </h3>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gold-light flex items-center justify-center transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="p-6 text-center space-y-4">
        <p className="text-xs text-cocoa-muted leading-relaxed">
          Scan this QR code with any smartphone camera to open this snack's catalogue details, weight options, and wholesale rates.
        </p>

        {/* QR Canvas Display */}
        <div className="p-4 bg-ivory rounded-2xl border border-gold/25 inline-block shadow-inner">
          <canvas ref={canvasRef} className="rounded-xl mx-auto" />
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          {/* Primary CTA: Saffron Gold background with Deep Purple text */}
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gold hover:bg-gold-rich text-imperial font-black text-xs transition-colors shadow-gold"
          >
            <Download className="w-3.5 h-3.5 text-imperial" />
            <span>Save PNG</span>
          </button>

          {/* Secondary CTA: Deep Purple with Gold borders & text */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-gold/30 bg-imperial hover:bg-imperial-secondary text-gold font-bold text-xs transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald" />
                <span className="text-emerald">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-gold" />
                <span>Copy URL</span>
              </>
            )}
          </button>
        </div>
      </div>
    </dialog>
  );
};
