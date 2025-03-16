import { useState, type FormEvent } from 'react';
import { useElements, useStripe, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';

import { formatCurrency } from '@/lib/utils';
import { SERVER_URL } from '@/lib/constants';

export default function StripeForm(
  { orderId, priceInCents }: 
  { orderId: string; priceInCents: number; }
) {
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${SERVER_URL}/order/${orderId}/stripe-payment-success`,
        },
      });

      if (error?.type === 'card_error' || error?.type === 'validation_error') {
        setErrorMessage(error.message || 'An unknown error occurred');
      } else if (error) {
        setErrorMessage('An unknown error occurred');
      }
    } catch (err) {
      setErrorMessage('Something went wrong. Please try again.');
      console.error('Payment confirmation error:', err);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="text-xl">Stripe Checkout</div>
      {errorMessage && <div className="text-destructive">{errorMessage}</div>}
      <PaymentElement />
      <Button 
        className="w-full" 
        size="lg" 
        disabled={stripe == null || elements == null || isLoading}
      >
        {isLoading ? "Purchasing..." : `Purchase ${formatCurrency(priceInCents)}`}
      </Button>
    </form>
  );
}