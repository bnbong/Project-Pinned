import axios from "axios";
import toast from "react-hot-toast";

const axiosBaseURL = axios.create({
  baseURL: "http://localhost:8000/", // 프로덕션 이미지 빌드 시 실제 URL로 변경
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
  (res) => res.data,
  (err) => {
    const { status } = err.response;
    if (status >= 500) {
      toast.error(
        "서버 오류가 발생했어요." + "\n" + "잠시 후에 다시 시도해보세요."
      );
    }
  }
);
export default axiosBaseURL;
