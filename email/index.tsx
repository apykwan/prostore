import { Resend } from 'resend';

import PurchaseReceiptEmail from './purchase-receipt';
import { SENDER_EMAIL, APP_NAME }  from '@/lib/constants';
import { Order } from '@/types';

const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function sendPurchaseReceipt({ order }: { order: Order }) {
  await resend.emails.send({
    from: `${APP_NAME} <${SENDER_EMAIL}>`,
    to: order.user.email as string,
    subject: `Order Confirmation ${order.id}`,
    react: <PurchaseReceiptEmail order={order} />
  });
}