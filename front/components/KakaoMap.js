import { Map, MapMarker } from "react-kakao-maps-sdk";
import { useState, useEffect, memo } from "react";
import axiosBaseURL from "@/components/axiosBaseUrl";

export default memo(function KakaoMap({ searchKeyword }) {
  const [info, setInfo] = useState();
  const [markers, setMarkers] = useState([]);
  const [map, setMap] = useState();
  const [landmarks, setLandmarks] = useState([]);

  const location = searchKeyword || "판교역 신분당선";

  useEffect(() => {
    // Load all landmarks from the server
    axiosBaseURL.get('api/v1/landmark/landmarks')
      .then((response) => {
        setLandmarks(response.data);
      });
  }, []);

  useEffect(() => {
    if (!map) return;
    // Place search and move the map to the searched place
    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(`${location}`, (data, status, _pagination) => {
      if (status === kakao.maps.services.Status.OK) {
        const bounds = new kakao.maps.LatLngBounds();
        for (let i = 0; i < data.length; i++) {
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }
        map.setBounds(bounds);
      }
    });
  }, [map, location]);

  useEffect(() => {
    if (!map || !landmarks) return;

    kakao.maps.event.addListener(map, 'idle', function() {
      const bounds = map.getBounds();
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();
  
      // 현재 보여지고 있는 지도 범위에 있는 랜드마크만 필터링합니다.
      const visibleLandmarks = landmarks.filter(landmark => {
        const lat = parseFloat(landmark.landmark_longitude);
        const lng = parseFloat(landmark.landmark_latitute);
        return (sw.getLat() <= lat && lat <= ne.getLat()) && (sw.getLng() <= lng && lng <= ne.getLng());
      });
  
      // 필터링한 랜드마크에 대해 마커를 생성합니다.
      setMarkers(visibleLandmarks.map(landmark => ({
        position: {
          lat: parseFloat(landmark.landmark_longitude),
          lng: parseFloat(landmark.landmark_latitute),
        },
        content: landmark.landmark_name,
      })));
    });
  }, [map, landmarks]);

  return (
    <Map // 로드뷰를 표시할 Container
      center={{
        lat: 37.566826,
        lng: 126.9786567,
      }}
      style={{
        width: "100%",
        height: "930px",
      }}
      level={3}
      onCreate={setMap}
    >
      {markers.map((marker) => (
        <MapMarker
          key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
          position={marker.position}
          onClick={() => setInfo(marker)}
        >
          {info && info.content === marker.content && (
            <div style={{ color: "#000" }}>{marker.content}</div>
          )}
        </MapMarker>
      ))}
    </Map>
  );
});
