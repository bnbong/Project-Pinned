import Link from "next/link";
import axios from "axios";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { getToken, getMessaging } from "firebase/messaging";
import { messaging } from "@/components/firebase";
import NewPostLayout from "@/components/PostLayout";
import axiosBaseURL from "@/components/axiosBaseUrl";
import { useInfiniteQuery } from "react-query";
import { useObserver } from "@/hook/useObserver";
import { LazyLoadImage } from "react-lazy-load-image-component";

export default function Home() {
  const [isSupported] = useState(
    typeof window !== "undefined" ? "Notification" in window : 0
  );
  const [, setBrowserNotification] = useState(
    typeof window !== "undefined"
      ? "Notification" in window && Notification.permission === "granted"
      : 0
  );

  //page offset
  const OFFSET = 1;
  const bottom = useRef(null);
  const { loginState, setLoginState } = useContext(AuthContext);

  // 유저 등록
  async function registerUser(username, email, password) {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/register/`,
      {
        username: username,
        email: email,
        password: password,
      }
    );
    return response.data;
  }
  // JWT 토큰 발급 받기
  async function loginUser(email, password) {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/login/`,
      {
        email: email,
        password: password,
      }
    );
    return response.data;
  }

  // JWT 토큰 검증
  async function verifyToken(token) {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/token/verify/`,
      {
        token: token,
      }
    );
    return response.data;
  }

  // JWT 토큰 새로 발급받기
  async function refreshToken(refresh) {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/token/refresh/`,
      {
        refresh: refresh,
      }
    );
    return response.data;
  }

  // 유저 프로필 가져오기
  async function getUserProfile(userId, token) {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/${userId}/profile/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  // 유저 검색
  async function searchUser(username, token) {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/search/`,
      {
        params: {
          username: username,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  //유저 삭제
  async function deleteUser(userId, token) {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/${user_id}/withdrawal/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
  async function ExampleUsage() {
    try {
      //유저 등록
      // const registerResult = await registerUser('newUsername1', 'Test@example.com', 'password');
      // console.log(registerResult);

      // 로그인 요청
      const loginResult = await loginUser("user1@test.com", "password123");
      console.log(loginResult);

      // JWT 검증
      const verifyResult = await verifyToken(loginResult.access_token);
      console.log(verifyResult);

      let userId = loginResult.user.user_id;
      let userName = loginResult.user.username;

      console.log(userId);
      console.log(userName);
      // JWT 새로 발급
      // const refreshResult = await refreshToken(loginResult.refresh_token);
      // console.log(refreshResult);

      // 유저 프로필 조회 => 마이페이지에서 사용해야 할듯
      const userProfile = await getUserProfile(
        userId,
        loginResult.access_token
      );
      console.log(userProfile);

      setLoginState({
        isLoggedIn: true,
        user: loginResult.user,
        accessToken: null,
        refreshToken: null,
      });
      console.log("loginState.user : " + loginState.user);
      console.log("loginState.accessToken" + loginState.accessToken);
      //refreshResult.access

      // // 유저 검색
      // const searchResult = await searchUser(userName, loginResult.access_token);
      // console.log(searchResult);

      // const deleteResult = await deleteUser(loginResult.user.user_id, loginResult.access_token);
      // console.log(deleteResult);
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  }
  const requestPermission = async () => {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      setBrowserNotification(true);

      return getFCMToken();
    }
  };
  // const getFCMToken = async () => {
  //   const token = await getToken(messaging, { vapidKey: process.env.vapidKey });
  //   console.log(token);
  // };
  const getFCMToken = async () => {
    if (!isSupported) {
      alert("알림이 지원되지 않는 브라우저입니다.");
      return null;
    } else if (Notification.permission !== "granted") {
      alert("브라우저 알림 설정을 확인해주세요.");
      return null;
    }
  };

  useEffect(() => {
    ExampleUsage();
  }, []);

  // useEffect(() => {
  //   // requestPermission();
  //   getToken(messaging, {
  //     vapidKey: process.env.NEXT_PUBLIC_vapid_key,
  //   })
  //     .then((currentToken) => {
  //       if (currentToken) {
  //         // Send the token to your server and update the UI if necessary
  //         // ...
  //         console.log(currentToken);
  //       } else {
  //         // Show permission request UI
  //         console.log(
  //           "No registration token available. Request permission to generate one."
  //         );
  //         // ...
  //       }
  //     })
  //     .catch((err) => {
  //       console.log("An error occurred while retrieving token. ", err);
  //       // ...
  //     });
  // }, []);

  const dummyData = [
    {
      profileImage: "profile1.jpg",
      username: "Username1",
      postImage: "https://via.placeholder.com/150",
      likes: 999,
      description: "Post Description 1...",
    },
    {
      profileImage: "profile2.jpg",
      username: "Username2",
      postImage: "https://via.placeholder.com/150",
      likes: 500,
      description: "Post Description 2...",
    },
    {
      profileImage: "profile1.jpg",
      username: "Username1",
      postImage: "https://via.placeholder.com/150",
      likes: 999,
      description: "Post Description 1...",
    },
    {
      profileImage: "profile1.jpg",
      username: "Username1",
      postImage: "https://via.placeholder.com/150",
      likes: 999,
      description: "Post Description 1...",
    },
    {
      profileImage: "profile1.jpg",
      username: "Username1",
      postImage: "https://via.placeholder.com/150",
      likes: 999,
      description: "Post Description 1...",
    },
    {
      profileImage: "profile1.jpg",
      username: "Username1",
      postImage: "https://via.placeholder.com/150",
      likes: 999,
      description: "Post Description 1...",
    },
    {
      profileImage: "profile1.jpg",
      username: "Username1",
      postImage: "https://via.placeholder.com/150",
      likes: 999,
      description: "Post Description 1...",
    },
  ];

  //post 가져오기
  const getPost = (param = OFFSET) => {
    axiosBaseURL
      .get(`api/v1/post/${param}`)
      .then((res) => {
        console.log(res);
        return res;
      })
      .catch((err) => console.log(err));
  };

  const {
    data, //data.pages를 갖고 있는 배열
    error, // error 객체
    fetchNextPage, // 다음 페이지를 불러오는 함수
    hasNextPage, // 다음 페이지가 있는지 여부, Boolean
    isFetching, // 첫 페이지 fetching 여부, Boolean, 잘 안쓰인다
    isFetchingNextPage, // 추가 페이지 fetching 여부, Boolean
    status, // loading, error, success 중 하나의 상태, string
  } = useInfiniteQuery(["post"], getPost, {
    getNextPageParam: (lastPage, page) => {},
  });

  // useObserver로 넘겨줄 callback, entry로 넘어오는 HTMLElement가
  // isIntersecting이라면 무한 스크롤을 위한 fetchNextPage가 실행될 것이다.
  const onIntersect = ([entry]) => entry.isIntersecting && fetchNextPage();

  // useObserver로 bottom ref와 onIntersect를 넘겨 주자.
  useObserver({
    target: bottom,
    onIntersect,
  });

  return (
    <div className="p-5 bg-neutral-50">
      <div className="flex flex-col items-center justify-center mb-5 pb-2.5 bg-neutral-50 bg-opacity-100 shadow-md h-28">
        <div className="flex justify-between mx-auto">
          <div className="flex">
            <h2 className="text-2xl font-bold m-auto mr-10">
              이런 장소는 어떠세요?
            </h2>
          </div>
          <div className="ml-10">
            <div className="flex">
              <div className="bg-indigo-600 font-semibold rounded-xl p-1 m-1 drop-shadow-md">
                <h2 className="text-white">보정동</h2>
              </div>
              <div className="bg-indigo-600 font-semibold rounded-xl p-1 m-1 drop-shadow-md">
                <h2 className="text-white">행궁동</h2>
              </div>
              <div className="bg-indigo-600 font-semibold rounded-xl p-1 m-1 drop-shadow-md">
                <h2 className="text-gray-100">판교</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      {status === "loading" && <p>loading</p>}
      {status === "error" && <p>{error.message}</p>}
      {status === "success" &&
        data &&
        data.pages.map((group, index) => (
          // pages들이 페이지 숫자에 맞춰서 들어있기 때문에
          // group을 map으로 한번 더 돌리는 이중 배열 구조이다.
          // get api를 통해 받은 res를 컴포넌트에 props로 전달해줘서 랜더링해야할거 같음.
          <div key={index}>
            {group.results.map((post) => (
              <p key={post.post_id}>post 컴포넌트가 들어가야한다.</p>
            ))}
          </div>
        ))}
      <div ref={bottom} />
      {isFetchingNextPage && <p>continue loading</p>}
      <button onClick={() => fetchNextPage()}>더 불러오기</button>
      <button onClick={requestPermission}>FCM</button>
      <div className="grid-cols-1 items-center justify-center">
        {dummyData.map((post, index) => (
          <NewPostLayout
            key={index}
            author={post.username}
            location="보정동"
            title="이것은 게시글입니다"
            content={"This is Fucking first description"}
          />
        ))}
      </div>
    </div>
  );
}
