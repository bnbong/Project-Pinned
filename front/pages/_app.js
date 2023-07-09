import Layout from "@/components/Layout";
import "./../styles/globals.css";
import { AuthContext, AuthProvider } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { useContext, useEffect, useState } from "react";
import useLocalStorage from "use-local-storage";
import { useSilentRefresh } from "@/hook/useSilentRefresh";

export default function App({ Component, pageProps }) {
  //React와는 달리 페이지 이동시 _app.js부터 새롭게 랜더링되 useState를 이용해 단 한번만 선언되게 해야한다.
  const [queryClient] = useState(() => new QueryClient());
  const router = useRouter();

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={true} />
      <AuthProvider>
        {router.pathname == "/login" || router.pathname == "/signup" ? (
          <Component {...pageProps} />
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </AuthProvider>
    </QueryClientProvider>
  );
}
