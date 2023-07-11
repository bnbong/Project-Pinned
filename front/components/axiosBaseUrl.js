import axios from "axios";
import toast from "react-hot-toast";

const getNewAccessToken = async () => {
  const {
    data: { access },
  } = await axiosBaseURL.post("api/v1/user/token/refresh/");

  localStorage.setItem("access_token", access);
};

const axiosBaseURL = axios.create({
  baseURL: "http://localhost/", // 프로덕션 이미지 빌드 시 실제 URL로 변경
  withCredentials: true,
});

axiosBaseURL.interceptors.request.use(
  (config) => {
    console.log(config.url);
    // 모든 Request Header에 Access토큰을 넣어주는 역할
    if (!config.headers["Authorization"]) {
      config.headers["Authorization"] = `Bearer ${
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null
      }`;
      config.headers["Content-Type"] = "application/json";
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
    console.log("조건문 실행전");
    if (error?.response?.status === 401 && !prevRequest?.sent) {
      console.log("뭐지");
      getNewAccessToken().catch((err) => {
        toast.error("다시 로그인 해주세요!");
      });
      prevRequest.sent = true;
      prevRequest.headers["Authorization"] = `Bearer ${localStorage.getItem(
        "access_token"
      )}}`;
    }
    return Promise.reject(error);
  }
);

export default axiosBaseURL;
