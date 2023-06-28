import KakaoMap from "@/components/KakaoMap";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h4>메인페이지</h4>
      <head>
        <Link legacyBehavior href="/map">
          <a>map</a>
        </Link>
      </head>
    </div>
  );
}
