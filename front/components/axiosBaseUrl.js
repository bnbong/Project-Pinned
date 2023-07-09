import axios from "axios";

const axiosBaseURL = axios.create({
  baseURL: `http://localhost:8000/`,
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

export default axiosBaseURL;
