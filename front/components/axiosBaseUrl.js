import axios from "axios";

const axiosBaseURL = axios.create({
  baseURL: "http://localhost/",
});

export default axiosBaseURL;
