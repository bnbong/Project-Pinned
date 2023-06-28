import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";

export default function NavBar() {
  const MENU_LIST = [
    { text: "메인", href: "/" },
    { text: "지도", href: "/map" },
    { text: "포스트작성", href: "/post" },
    { text: "검색", href: "/search" },
    { text: "마이페이지", href: "/mypage" },
  ];
  return (
    <>
      <Head>
        <title>Pinned</title>
      </Head>
      <nav className="bg-gray-800 p-3 flex justify-center">
        <ul className="flex">
          {MENU_LIST.map((menu, index) => (
            <Link key={index} href={menu.href}>
              <li className="text-gray-300 p-7" key={index}>
                {menu.text}
              </li>
            </Link>
          ))}
        </ul>
      </nav>
    </>
  );
}
