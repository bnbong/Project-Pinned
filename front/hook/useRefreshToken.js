import axiosBaseURL from "@/components/axiosBaseUrl";

const useRefreshToken = () => {
  const refresh = async () => {
    const res = await axiosBaseURL.get("api/v1/user/token/refresh/");
    console.log("success", res);
    localStorage.setItem("access_token");
  };
  return refresh;
};

export default useRefreshToken;
