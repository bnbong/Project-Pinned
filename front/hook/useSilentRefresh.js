import axiosBaseURL from "@/components/axiosBaseUrl";
import { useState, useContext } from "react";
import { useQuery } from "react-query";
import useAuth from "@/hook/useAuth";
import { AuthContext } from "@/contexts/AuthContext";
//access token이 만료되기 전에 refresh token을 이용해 access token을 받아온다.

export const useSilentRefresh = () => {
  const [refreshStop, setRefreshStop] = useState(false);
  const { loginState, setLoginState } = useAuth();
  const silentRefresh = () => {
    return axiosBaseURL.post("/api/v1/user/token/refresh/");
  };

  useQuery(["refresh"], silentRefresh, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 2,
    refetchInterval: refreshStop ? false : 30 * 60 * 1000, // 30분 인 상황
    refetchIntervalInBackground: true,
    onError: () => {
      setRefreshStop(true);
      setLoginState({
        ...loginState,
        accessToken: "",
      });
    },
    onSuccess: (data) => {
      console.log("refresh token");
      const token = data?.data?.access_token;
      // access 토큰을 받아와서 새로 저장~~~
      if (token)
        setLoginState({
          ...loginState,
          accessToken: token,
        });
    },
  });
};
