import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

import ReviewList from './review-list';
import Rating from '@/components/shared/product/rating';
import { auth } from '@/auth';
import AddToCart from '@/components/shared/product/add-to-cart';
import ProductImages from '@/components/shared/product/product-images';
import ProductPrice from '@/components/shared/product/product-price';
import { getProductBySlug } from '@/lib/actions/product.actions';
import { getMyCart } from '@/lib/actions/cart.actions';

export default async function ProductDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const session = await auth();
  const userId = session?.user?.id;

  const product = await getProductBySlug(slug);
  if (!product) return notFound(); 

  const cart = await getMyCart();

  const item = {
    productId: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    qty: 1,
    image: product.images![0]
  };
  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="col-span-2">
            <ProductImages images={product.images} />
          </div>

          <div className="col-span-2 p-5">
            <div className="flex flex-col gap-6">
              <p>{product.brand} {product.category}</p>
              <h1 className="h3-bold">{product.name}</h1>
              <Rating value={+product.rating} />
              <p>{product.numReviews} reviews</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <ProductPrice 
                  value={Number(product.price)} 
                  className="w-24 rounded-full bg-green-100 text-green-700 px-5 py-2"
                />
              </div>
            </div>

            <div className="mt-10">
              <p className="font-demibold">Description</p>
              <p>{product.description}</p>
            </div>
          </div>

          <div>
            <Card>
              <CardContent className="p-4">
                <div className="mb-2 flex justify-between">
                  <div>Price</div>
                  <div>
                    <ProductPrice value={Number(product.price)}/>
                  </div>
                </div>
                <div className="mb-2 flex justify-between">
                  <div>Status</div>
                  {product.stock > 0 ? (
                    <Badge variant='outline'>In Stock</Badge>
                  ) : (
                    <Badge variant='destructive'>Out of Stock</Badge>
                  )}
                </div>
                {product.stock > 0 && (
                  <div className="flex-center mt-5">
                    <AddToCart cart={cart} item={item} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="h2-bold">Customer Reviews</h2>
        <ReviewList 
          userId={userId || ''}
          productId={product.id}
          productSlug={product.slug}
        />
      </section>
    </>
  );
}