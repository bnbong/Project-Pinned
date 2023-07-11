import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const withAuth = (Component) => {
  const Auth = () => {
    const [mounted, setMounted] = useState(false);

    //브라우저와 SSR HTML 불일치로 인해 useEffect를 이용해 랜더링된 후 업데이트되게 해준다.
    useEffect(() => {
      setMounted(true);
    }, []);
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
      toast.error("로그인을 해주세요!");
      useEffect(() => {
        router.replace("/login");
      }, []);

      return mounted && <></>;
    }
    return mounted && <Component />;
  };

  return Auth;
};

export default withAuth;
