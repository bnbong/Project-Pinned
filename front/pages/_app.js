import Layout from "@/components/Layout";
import "./../styles/globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { useEffect, useState, Suspense } from "react";
import { PostProvider } from "@/contexts/PostContext";
import { Toaster, toast } from "react-hot-toast";
import { Spinner } from "flowbite-react";

export default function App({ Component, pageProps }) {
  //React와는 달리 페이지 이동시 _app.js부터 새롭게 랜더링되 useState를 이용해 단 한번만 선언되게 해야한다.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            suspense: true,
          },
        },
      })
  );
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Suspense fallback={<Spinner />}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={true} />
        <PostProvider>
          <AuthProvider>
            {mounted && <Toaster />}
            {router.pathname == "/login" || router.pathname == "/signup" ? (
              <Component {...pageProps} />
            ) : (
              <Layout>
                <Component {...pageProps} />
              </Layout>
            )}
          </AuthProvider>
        </PostProvider>
      </QueryClientProvider>
    </Suspense>
  );
}
