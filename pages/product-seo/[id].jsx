import Head from 'next/head';
import ProductDetail from '../product/[id]';
import { SITE_NAME, SITE_URL } from '../../lib/site';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function absoluteImage(product) {
  const image = product?.images?.[0]?.url;
  return image || `${SITE_URL}/og-image.jpg`;
}

function buildProductJsonLd(product, canonicalUrl) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    url: canonicalUrl,
    image: (product.images || []).map((image) => image?.url).filter(Boolean),
    description: product.description || product.name,
    category: product.category,
    ...(product.brand ? { brand: { '@type': 'Brand', name: product.brand } } : {}),
    ...(product.colors?.length ? { color: product.colors.join(', ') } : {}),
    offers: {
      '@type': 'Offer',
      url: canonicalUrl,
      priceCurrency: 'USD',
      price: Number(product.price),
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  if (product.numReviews > 0 && Number(product.rating) > 0) {
    data.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: Number(product.rating),
      reviewCount: Number(product.numReviews),
    };
  }

  return data;
}

export default function ProductSeoShell({ product, canonicalUrl }) {
  if (!product) return <ProductDetail />;

  const title = `${product.name} — ${SITE_NAME}`;
  const description = (product.description || `${product.name} from ${SITE_NAME}.`).replace(/\s+/g, ' ').slice(0, 160);
  const image = absoluteImage(product);
  const jsonLd = buildProductJsonLd(product, canonicalUrl);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="product" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={image} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <ProductDetail />
    </>
  );
}

export async function getServerSideProps({ params, res }) {
  const identifier = params?.id;
  if (!identifier) return { notFound: true };

  try {
    const response = await fetch(`${API_URL}/products/${encodeURIComponent(identifier)}`);
    if (!response.ok) return { notFound: true };

    const product = await response.json();
    const slug = product.slug || product._id || identifier;
    const canonicalUrl = `${SITE_URL}/product/${encodeURIComponent(slug)}`;

    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400');

    return {
      props: {
        product,
        canonicalUrl,
      },
    };
  } catch (error) {
    console.error('Product SEO shell fetch failed:', error.message);
    return { notFound: true };
  }
}
