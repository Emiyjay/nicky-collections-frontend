import '../styles/globals.css';
import { AuthProvider } from '../lib/AuthContext';
import Layout from '../components/Layout';
import ProductInquiryModal from '../components/ProductInquiryModal';

export default function App({ Component, pageProps }) {
  const noLayout = Component.noLayout;
  const productContext = pageProps?.initialProduct || null;

  return (
    <AuthProvider>
      {noLayout ? (
        <Component {...pageProps} />
      ) : (
        <Layout productContext={productContext}>
          <Component {...pageProps} />
        </Layout>
      )}
      <ProductInquiryModal />
    </AuthProvider>
  );
}
