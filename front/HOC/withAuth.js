import { AuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { useContext } from "react";

const withAuth = (Component) => {
  const Auth = () => {
    // context 등의 상태를 통해 조건부 처리를 한다
    const loginState = useContext(AuthContext);
    const router = useRouter();
    if (!loginState.user) {
      router.push("/login");
      // Login 컴포넌트를 출력하거나
      // 이미 로그인 화면이 구현된 페이지를 사용하고 라우팅
      return <>login page</>;
    }
    // 로그인이 되어있다면
    return <Component />;
  };

  return Auth;
};

export default withAuth;
