import '../styles/globals.css';
import { AuthProvider } from '../lib/AuthContext';
import Layout from '../components/Layout';
import ProductInquiryModal from '../components/ProductInquiryModal';

export default function App({ Component, pageProps }) {
  const noLayout = Component.noLayout;

  return (
    <AuthProvider>
      {noLayout ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
      <ProductInquiryModal />
    </AuthProvider>
  );
}
