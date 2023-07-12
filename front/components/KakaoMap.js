import { Map, MapMarker } from "react-kakao-maps-sdk";
import { useState, useEffect, memo } from "react";
import axiosBaseURL from "@/components/axiosBaseUrl";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import NewPostLayout from "@/components/PostLayout";

export default memo(function KakaoMap({ searchKeyword }) {
  const [info, setInfo] = useState();
  const [markers, setMarkers] = useState([]);
  const [map, setMap] = useState();
  const [landmarks, setLandmarks] = useState([]);
  const router = useRouter();
  const location = searchKeyword || "숭례문";
  const [modal, setModal] = useState(false);
  const [landmarkName, setLandmarkName] = useState("");
  useEffect(() => {
    // Load all landmarks from the server
    axiosBaseURL
      .get("api/v1/landmark/landmarks")
      .then((response) => {
        setLandmarks(response.data);
      })
      .catch((err) => {
        toast.error("랜드마크 불러오기 실패");
      });
  }, []);

  useEffect(() => {
    if (!map) return;
    // Place search and move the map to the searched place
    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(`${location}`, (data, status, _pagination) => {
      if (status === kakao.maps.services.Status.OK) {
        const bounds = new kakao.maps.LatLngBounds();
        for (let i = 0; i < 1; i++) {
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }
        map.setBounds(bounds);
      }
    });
  }, [map, location]);

  useEffect(() => {
    if (!map || !landmarks) return;

    kakao.maps.event.addListener(map, "idle", function () {
      const bounds = map.getBounds();
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();

      // 현재 보여지고 있는 지도 범위에 있는 랜드마크만 필터링합니다.
      const visibleLandmarks = landmarks.filter((landmark) => {
        const lat = parseFloat(landmark.landmark_longitude);
        const lng = parseFloat(landmark.landmark_latitute);
        return (
          sw.getLat() <= lat &&
          lat <= ne.getLat() &&
          sw.getLng() <= lng &&
          lng <= ne.getLng()
        );
      });

      // 필터링한 랜드마크에 대해 마커를 생성합니다.
      setMarkers(
        visibleLandmarks.map((landmark) => ({
          position: {
            lat: parseFloat(landmark.landmark_longitude),
            lng: parseFloat(landmark.landmark_latitute),
          },
          content: landmark.landmark_name,
        }))
      );
    });
  }, [map, landmarks]);

  const getLandmarkPage = async (landmark_id) => {
    try {
      const res = await axiosBaseURL.get(
        `api/v1/landmark/${landmark_id}/posts`
      );
      setInfo(res);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  const getLandmarkId = async (landmark_name) => {
    console.log(landmark_name);
    try {
      const res = await axiosBaseURL.get(
        `api/v1/landmark/search/?landmark_name=${encodeURI(landmark_name)}`
      );
      return res;
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {modal ? (
        <div className="min-h-screen bg-gray-100 mb-20">
          <div className="min-h-screen max-w-3xl mx-auto py-8">
            <div className="min-h-screen bg-white rounded-lg shadow-md p-10">
              <h1 className="text-2xl font-bold mb-4 ml-52">{landmarkName}</h1>
              {info?.data.landmark_posts.length !== 0 ? (
                info?.data.landmark_posts.map((post, index) => (
                  <div
                    key={index}
                    className="grid-cols-1 items-center justify-center"
                  >
                    <NewPostLayout
                      postId={post.post_id}
                      author={post.username}
                      location={post.landmark_name}
                      title={post.post_title}
                      content={post.post_content.replace(/(<([^>]+)>)/gi, "")}
                      images={post.post_image}
                    />
                  </div>
                ))
              ) : (
                <div>아직 작성된 게시글이 없습니다.</div>
              )}
              <button
                onClick={() => setModal(false)}
                className="text-white mt-10 ml-64  bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                페이지 닫기
              </button>
            </div>
          </div>
        </div>
      ) : (
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
              onClick={() => {
                getLandmarkId(marker.content)
                  .then((res) => {
                    getLandmarkPage(res.data.landmarks[0].landmark_id);
                    setLandmarkName(marker.content);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
                setModal(true);
              }}
            ></MapMarker>
          ))}
        </Map>
      )}
    </>
  );
});
