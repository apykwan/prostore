'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

import ReviewForm from './review-form';
import Rating from '@/components/shared/product/rating';
import { getReviews } from '@/lib/actions/review.actions';
import { formatDateTime } from '@/lib/utils';
import { Review } from '@/types';

export default function ReviewList(
  { userId, productId, productSlug }: { userId: string; productId: string; productSlug: string; }
) {
  const [reviews, setReviews] = useState<Review[]>([]);

  // Reload reviews after created or updated
  async function reload() {
    const res = await getReviews({ productId });
    setReviews([...res.data]);
  }

  useEffect(() => {
    async function loadReviews() {
      const res = await getReviews({ productId });
      setReviews(res.data);
    }
    loadReviews() 
  }, [productId]);
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
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <div className="flex-between">
                <CardTitle>{review.title}</CardTitle>
              </div>
              <CardDescription>
                {review.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 text-sm text-muted-foreground">
                <Rating value={review.rating} />
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  {review.user ? review.user.name : '[deleted]'}
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  {formatDateTime(review.createdAt.toString()).dateTime}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}