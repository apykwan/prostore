'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

import { useToast } from  '@/hooks/use-toast';
import { 
  createPayPalOrder, 
  approvePayPalOrder, 
  updateOrderToPaidCOD, 
  deliverOrder 
} from '@/lib/actions/order.actions';
import { formatId, formatDateTime, formatCurrency } from '@/lib/utils';
import { Order } from '@/types'

export default function OrderDetailsTable(
  { order, paypalClientId, isAdmin }: { 
    order: Omit<Order, 'paymentResult'>, 
    paypalClientId: string, 
    isAdmin: boolean 
  }
) {
  const {
    id,
    shippingAddress,
    orderitems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod,
    isDelivered,
    isPaid,
    paidAt,
    deliveredAt,
  } = order;

  const { toast } = useToast();

  function PrintLoadingState() {
    const [{ isPending, isRejected }] = usePayPalScriptReducer();

    let status = '';

    if (isPending) {
      status = 'Loading PayPal...';
    } else if (isRejected) {
      status = 'Error Loading PayPal';
    }

    return status;
  }

  async function handleCreatePayPalOrder () {
    const res = await createPayPalOrder(order.id);

    if (!res.success) {
      toast({
        variant: 'destructive',
        description: res.message
      });
    }

    return res.data;
  }

  async function handleApprovePayPalOrder(data: { orderID: string; }) {
    const res = await approvePayPalOrder(id, data);

    toast({
      variant: res.success ? 'default' : 'destructive',
      description: res.message
    });
  }

  // Button to mark order as Paid
  function MarkAsPaidButton() {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    return (
      <Button 
        type="button" 
        disabled={isPending} 
        onClick={() => startTransition(async () => {
          const res = await updateOrderToPaidCOD(order.id);
          toast({
            variant: res.success ? 'default' : 'destructive',
            description: res.message
          });
        })}
      >
        { isPending ? 'processing...' : 'Mark As Paid' }
      </Button>
    );
  }

  function MarkAsDeliveredButton() {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    return (
      <Button 
        type="button" 
        disabled={isPending} 
        onClick={() => startTransition(async () => {
          const res = await deliverOrder(order.id);
          toast({
            variant: res.success ? 'default' : 'destructive',
            description: res.message
          });
        })}
      >
        { isPending ? 'processing...' : 'Mark As Delivered' }
      </Button>
    );
  }
  return (
    <>
      <h1 className="py-4 text-2xl">Order { formatId(id) }</h1>
      <div className="grid md:grid-cols-3 gap-5">
        <div className="col-span-2 space-y-4 overflow-x-auto">
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Payment Method</h2>
              <p>{paymentMethod}</p>
              { isPaid ? (
                <Badge variant="secondary">
                  Paid at { formatDateTime(paidAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant="destructive">Not Paid</Badge>
              )}
            </CardContent>
          </Card>
          
          <Card className="my-2">
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Shipping Address</h2>
              <p className="mb-1">{shippingAddress.fullName}</p>
              <p>
                {shippingAddress.streetAddress}, {shippingAddress.city} <br />
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
              { isDelivered ? (
                <Badge variant="secondary">
                  Delivered at { formatDateTime(deliveredAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant="destructive">Not Delivered</Badge>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-4 gap-4'>
              <h2 className='text-xl pb-4'>Order Items</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderitems.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link
                          href={`/product/{item.slug}`}
                          className='flex items-center'
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          />
                          <span className='px-2'>{item.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className='px-2'>{item.qty}</span>
                      </TableCell>
                      <TableCell className='text-right'>
                        ${item.price}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-2 md:col-span-1">
          <Card>
            <CardContent className='p-4 gap-4 space-y-4'>
              <div className='flex justify-between'>
                <div>Items</div>
                <div>{formatCurrency(itemsPrice)}</div>
              </div>
              <div className='flex justify-between'>
                <div>Tax</div>
                <div>{formatCurrency(taxPrice)}</div>
              </div>
              <div className='flex justify-between'>
                <div>Shipping</div>
                <div>{formatCurrency(shippingPrice)}</div>
              </div>
              <div className='flex justify-between'>
                <div>Total</div>
                <div>{formatCurrency(totalPrice)}</div>
              </div>

              {/* PayPal Payment*/}
              {!isPaid && paymentMethod === 'PayPal' && (
                <div>
                  <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                    <PrintLoadingState />
                    <PayPalButtons
                      createOrder={handleCreatePayPalOrder}
                      onApprove={handleApprovePayPalOrder}
                    />
                  </PayPalScriptProvider>
                </div>
              )}

              {/* Cash on Delivery */}
              {isAdmin && !isPaid && paymentMethod === 'CashOnDelivery' && <MarkAsPaidButton />}
              {isAdmin && isPaid && !isDelivered && <MarkAsDeliveredButton />}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}