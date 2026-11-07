import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CustomerReview {
  id: string;
  productId?: string; // If undefined or 'general', applies to store feedback
  productName?: string;
  authorName: string;
  city: string; // e.g. Paralakhemundi, Berhampur
  rating: number; // 1 to 5
  title: string;
  comment: string;
  photoUrl?: string; // Base64 data URL for uploaded snack photo
  createdAt: string; // ISO date
  helpfulCount: number;
  verifiedPurchase: boolean;
  orderNumber?: string;
}

interface ReviewState {
  reviews: CustomerReview[];
  helpfulVotedIds: string[]; // ids user has voted on in current browser session
  addReview: (review: Omit<CustomerReview, 'id' | 'createdAt' | 'helpfulCount'>) => { success: boolean; error?: string };
  markHelpful: (reviewId: string) => boolean;
  getReviewsForProduct: (productId?: string) => CustomerReview[];
  getAverageRating: (productId?: string) => { average: number; total: number; distribution: Record<number, number> };
}

export const useReviewStore = create<ReviewState>()(
  persist(
    (set, get) => ({
      // Strict authenticity: Start with empty array — zero fake reviews generated!
      reviews: [],
      helpfulVotedIds: [],

      addReview: (reviewData) => {
        // Validation & Anti-Spam checks
        const authorClean = reviewData.authorName?.trim() || '';
        const titleClean = reviewData.title?.trim() || '';
        const commentClean = reviewData.comment?.trim() || '';
        const cityClean = reviewData.city?.trim() || '';
        const rating = Number(reviewData.rating);

        if (authorClean.length < 2) {
          return { success: false, error: 'Please enter your full name (at least 2 characters).' };
        }
        if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
          return { success: false, error: 'Please select a valid rating between 1 and 5 stars.' };
        }
        if (titleClean.length < 3) {
          return { success: false, error: 'Please enter a review title (at least 3 characters).' };
        }
        if (commentClean.length < 10) {
          return { success: false, error: 'Please share your honest feedback (at least 10 characters).' };
        }

        // Spam prevention / URL check
        const urlPattern = /(https?:\/\/|www\.|\.com|\.org|\.io|\.net)/i;
        if (urlPattern.test(commentClean) || urlPattern.test(titleClean)) {
          return { success: false, error: 'Links/URLs are not allowed in reviews to prevent spam.' };
        }

        const newReview: CustomerReview = {
          id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          productId: reviewData.productId || 'general',
          productName: reviewData.productName || 'Sri Balaji Savouries',
          authorName: authorClean,
          city: cityClean || 'Odisha, India',
          rating,
          title: titleClean,
          comment: commentClean,
          photoUrl: reviewData.photoUrl,
          createdAt: new Date().toISOString(),
          helpfulCount: 0,
          verifiedPurchase: Boolean(reviewData.verifiedPurchase || reviewData.orderNumber),
          orderNumber: reviewData.orderNumber?.trim(),
        };

        set((state) => ({
          reviews: [newReview, ...state.reviews],
        }));

        return { success: true };
      },

      markHelpful: (reviewId: string) => {
        const state = get();
        if (state.helpfulVotedIds.includes(reviewId)) {
          return false; // Already marked helpful
        }

        set((prev) => ({
          reviews: prev.reviews.map((r) =>
            r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r
          ),
          helpfulVotedIds: [...prev.helpfulVotedIds, reviewId],
        }));
        return true;
      },

      getReviewsForProduct: (productId?: string) => {
        const all = get().reviews;
        if (!productId || productId === 'all') return all;
        return all.filter((r) => r.productId === productId || r.productId === 'general');
      },

      getAverageRating: (productId?: string) => {
        const productReviews = get().getReviewsForProduct(productId);
        const total = productReviews.length;
        const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

        if (total === 0) {
          return { average: 0, total: 0, distribution };
        }

        let sum = 0;
        productReviews.forEach((r) => {
          sum += r.rating;
          distribution[r.rating] = (distribution[r.rating] || 0) + 1;
        });

        return {
          average: Number((sum / total).toFixed(1)),
          total,
          distribution,
        };
      },
    }),
    {
      name: 'sri-balaji-reviews-storage',
    }
  )
);
