import React, { useState } from 'react';
import { ExternalLink, Share2, Heart, MessageCircle, Check } from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';
import { WhatsAppIcon } from './WhatsAppIcon';

interface InstagramPost {
  id: string;
  image: string;
  caption: string;
  likes: number;
  postUrl: string;
}

const AUTHENTIC_POSTS: InstagramPost[] = [
  {
    id: 'post-1',
    image: '/images/products/onion-mixture.png',
    caption: 'Golden fried onions, slow-roasted cashews & crunchy curry leaves. The iconic Onion Mixture from Paralakhemundi! #SriBalaji',
    likes: 342,
    postUrl: 'https://www.instagram.com/sri_balaji_special_mixtures/'
  },
  {
    id: 'post-2',
    image: '/images/products/chuda-mixture.png',
    caption: 'Crisp beaten rice (poha) tossed with fragrant groundnuts. The perfect rainy evening tea partner! #TraditionalTaste',
    likes: 289,
    postUrl: 'https://www.instagram.com/sri_balaji_special_mixtures/'
  },
  {
    id: 'post-3',
    image: '/images/products/kar-kar-murrukulu.png',
    caption: 'Handcrafted spirals of pure crunch: Kar Kar Murrukulu made using Sri Adari Krishna Rao’s original 1995 formulation.',
    likes: 412,
    postUrl: 'https://www.instagram.com/sri_balaji_special_mixtures/'
  },
  {
    id: 'post-4',
    image: '/images/products/kaju-biscuits-mixture.png',
    caption: 'A festive favorite across South Odisha: crunchy bite-sized kaju diamonds paired with savoury boondi and spices.',
    likes: 367,
    postUrl: 'https://www.instagram.com/sri_balaji_special_mixtures/'
  }
];

export const InstagramShowcase: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleShareBrand = async () => {
    const shareData = {
      title: 'Sri Balaji Special Mixtures – Authentic Paralakhemundi Savouries',
      text: 'Explore factory-direct authentic mixtures, murrukulu & chips from Sri Balaji, Paralakhemundi since 1995!',
      url: window.location.origin
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Share cancelled or failed
      }
    } else {
      navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-imperial-dark via-imperial to-imperial-dark text-white border-2 border-gold/40 shadow-royal p-6 sm:p-10 space-y-8 relative overflow-hidden">
      {/* Decorative subtle glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div className="space-y-1">
          <span className="font-script text-gold text-2xl block">Connect With Our Heritage</span>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-imperial-dark/90 text-gold border border-gold/40 text-xs font-bold shadow-xs">
            <InstagramIcon className="w-3.5 h-3.5" />
            <span>@sri_balaji_special_mixtures</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white tracking-tight">
            Follow Our Crunch Stories on Instagram
          </h2>
          <p className="font-serif text-sm sm:text-base text-ivory/80 italic">
            Behind the scenes of our brass-sieve frying, fresh spice grinding, and retail shipments across Odisha.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleShareBrand}
            className="btn-royal-purple inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-sans font-bold"
            title="Share Sri Balaji with friends & family"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-gold" />}
            <span>{copied ? 'Link Copied!' : 'Share Brand'}</span>
          </button>

          <a
            href="https://www.instagram.com/sri_balaji_special_mixtures/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-royal-gold inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-sans font-black uppercase tracking-wider"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>Follow Us</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Grid of Authentic Posts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {AUTHENTIC_POSTS.map((post) => (
          <a
            key={post.id}
            href={post.postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative rounded-2xl overflow-hidden bg-imperial/80 border border-gold/30 hover:border-gold hover:shadow-royal transition-all duration-300 flex flex-col justify-between"
          >
            <div className="aspect-square bg-gradient-to-b from-ivory to-white overflow-hidden p-3 flex items-center justify-center">
              <img
                src={post.image}
                alt={post.caption}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 filter drop-shadow-sm"
                loading="lazy"
              />
            </div>
            
            <div className="p-4 flex flex-col justify-between flex-1 bg-gradient-to-b from-imperial-dark/95 to-imperial">
              <p className="font-serif text-xs text-ivory/85 line-clamp-3 leading-relaxed italic">
                &ldquo;{post.caption}&rdquo;
              </p>
              
              <div className="pt-3 mt-3 border-t border-gold/20 flex items-center justify-between text-xs text-gold">
                <span className="flex items-center gap-1 font-sans font-bold text-[11px]">
                  <Heart className="w-3.5 h-3.5 text-gold fill-gold" />
                  {post.likes} likes
                </span>
                <span className="flex items-center gap-1 text-[11px] font-sans text-gold-light group-hover:translate-x-0.5 transition-transform">
                  View <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>

    </div>
  );
};
