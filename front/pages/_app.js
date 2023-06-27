import Layout from "@/components/Layout";
import { useRouter } from 'next/router';
import './../styles/globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}
