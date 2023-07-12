import axios from "axios";
import toast from "react-hot-toast";
import mem from "mem";

/**
 * refresh api 요청이 중복되서 서버에 전송되면 DB에 저장된 refresh 토큰과 다른 토큰을 클라이언트가
 * 가지게 될 수 있다. 따라서 refresh api 를 1000 타임동안 memoization하여 이 시간동안 추가적으로 요청되는
 * refresh api를 재사용한다. refresh 응답이 오면은 memoization된 api를 기다리던 요청들은 동일한 access token과 refresh token으로
 * 기존 api를 재요청 보낼 수 있다.
 *
 */
const getNewAccessToken = mem(
  async () => {
    try {
      const {
        data: { access },
      } = await axiosBaseURL.post("api/v1/user/token/refresh/");
      localStorage.setItem("access_token", access);
      return access;
    } catch (err) {
      console.log("get Access_token error");
      localStorage.removeItem("access_token");
    }
  },
  { maxAge: 1000 }
);

const axiosBaseURL = axios.create({
  baseURL: "http://localhost:8000/", // 프로덕션 이미지 빌드 시 실제 URL로 변경
  withCredentials: true,
});

const accessToken =
  typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

axiosBaseURL.interceptors.request.use(
  (config) => {
    console.log("requeset interceptor", config.url);
    // 모든 Request Header에 Access토큰을 넣어주는 역할
    if (!config.headers["Authorization"] && accessToken !== "" && accessToken) {
      //메인 피드 동적으로 변경시 변경 필요
      if (config.url === "api/v1/post/feed") {
        config.headers["Authorization"] = "";
        config.headers["Content-Type"] = "application/json";
      } else {
        console.log("request interceptor 동작");
        config.headers["Authorization"] = `Bearer ${accessToken}`;
        config.headers["Content-Type"] = "application/json";
      }
    }
    //login & signup 페이지에선 access_token을 header에서 없앤다.
    if (
      config.url === "api/v1/user/login/" ||
      config.url === "api/v1/user/register/"
    ) {
      config.headers["Authorization"] = "";
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosBaseURL.interceptors.response.use(
  (response) => response,
  async (error) => {
    const prevRequest = error?.config;
    console.log("error response interceptor", accessToken);

    if (error?.response?.status === 401 && !prevRequest?.sent) {
      const accessToken = await getNewAccessToken().catch((err) => {
        toast.error("다시 로그인 해주세요!");
      });
      prevRequest.sent = true;
      prevRequest.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    if (error?.response?.status >= 500) {
      toast.error("서버 에러가 발생했습니다. 로그인을 다시 해주세요!");
    }
    return Promise.reject(error);
  }
);

export default axiosBaseURL;
