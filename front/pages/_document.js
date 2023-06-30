/*폰트 import charset, 웹 접근성 관련 태그 설정을 위한 파일*/

import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";
const KAKAO_SDK_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.KAKAO_API_KEY}&libraries=services&autoload=false`;
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
        <Script src={KAKAO_SDK_URL} strategy="beforeInteractive" />
      </body>
    </Html>
  );
}
