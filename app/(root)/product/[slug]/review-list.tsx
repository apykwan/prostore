'use client';

import { useState } from 'react';
import Link from 'next/link';

import ReviewForm from './review-form';
import { Review } from '@/types';

export default function ReviewList(
  { userId, productId, productSlug }: { userId: string; productId: string; productSlug: string; }
) {
  const [reviews, setReviews] = useState<Review[]>([]);

  function reload() {
    console.log('Review Submitted');
  }
  return (
    <div className="space-y-4">
      {reviews.length === 0 && <div>No reviews yet</div>}
      {
        userId ? (
          <ReviewForm 
            userId={userId}
            productId={productId}
            onReviewSubmitted={reload}
          />
        ) : (
          <div>
            Please 
            <Link 
              className="text-blue-700 px-2 underline" 
              href={`/sign-in?callbackUrl=/product/${productSlug}`}
            >
              Sign In
            </Link>
            to write a review
          </div>
        )
      }
      <div className="flex flex-col gap-3">
        
      </div>
    </div>
  );
}