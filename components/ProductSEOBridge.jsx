import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { productsAPI } from '../lib/api';
import { SITE_URL, SITE_NAME } from '../lib/site';
import { ProductStructuredData, BreadcrumbStructuredData } from './StructuredData';

export default function ProductSEOBridge() {
  const router = useRouter();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (!router.isReady || !router.pathname.startsWith('/product/') || !router.query.id) return;
    productsAPI.getOne(router.query.id).then((response) => setProduct(response.data)).catch(() => setProduct(null));
  }, [router.isReady, router.pathname, router.query.id]);

  if (!product) return null;

  const productUrl = `${SITE_URL}/product/${encodeURIComponent(product._id)}`;
  return (
    <>
      <ProductStructuredData product={product} url={productUrl} />
      <BreadcrumbStructuredData items={[
        { name: SITE_NAME, url: SITE_URL },
        { name: 'Shop', url: `${SITE_URL}/shop` },
        { name: product.category, url: `${SITE_URL}/shop?category=${encodeURIComponent(product.category)}` },
        { name: product.name, url: productUrl },
      ]} />
    </>
  );
}
