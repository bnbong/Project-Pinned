import Link from "next/link";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { getToken, getMessaging } from "firebase/messaging";
import { messaging } from "@/components/firebase";
import PostLayout from '@/components/PostLayout';

export default function Home() {
  const [isSupported] = useState(
    typeof window !== "undefined" ? "Notification" in window : 0
  );
  const [, setBrowserNotification] = useState(
    typeof window !== "undefined"
      ? "Notification" in window && Notification.permission === "granted"
      : 0
  );

  const { loginState, setLoginState } = useContext(AuthContext);

  // 유저 등록
  async function registerUser(username, email, password) {
    const response = await axios.post(
      "http://localhost:8000/api/v1/user/register/",
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
      "http://localhost:8000/api/v1/user/login/",
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
      "http://localhost:8000/api/v1/user/token/verify/",
      {
        token: token,
      }
    );
    return response.data;
  }

  // JWT 토큰 새로 발급받기
  async function refreshToken(refresh) {
    const response = await axios.post(
      "http://localhost:8000/api/v1/user/token/refresh/",
      {
        refresh: refresh,
      }
    );
    return response.data;
  }

  // 유저 프로필 가져오기
  async function getUserProfile(userId, token) {
    const response = await axios.get(
      `http://localhost:8000/api/v1/user/${userId}/profile/`,
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
      "http://localhost:8000/api/v1/user/search/",
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
      `http://localhost:8000/api/v1/user/${user_id}/withdrawal/`,
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
      const loginResult = await loginUser("test@example.com", "password");
      console.log(loginResult);

      // JWT 검증
      const verifyResult = await verifyToken(loginResult.access_token);
      console.log(verifyResult);

      // JWT 새로 발급
      const refreshResult = await refreshToken(loginResult.refresh_token);
      console.log(refreshResult);
      let userId = loginResult.user.user_id;
      let userName = loginResult.user.username;
      console.log(userId);
      console.log(userName);

      // 유저 프로필 조회 => 마이페이지에서 사용해야 할듯
      const userProfile = await getUserProfile(
        userId,
        loginResult.access_token
      );
      console.log(userProfile);

      setLoginState({
        isLoggedIn: true,
        user: loginResult.user,
        accessToken: refreshResult.access,
        refreshToken: null,
      });

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

  // useEffect(() => {
  //   ExampleUsage();
  // }, []);
  useEffect(() => {
    // requestPermission();
    getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_vapid_key,
    })
      .then((currentToken) => {
        if (currentToken) {
          // Send the token to your server and update the UI if necessary
          // ...
          console.log(currentToken);
        } else {
          // Show permission request UI
          console.log(
            "No registration token available. Request permission to generate one."
          );
          // ...
        }
      })
      .catch((err) => {
        console.log("An error occurred while retrieving token. ", err);
        // ...
      });
  }, []);

  return (
    <div>
      <h4>메인페이지</h4>
      <h4>안녕!</h4>
      <PostLayout 
      profileImage="profile.jpg" 
      username="Username" 
      postImage="https://via.placeholder.com/150" 
      likes={999} 
      description="Post Description..." 
    />
      <button onClick={requestPermission}>FCM</button>
    </div>
  );
}
