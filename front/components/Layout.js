import NavBar from "./NavBar";
import { useState } from "react";
import { useQuery } from "react-query";
import axiosBaseURL from "./axiosBaseUrl";
import apiMapper from "./apiMapper";
import cookies from "next-cookies";
import { getCookie } from "cookies-next";

export default function Layout({ children, cookie }) {
  console.log("cookie", cookie);
  const [refreshStop, setRefreshStop] = useState(false);
  // const cookieStore = cookies();
  // const refreshToken = cookieStore.get("refresh_token");
  // const getAccessToken = () => {
  //   return axiosBaseURL.post(apiMapper.user.post.JWT_REFRESH, {
  //     refresh: refreshToken,
  //   });
  // };

  // useQuery(["access_token"], getAccessToken, {
  //   refetchOnWindowFocus: false,
  //   refetchOnMount: false,
  //   refetchOnReconnect: false,
  //   retry: 2,
  //   refetchInterval: refreshStop ? false : 30 * 60 * 1000, // access token 유효기간이 30분
  //   refetchIntervalInBackground: true,
  //   onError: () => {
  //     setRefreshStop(true);
  //     typeof window !== "undefined"
  //       ? localStorage.setItem("access_token", "")
  //       : null;
  //   },
  //   onSuccess: (data) => {
  //     const token = data?.data?.access_token;
  //     // access 토큰을 받아와서 새로 저장
  //     if (token)
  //       typeof window !== "undefined"
  //         ? localStorage.setItem("access_token", token)
  //         : null;
  //   },
  // });
  return (
    <div>
      <NavBar />
      {children}
    </div>
  );
}

export const getServerSideProps = (context) => {
  const cookie = context.req ? context.req.headers.cookie : "";

  const refreshToken = getCookie("refresh_token");
  return {
    props: cookie,
  };
};
