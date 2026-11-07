import React, { useState, useRef } from 'react';
import { Star, ThumbsUp, Camera, CheckCircle2, AlertCircle, X, Filter } from 'lucide-react';
import { useReviewStore } from '../../store/useReviewStore';
import { useNotificationStore } from '../../store/useNotificationStore';

interface ReviewsSectionProps {
  productId?: string;
  productName?: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  productId = 'general',
  productName = 'Sri Balaji Savouries',
  title = 'Customer Reviews & Ratings',
  subtitle = 'Authentic feedback directly from verified snack lovers and Kirana partners.',
  className = '',
}) => {
  const { reviews, helpfulVotedIds, addReview, markHelpful, getReviewsForProduct, getAverageRating } = useReviewStore();
  const { addToast } = useNotificationStore();

  const [activeFilter, setActiveFilter] = useState<'all' | '5' | '4' | '3' | '2' | '1' | 'photos'>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  // Form State
  const [authorName, setAuthorName] = useState('');
  const [city, setCity] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [comment, setComment] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [photoDataUrl, setPhotoDataUrl] = useState<string | undefined>(undefined);
  const [formError, setFormError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const photoModalRef = useRef<HTMLDialogElement>(null);

  const productReviews = getReviewsForProduct(productId);
  const { average, total, distribution } = getAverageRating(productId);

  // Filter logic
  const filteredReviews = productReviews.filter((r) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'photos') return Boolean(r.photoUrl);
    return r.rating === Number(activeFilter);
  });

  const handleOpenForm = () => {
    setIsFormOpen(true);
    setFormError(null);
    if (dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    if (dialogRef.current && dialogRef.current.open) {
      dialogRef.current.close();
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file (JPG, PNG, or WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormError('Photo size exceeds 5MB limit. Please upload a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoDataUrl(event.target?.result as string);
      setFormError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const result = addReview({
      productId,
      productName,
      authorName,
      city,
      rating,
      title: reviewTitle,
      comment,
      orderNumber,
      photoUrl: photoDataUrl,
      verifiedPurchase: Boolean(orderNumber.trim()),
    });

    if (!result.success) {
      setFormError(result.error || 'Please check your inputs.');
      return;
    }

    addToast({
      title: 'Review Submitted Successfully!',
      description: 'Thank you for sharing your feedback with the Sri Balaji community.',
      type: 'success',
    });
    
    // Reset form
    setAuthorName('');
    setCity('');
    setRating(5);
    setReviewTitle('');
    setComment('');
    setOrderNumber('');
    setPhotoDataUrl(undefined);
    handleCloseForm();
  };

  const handleHelpfulClick = (reviewId: string) => {
    const success = markHelpful(reviewId);
    if (success) {
      addToast({
        title: 'Thank You!',
        description: 'Marked review as helpful.',
        type: 'info',
      });
    } else {
      addToast({
        title: 'Already Marked',
        description: 'You have already marked this review as helpful.',
        type: 'info',
      });
    }
  };

  const ratingDescriptions: Record<number, string> = {
    5: 'Outstanding Crunch & Taste (5/5)',
    4: 'Very Fresh & Tasty (4/5)',
    3: 'Good Quality (3/5)',
    2: 'Average (2/5)',
    1: 'Needs Improvement (1/5)',
  };

  return (
    <section className={`py-12 ${className}`} aria-labelledby="reviews-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-ivory-border">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-turmeric-100 border border-turmeric-300 text-cocoa font-bold text-xs uppercase tracking-widest mb-3">
              <Star className="w-3.5 h-3.5 text-turmeric-600 fill-turmeric-500" />
              <span>Real Customer Feedback</span>
            </div>
            <h2 id="reviews-heading" className="text-3xl font-display font-extrabold text-plum-900 tracking-tight">
              {title}
            </h2>
            <p className="text-sm text-cocoa-muted mt-1 max-w-xl">
              {subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenForm}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-chilli text-white font-bold text-sm shadow-chilli hover:bg-chilli-600 active:scale-95 transition-all w-fit"
          >
            <Star className="w-4 h-4 fill-white" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Rating Breakdown & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 p-6 sm:p-8 rounded-3xl bg-ivory-warm border border-ivory-border shadow-soft">
          
          {/* Average Score Box */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-4 border-b lg:border-b-0 lg:border-r border-ivory-border">
            <span className="text-6xl font-display font-black text-plum-900 tracking-tight">
              {total > 0 ? average.toFixed(1) : '—'}
            </span>
            <div className="flex items-center gap-1.5 my-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(average)
                      ? 'text-turmeric fill-turmeric'
                      : 'text-stone-300 fill-stone-100'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-cocoa">
              {total > 0 ? `Based on ${total} verified ${total === 1 ? 'review' : 'reviews'}` : 'No reviews recorded yet'}
            </span>
            <span className="text-xs text-cocoa-muted mt-1">
              100% Authentic Sri Balaji customer opinions
            </span>
          </div>

          {/* Star Distribution Progress Bars */}
          <div className="lg:col-span-8 flex flex-col justify-center space-y-2.5">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = distribution[stars] || 0;
              const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

              return (
                <div key={stars} className="flex items-center gap-3 text-xs font-semibold text-cocoa">
                  <span className="w-10 text-right font-bold flex items-center justify-end gap-1">
                    {stars} <Star className="w-3 h-3 text-turmeric fill-turmeric inline" />
                  </span>
                  <div className="flex-1 h-3 rounded-full bg-stone-200/80 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-turmeric to-chilli transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-12 text-cocoa-muted text-right font-mono">
                    {percentage}% ({count})
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <span className="text-xs font-bold text-cocoa-muted uppercase tracking-wider flex items-center gap-1 mr-2">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {[
            { id: 'all', label: `All Reviews (${total})` },
            { id: '5', label: `5 Stars (${distribution[5] || 0})` },
            { id: '4', label: `4 Stars (${distribution[4] || 0})` },
            { id: '3', label: `3 Stars (${distribution[3] || 0})` },
            { id: '2', label: `2 Stars (${distribution[2] || 0})` },
            { id: '1', label: `1 Star (${distribution[1] || 0})` },
            { id: 'photos', label: 'With Photos' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                activeFilter === tab.id
                  ? 'bg-plum-900 text-white border-plum-900 shadow-sm'
                  : 'bg-white text-cocoa border-ivory-border hover:bg-ivory-warm'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Reviews List */}
        {filteredReviews.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl bg-ivory-warm border-2 border-dashed border-ivory-border">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-turmeric-100 border border-turmeric-300 flex items-center justify-center text-turmeric-600">
              <Star className="w-8 h-8 fill-turmeric-400" />
            </div>
            <h3 className="text-xl font-display font-bold text-plum-900 mb-1">
              Be the First to Review!
            </h3>
            <p className="text-sm text-cocoa-muted max-w-md mx-auto mb-6">
              Have you tasted {productName}? Help other snack lovers by sharing your experience, crunch rating, and feedback.
            </p>
            <button
              type="button"
              onClick={handleOpenForm}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-chilli text-white font-bold text-xs uppercase tracking-wider hover:bg-chilli-600 transition-all shadow-chilli"
            >
              <Star className="w-3.5 h-3.5 fill-white" />
              Write Your Review Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className="flex flex-col justify-between p-6 rounded-3xl bg-white border border-ivory-border shadow-soft hover:shadow-elevated transition-all duration-300 group"
              >
                <div>
                  {/* Rating Stars & Verified Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= rev.rating ? 'text-turmeric fill-turmeric' : 'text-stone-200 fill-stone-100'
                          }`}
                        />
                      ))}
                    </div>

                    {rev.verifiedPurchase && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pista-100 text-pista-800 text-[10px] font-bold border border-pista-300">
                        <CheckCircle2 className="w-3 h-3 text-pista-700" />
                        <span>Verified Buyer</span>
                      </span>
                    )}
                  </div>

                  {/* Title & Comment */}
                  <h4 className="font-display font-bold text-base text-plum-900 mb-1.5 leading-snug">
                    {rev.title}
                  </h4>
                  <p className="text-xs text-cocoa leading-relaxed line-clamp-4">
                    "{rev.comment}"
                  </p>

                  {/* Attached Photo (if any) */}
                  {rev.photoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewPhoto(rev.photoUrl || null);
                        if (photoModalRef.current) photoModalRef.current.showModal();
                      }}
                      className="mt-3 block overflow-hidden rounded-xl border border-ivory-border hover:opacity-90 transition-opacity"
                    >
                      <img
                        src={rev.photoUrl}
                        alt="Customer uploaded review photo"
                        className="w-full h-32 object-cover"
                        loading="lazy"
                      />
                      <span className="text-[10px] font-bold text-chilli-600 block text-left py-1 px-2 bg-peach-50">
                        📷 Click to enlarge photo
                      </span>
                    </button>
                  )}
                </div>

                {/* Footer: Author Info & Helpful Button */}
                <div className="pt-4 mt-4 border-t border-ivory-border flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-plum-900 block">
                      {rev.authorName}
                    </span>
                    <span className="text-[10px] text-cocoa-muted">
                      {rev.city} • {new Date(rev.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleHelpfulClick(rev.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
                      helpfulVotedIds.includes(rev.id)
                        ? 'bg-pista-100 text-pista-800 border-pista-300'
                        : 'bg-stone-50 text-cocoa-muted border-stone-200 hover:bg-stone-100'
                    }`}
                    title="Mark review as helpful"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>Helpful ({rev.helpfulCount})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Write a Review Form */}
        <dialog
          ref={dialogRef}
          aria-labelledby="write-review-title"
          className="rounded-3xl p-0 w-full max-w-lg bg-white shadow-2xl backdrop:bg-black/60 m-auto"
        >
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-ivory-border">
              <div>
                <h3 id="write-review-title" className="text-xl font-display font-bold text-plum-900">
                  Share Your Experience
                </h3>
                <p className="text-xs text-cocoa-muted mt-0.5">
                  Reviewing: <strong className="text-chilli">{productName}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseForm}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-cocoa flex items-center justify-center transition-colors"
                aria-label="Close review dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 rounded-xl bg-chilli-50 border border-chilli-200 text-chilli-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 mt-5">
              {/* Star Rating Picker */}
              <div>
                <label className="block text-xs font-bold text-cocoa uppercase tracking-wider mb-1.5">
                  Your Rating *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-110 active:scale-95"
                      aria-label={`Rate ${star} star`}
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= (hoverRating || rating)
                            ? 'text-turmeric fill-turmeric'
                            : 'text-stone-300 fill-stone-100'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-cocoa ml-2">
                    {ratingDescriptions[hoverRating || rating]}
                  </span>
                </div>
              </div>

              {/* Author & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-cocoa mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Ramesh Patnaik"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-chilli focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-cocoa mb-1">
                    City / Town
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Paralakhemundi"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-chilli focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Order Number (Optional) */}
              <div>
                <label className="block text-xs font-bold text-cocoa mb-1">
                  Order Number / Bill No. <span className="text-cocoa-muted font-normal">(Optional for Verified Badge)</span>
                </label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="e.g. SB-10492 or WhatsApp Order"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-chilli focus:border-transparent outline-none"
                />
              </div>

              {/* Review Title */}
              <div>
                <label className="block text-xs font-bold text-cocoa mb-1">
                  Headline / Title *
                </label>
                <input
                  type="text"
                  required
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Best Onion Mixture in Odisha!"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-chilli focus:border-transparent outline-none"
                />
              </div>

              {/* Comment */}
              <div>
                <label className="block text-xs font-bold text-cocoa mb-1">
                  Your Honest Review *
                </label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="How was the crunch, freshness, spice blend, and packaging? Tell us what you loved!"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-chilli focus:border-transparent outline-none resize-none"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-xs font-bold text-cocoa mb-1">
                  Add a Snack Photograph <span className="text-cocoa-muted font-normal">(Optional, max 5MB)</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                
                {photoDataUrl ? (
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-pista-400">
                    <img src={photoDataUrl} alt="Upload preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPhotoDataUrl(undefined)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center text-xs"
                      aria-label="Remove photo"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-stone-300 text-xs font-bold text-cocoa hover:bg-stone-50 transition-colors"
                  >
                    <Camera className="w-4 h-4 text-cocoa-muted" />
                    <span>Upload Snack Picture</span>
                  </button>
                )}
              </div>

              {/* CTAs */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-ivory-border">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-cocoa-muted hover:bg-stone-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-chilli text-white text-xs font-bold uppercase tracking-wider hover:bg-chilli-600 transition-all shadow-chilli active:scale-95"
                >
                  Submit Genuine Review
                </button>
              </div>
            </form>
          </div>
        </dialog>

        {/* Modal: Enlarge Photo Lightbox */}
        <dialog
          ref={photoModalRef}
          aria-labelledby="photo-modal-title"
          className="rounded-3xl p-0 max-w-2xl bg-black/90 text-white backdrop:bg-black/80 m-auto"
        >
          <div className="p-4 relative">
            <h4 id="photo-modal-title" className="sr-only">Enlarged Snack Photo</h4>
            <button
              type="button"
              onClick={() => photoModalRef.current?.close()}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors"
              aria-label="Close image preview"
            >
              <X className="w-4 h-4" />
            </button>
            {previewPhoto && (
              <img
                src={previewPhoto}
                alt="Enlarged review photograph"
                className="max-h-[75vh] w-auto max-w-full rounded-2xl mx-auto object-contain"
              />
            )}
          </div>
        </dialog>

      </div>
    </section>
  );
};
