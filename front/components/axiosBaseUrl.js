import axios from "axios";

const axiosBaseURL = axios.create({
  baseURL: "http://localhost/",
  withCredentials: true,
});

export default axiosBaseURL;
