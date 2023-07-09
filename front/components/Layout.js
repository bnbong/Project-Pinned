import NavBar from "./NavBar";
import { useState } from "react";
import { useQuery } from "react-query";
import axiosBaseURL from "./axiosBaseUrl";
import apiMapper from "./apiMapper";

export default function Layout({ children }) {
  const [refreshStop, setRefreshStop] = useState(false);
  const getAccessToken = () => {
    return axiosBaseURL.get(apiMapper.user.post.JWT_REFRESH);
  };

  useQuery(["access_token"], getAccessToken, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 2,
    refetchInterval: refreshStop ? false : 30 * 60 * 1000, // access token 유효기간이 30분
    refetchIntervalInBackground: true,
    onError: () => {
      setRefreshStop(true);
      typeof window !== "undefined" ? localStorage.setItem("") : null;
    },
    onSuccess: (data) => {
      const token = data?.data?.access_token;
      // access 토큰을 받아와서 새로 저장
      if (token)
        typeof window !== "undefined"
          ? localStorage.setItem("access_token", token)
          : null;
    },
  });
  return (
    <div>
      <NavBar />
      {children}
    </div>
  );
}
