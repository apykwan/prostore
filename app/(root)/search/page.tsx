import Link from 'next/link';

import { getAllProducts, getAllCategories } from '@/lib/actions/product.actions';
import ProductCard from '@/components/shared/product/product-card';

const prices = [
  {
    name: '$50 or less',
    value: '1-50',
  },
  {
    name: '$51 to $100',
    value: '51-100',
  },
  {
    name: '$101 to $200',
    value: '101-200',
  },
  {
    name: '$201 to $500',
    value: '201-500',
  },
  {
    name: '$501 or more',
    value: '501-100000000',
  },
];
const ratings = [4, 3, 2, 1];
const sortOrders = ['newest', 'lowest', 'highest', 'rating'];

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

  // Construct filter url
  function getFilterUrl ({
    qr,
    c,
    s,
    p,
    r,
    pg
  }: {
    qr?: string;
    c?: string;
    s?: string;
    p?: string;
    r?: string;
    pg?: string;
  }) {
    const params = { q, category, price, rating, sort, page };

    if (qr)params.q = qr;
    if (c) params.category = c;
    if (s) params.sort = s;
    if (p) params.price = p;
    if (r) params.rating = r;
    if (pg) params.page = pg;

    return `/search?${new URLSearchParams(params).toString()}`
  } 
  const products = await getAllProducts({
    query: q,
    category,
    price,
    rating,
    sort,
    page: Number(page)
  });

  const categories = await getAllCategories();
  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      <div className="filter-links">
        { /* Category Links */}
        <div className="text-xl mb-2 mt-3">Department</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link 
                href={getFilterUrl({ qr: 'all', c: 'all' })} 
                className={`${(category === 'all' || category === '') && 'font-bold'}`}
              >
                Any
              </Link>
            </li>
            {categories.map(x => (
              <li key={x.category}>
                <Link
                  href={getFilterUrl({ qr: 'all', c: x.category })} 
                  className={`${category === x.category && 'font-bold'}`}
                >
                  {x.category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        { /* Price Links */}
        <div className="text-xl mb-2 mt-8">Price</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link 
                href={getFilterUrl({ qr: 'all', p: 'all' })} 
                className={`${(category === 'all' || category === '') && 'font-bold'}`}
              >
                Any
              </Link>
            </li>
            {prices.map(p => (
              <li key={p.value}>
                <Link
                  href={getFilterUrl({ qr: 'all', p: p.value})} 
                  className={`${price === p.value && 'font-bold'}`}
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
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