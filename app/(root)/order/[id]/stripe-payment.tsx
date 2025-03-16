import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import StripeForm from './strip-form';
import { useTheme } from 'next-themes';

export default function StripePayment(
  { priceInCents, orderId, clientSecret }:
  { priceInCents: number; orderId: string; clientSecret: string; }
) {
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);
  const { theme, systemTheme } = useTheme();

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
      <StripeForm 
        priceInCents={priceInCents}
        orderId={orderId}
      />
    </Elements>
  );
}