import ProductList from '@/components/shared/product/product-list';
import { getLatestProducts } from '@/lib/actions/product.actions';
import { LATEST_PRODUCTS_LIMIT } from '@/lib/constants';
// import sampleData from '@/db/sample-data';

export default async function Homepage() {
  const latestProducts = await getLatestProducts();
  console.log(latestProducts);
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