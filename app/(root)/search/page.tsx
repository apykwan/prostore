import { getAllProducts } from '@/lib/actions/product.actions';
import ProductCard from '@/components/shared/product/product-card';

export default async function SearchPage(
  { searchParams }: { searchParams: Promise<{ 
    q?: string; 
    category?: string;
    price?: string;
    rating?: string;
    page?: string;
    sort?: string;
  }>}
) {
  const {
    q = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
    sort = 'newest',
    page = '1'
  } = await searchParams;

  const products = await getAllProducts({
    query: q,
    category,
    price,
    rating,
    sort,
    page: Number(page)
  });

  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      <div className="filter-links">

      </div>
      <div className="md:col-span-4 space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {products.data.length === 0 && <p className="font-extrabold text-rose-600">No Products found</p>}
          {products.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}