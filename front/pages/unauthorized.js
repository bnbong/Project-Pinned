import { useRouter } from "next/router";

export default function Unauthorized() {
  const router = useRouter();

  const goBack = () => router.back();

  return (
    <section>
      <h1>권한없음</h1>
      <br />
      <p>로그인이 필요합니다..</p>
      <div className="flexGrow">
        <button onClick={goBack}>뒤로가기</button>
      </div>
    </section>
  );
}
