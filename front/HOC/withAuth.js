import { useRouter } from "next/router";
import { useEffect } from "react";

const withAuth = (Component) => {
  const Auth = () => {
    // context 등의 상태를 통해 조건부 처리를 한다
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    const router = useRouter();

    if (!token || token === "") {
      // Login 컴포넌트를 출력하거나
      // 이미 로그인 화면이 구현된 페이지를 사용하고 라우팅
      // router.push("/login");

      useEffect(() => {
        router.replace("/login");
      }, []);

      return <></>;
    }
    return <Component />;
  };

  return Auth;
};

export default withAuth;
