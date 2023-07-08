import { AuthContext } from "@/contexts/AuthContext";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/router";
import { useContext } from "react";

const withAuth = (Component) => {
  const Auth = () => {
    // context 등의 상태를 통해 조건부 처리를 한다
    const loginState = useContext(AuthContext);
    const router = useRouter();

    if (!loginState.accessToken) {
      // Login 컴포넌트를 출력하거나
      // 이미 로그인 화면이 구현된 페이지를 사용하고 라우팅
      // router.push("/login");
      alert("로그인이 필요합니다.");
      router.push("/");
      return <div>login plz</div>;
    }
    return <Component />;
  };

  return Auth;
};

export default withAuth;
