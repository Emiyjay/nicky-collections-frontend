import IntentCollectionPage from '../../components/IntentCollectionPage';
import { SITE_NAME } from '../../lib/site';

export async function getServerSideProps() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  let products = [];
  try {
    const response = await fetch(`${apiUrl}/products?onSale=true&sort=newest&limit=50`);
    const data = await response.json();
    products = Array.isArray(data) ? data : (data.products || []);
  } catch (error) {
    console.error('Sale products fetch failed:', error);
  }

  return { props: { products } };
}

export default function SalePage({ products }) {
  return <IntentCollectionPage
    title="Sale"
    description={`Shop discounted fashion from ${SITE_NAME}. Find products with a current price below their original comparison price while stock lasts.`}
    path="/collections/sale"
    eyebrow="Limited Time"
    products={products}
    emptyMessage="There are no discounted products available right now. Check back for the next drop."
  />;
}
