import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Stripe from 'stripe';

import { auth } from '@/auth';
import OrderDetailsTable from './order-details-table';
import { getOrderById } from '@/lib/actions/order.actions';
import { ShippingAddress } from '@/types';

export const metadata: Metadata = {
  title: 'Order Details'
};

export default async function OrderDetailsPage(
  { params }: { params: Promise<{id: string}> }
) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  const session = await auth();

  // Only admin or the buyer can view the order details
  if (session?.user.role !== 'admin' && session?.user.email !== order.user.email) redirect('/unauthorized');

  let client_secret = null;

  // Check if is not paid and using stripe
  if (order.paymentMethod === 'Stripe' && !order.isPaid) {
    // Init Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

    // Create payment intet
    const paymentINtent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalPrice) * 100),
      currency: 'USD',
      metadata: { orderId: order.id }
    });
    client_secret = paymentINtent.client_secret;
  }
  return (
    <>
      <OrderDetailsTable 
        order={{
          ...order,
          shippingAddress: order.shippingAddress as ShippingAddress
        }}
        stripeClientSecret={client_secret} 
        paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
        isAdmin={session?.user?.role === 'admin' || false}
      />
    </>
  );
}