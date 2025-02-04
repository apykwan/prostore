import { Fragment } from 'react';

import { cn } from '@/lib/utils';

const steps = ['User Login', 'Shipping Address', 'Payment Method', 'Place Order'];

export default function CheckoutSteps({ current = 0 }: { current: number }) {
  return (
    <div className="flex-between flex-col md:flex-row space-x-2 space-y2 mb-10">
      {steps.map((step, idx) => (
        <Fragment key={step}>
          <div className={cn('p-2 w-56 rounded-full text-center', idx === current ? 'bg-secondary' : '')}>
            {step}
          </div>
          {step !== 'Place Order' && (
            <hr className="w-16 border-t border-gray-300 mx-2" />
          )}
        </Fragment>
      ))}
    </div>
  );
}