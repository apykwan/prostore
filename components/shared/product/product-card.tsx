import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

import Rating from '@/components/shared/product/rating';
import ProductPrice from './product-price';
import { Product } from '@/types';

export default function ProductCard({ product }: { product: Product; }) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="p-0 items-center">
        <Link href={`/product/${product.slug}`}>
          <Image src={product.images[0]} alt={product.name} height={300} width={300} priority={true} />
        </Link>
      </CardHeader>
      <CardContent className="p-4 grid gap-4">
        <div className="text-xs text-slate-500 font-bold uppercase">{product.brand}</div>
        <Link href={`/product/${product.slug}`}>
          <h2 className="text-sm font-medium">{product.name}</h2>
        </Link>
        <div className="flex-between gap-4">
          <Rating value={+product.rating} />
          {product.stock > 0 ? (
            <ProductPrice value={Number(product.price)} className="text-red-500" />
          ): (
            <p className="text-destructive text-lg font-bold uppercase">out of stock</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}