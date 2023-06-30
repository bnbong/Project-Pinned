import Layout from "@/components/Layout";
import "./../styles/globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  return (
    <AuthProvider>
      {router.pathname == "/login" ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </AuthProvider>
  );
}
