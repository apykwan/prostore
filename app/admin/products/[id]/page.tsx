import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { requireAdmin } from '@/lib/auth-guard';
import ProductForm from '@/components/admin/product-form';
import { getProductById } from '@/lib/actions/product.actions';

export const metadata: Metadata = {
  title: 'Update Product',
};

export default async function AdminProductUpdatePage (
  { params }: { params: Promise<{ id: string }>}
) {
  await requireAdmin();

  const { id } = await params;

  const product = await getProductById(id);
  if (!product) return notFound();

  return (
    <div className='space-y-8 max-w-5xl mx-auto'>
      <h1 className='h2-bold'>Update Product</h1>
      <ProductForm type='Update' product={product} productId={product.id} />
    </div>
  );
};
