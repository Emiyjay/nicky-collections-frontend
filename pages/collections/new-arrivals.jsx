import IntentCollectionPage from '../../components/IntentCollectionPage';
import { SITE_NAME } from '../../lib/site';

export async function getServerSideProps({ req }) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  let products = [];
  try {
    const response = await fetch(`${apiUrl}/products?isNewArrival=true&sort=newest&limit=50`);
    const data = await response.json();
    products = Array.isArray(data) ? data : (data.products || []);
  } catch (error) {
    console.error('New arrivals fetch failed:', error);
  }

  return { props: { products } };
}

export default function NewArrivalsPage({ products }) {
  return <IntentCollectionPage
    title="New Arrivals"
    description={`Discover the newest fashion drops from ${SITE_NAME}. Shop recently added footwear, outerwear, accessories, clothing and collectibles.`}
    path="/collections/new-arrivals"
    eyebrow="Just In"
    products={products}
    emptyMessage="New arrivals will appear here as soon as they are added to the store."
  />;
}
