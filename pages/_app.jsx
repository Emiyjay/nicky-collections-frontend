import '../styles/globals.css';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AuthProvider } from '../lib/AuthContext';
import Layout from '../components/Layout';
import { SITE_NAME, SITE_URL, organizationSchema } from '../lib/seo';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const noLayout = Component.noLayout;
  const canonicalPath = router.asPath.split('?')[0].split('#')[0] || '/';
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;

  return (
    <AuthProvider>
      <Head>
        <meta name="application-name" content={SITE_NAME} />
        <meta name="theme-color" content="#111111" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
        />
      </Head>
      {noLayout ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </AuthProvider>
  );
}
