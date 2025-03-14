import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useElements, useStripe, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';

import { useTheme } from 'next-themes';
import { formatCurrency } from '@/lib/utils';

export default function StripePayment(
  { priceInCents, orderId, clientSecret }:
  { priceInCents: number; orderId: string; clientSecret: string; }
) {
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);

  const { theme, systemTheme } = useTheme();

  function StripeForm() {
    const stripe = useStripe();
    const elements = useElements();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    return (
      <form className="space-y-4">
        <div className="text-xl">Stripe Checkout</div>
        {errorMessage && <div className="text-destructive">{errorMessage}</div>}
        <PaymentElement />
        <Button 
          className="w-full" 
          size="lg" 
          disabled={stripe == null || elements == null || isLoading}
        >
          {isLoading ? "Purchasing..." : `Purchase ${formatCurrency(priceInCents / 100)}`}
        </Button>
      </form>
    );
  }


  return (
    <Elements 
      options={{
        clientSecret,
        appearance: {
          theme: theme === "dark" 
            ? "night" 
            : theme === "light"
              ? "stripe"
              : systemTheme === "light"
                ? "stripe"
                : "night"
        }
      }}
      stripe={stripePromise}
    >
      <StripeForm />
    </Elements>
  );
}