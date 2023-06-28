import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";

export default function NavBar() {
  const MENU_LIST = [
    { text: "메인", href: "/" },
    { text: "지도", href: "/map" },
    { text: "검색", href: "/search" },
    { text: "마이페이지", href: "/mypage" },
    { text: "포스트작성", href: "/post" },
  ];
  return (
    <Head>
      <title>Pinned</title>
      <nav className="">
        <h4 className="black">Nav Bar</h4>
        <ul>
          {MENU_LIST.map((menu, index) => (
            <Link href={menu.href}>
              <li key={index}>{menu.text}</li>
            </Link>
          ))}
        </ul>
      </nav>
    </Head>
  );
}
