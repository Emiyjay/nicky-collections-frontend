import IntentCollectionPage from '../../components/IntentCollectionPage';
import { SITE_NAME } from '../../lib/site';

export async function getServerSideProps() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  let products = [];
  try {
    const response = await fetch(`${apiUrl}/products?isFeatured=true&sort=rating&limit=50`);
    const data = await response.json();
    products = Array.isArray(data) ? data : (data.products || []);
  } catch (error) {
    console.error('Featured products fetch failed:', error);
  }

  return { props: { products } };
}

export default function FeaturedPage({ products }) {
  return <IntentCollectionPage
    title="Featured Products"
    description={`Explore the hand-picked products ${SITE_NAME} is highlighting right now, from standout footwear and outerwear to accessories and collectibles.`}
    path="/collections/featured"
    eyebrow="Hand-Picked"
    products={products}
    emptyMessage="Featured products will appear here when the store highlights its next selection."
  />;
}
