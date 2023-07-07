import { useContext } from "react";
import { AuthContext } from "./AuthContext";

const useAuth = () => {
  //해당 context의 내용을 반환함.
  return useContext(AuthContext);
};

export default useAuth;
