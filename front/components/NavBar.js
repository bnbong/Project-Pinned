import { useRouter } from "next/router";

export default function NavBar() {
  const router = useRouter();
  return (
    <nav>
      <Link>마이페이지</Link>
    </nav>
  );
}
