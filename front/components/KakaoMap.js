import Script from "next/script";
import { Map, MapMarker } from "react-kakao-maps-sdk";

const KAKAO_SDK_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.KAKAO_API_KEY}&autoload=false`;

export default function KakaoMap() {
  return (
    <>
      <Script src={KAKAO_SDK_URL} strategy="beforeInteractive" />
      <Map
        center={{ lat: 33.5563, lng: 126.79581 }}
        style={{ width: "100%", height: "360px" }}
      >
        <MapMarker position={{ lat: 33.55635, lng: 126.795841 }}>
          <div style={{ color: "#000" }}>Hello World!</div>
        </MapMarker>
      </Map>
      <h1 className="text-6xl font-bold underline">Hello world!</h1>
    </>
  );
}
