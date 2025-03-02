import ProductCarousel from '@/components/shared/product/product-carousel';
import ProductList from '@/components/shared/product/product-list';
import { getLatestProducts, getFeatureProducts } from '@/lib/actions/product.actions';
import { LATEST_PRODUCTS_LIMIT } from '@/lib/constants';

export default async function Homepage() {
  const latestProducts = await getLatestProducts();
  return (
    <>
      <ProductList 
        data={latestProducts} 
        title='Newest Arrival' 
        limit={LATEST_PRODUCTS_LIMIT} 
      />
    </>
  );
}