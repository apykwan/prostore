import ProductList from '@/components/shared/product/product-list';
import sampleData from '@/db/sample-data';

export default function Homepage() {
  console.log(sampleData);
  return (
    <>
      <ProductList data={sampleData.products} title='Newest Arrival' limit={4} />
    </>
  );
}