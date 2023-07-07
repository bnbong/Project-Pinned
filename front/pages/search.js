import { AuthContext } from "@/contexts/AuthContext";
import Link from "next/link";
import { useContext } from "react";
import withAuth from "@/HOC/withAuth";

export default withAuth(function SearchPage() {
  const { loginState } = useContext(AuthContext);
  const id = 1;
  const userId = "최수용";
  const path = "";
  return (
    <div>
      <h4>Search Page</h4>
      <Link href={userId === id ? "/mypage" : `/user/${userId}`}>
        클릭 = User 이동 로직
      </Link>
    </div>
  );
});
