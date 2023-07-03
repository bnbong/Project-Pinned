import axios from "axios";

const axiosBaseURL = axios.create({
  baseURL: "http://localhost:8000/",
});

export default axiosBaseURL;
