import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import Stripe from 'stripe';
import { Button } from '@/components/ui/button';

import { getOrderById } from '@/lib/actions/order.actions';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function SuccessPage({ params, searchParams }: 
  { 
    params: Promise<{ id: string; }>; 
    searchParams: Promise<{payment_intent: string }>
  }
) {
  const { id } = await params;
  const { payment_intent: paymentIntentId } = await searchParams;

  // Fetch order
  const order = await getOrderById(id);
  if (!order) notFound();

  // Retrieve payment intent
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  // Check if payment intent is valid
  if (
    paymentIntent.metadata.orderId == null || 
    paymentIntent.metadata.orderId !== order.id.toString()
  ) return notFound();

  // Check if payment is successful
  const isSuccess = paymentIntent.status === 'succeeded';
  if (!isSuccess) return redirect(`/order/${id}`);


  return (
    <div className="max-w-4xl w-full mx-auto space-y-8">
      <div className="flex flex-col gap-6 items-center">
        <h1 className="h1-bold">thanks for your purchase</h1>
        <div>We are processing your order.</div>

        <Button asChild>
          <Link href={`/order/${id}`}>View Order</Link>
        </Button>
      </div>
    </div>
  );
}