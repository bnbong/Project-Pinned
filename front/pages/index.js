import Link from 'next/link';
import axios from 'axios';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { getToken, getMessaging } from 'firebase/messaging';
import { messaging } from '@/components/firebase';
import NewPostLayout from '@/components/PostLayout';
import axiosBaseURL from '@/components/axiosBaseUrl';
import { useInfiniteQuery } from 'react-query';
import { useObserver } from '@/hook/useObserver';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Toaster } from 'react-hot-toast';
import SkeletonCard from '@/components/SkeletonPostLayout';

export default function Home() {
  const [isSupported] = useState(
    typeof window !== 'undefined' ? 'Notification' in window : 0
  );
  const [, setBrowserNotification] = useState(
    typeof window !== 'undefined'
      ? 'Notification' in window && Notification.permission === 'granted'
      : 0
  );

  //page offset
  const OFFSET = 5;
  const bottom = useRef(null);
  const { loginState, setLoginState } = useContext(AuthContext);

  // 유저 검색
  async function searchUser(username, token) {
    const response = await axiosBaseURL.get('api/v1/user/search/', {
      params: {
        username: username,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  //유저 삭제
  async function deleteUser(userId, token) {
    const response = await axiosBaseURL.delete(
      `api/v1/user/${user_id}/withdrawal/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  const requestPermission = async () => {
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
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
      alert('알림이 지원되지 않는 브라우저입니다.');
      return null;
    } else if (Notification.permission !== 'granted') {
      alert('브라우저 알림 설정을 확인해주세요.');
      return null;
    }
  };

  //post 가져오기
  const getPost = async (param = OFFSET) => {
    const res = await axiosBaseURL
      .get(`api/v1/post/feed`, {
        params: {
          limit: OFFSET,
          offset: param,
        },
      })
      .then((res) => {
        return res;
      })
      .catch((err) => console.log(err));
    return res;
  };

  const {
    data, //data.pages를 갖고 있는 배열
    error, // error 객체
    fetchNextPage, // 다음 페이지를 불러오는 함수
    hasNextPage, // 다음 페이지가 있는지 여부, Boolean
    isFetching, // 첫 페이지 fetching 여부, Boolean, 잘 안쓰인다
    isFetchingNextPage, // 추가 페이지 fetching 여부, Boolean
    status, // loading, error, success 중 하나의 상태, string
  } = useInfiniteQuery(['posts'], getPost, {
    getNextPageParam: (lastPage) => {
      const count = 1;

      if (count === lastPage.config.params.limit) return false;

      return OFFSET + 5;
    },
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
    <div className='p-5 bg-neutral-50 mb-20'>
      <div className='flex flex-col items-center justify-center mb-5 pb-2.5 bg-neutral-50 bg-opacity-100 shadow-md h-28'>
        <div className='flex justify-between mx-auto'>
          <div className='flex'>
            <h2 className='text-2xl font-bold m-auto mr-10'>
              이런 장소는 어떠세요?
            </h2>
          </div>
          <div className='ml-10'>
            <div className='flex'>
              <div className='bg-indigo-600 font-semibold rounded-xl p-1 m-1 drop-shadow-md'>
                <h2 className='text-white'>문화의거리</h2>
              </div>
              <div className='bg-indigo-600 font-semibold rounded-xl p-1 m-1 drop-shadow-md'>
                <h2 className='text-white'>병천순대골목</h2>
              </div>
              <div className='bg-indigo-600 font-semibold rounded-xl p-1 m-1 drop-shadow-md'>
                <h2 className='text-gray-100'>하동숲길</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      {status === 'loading' && <SkeletonCard />}
      {status === 'error' && <p>{error.message}</p>}
      {status === 'success' &&
        data &&
        data.pages.map((group, index) => (
          // pages들이 페이지 숫자에 맞춰서 들어있기 때문에
          // group을 map으로 한번 더 돌리는 이중 배열 구조이다.
          // get api를 통해 받은 res를 컴포넌트에 props로 전달해줘서 랜더링해야할거 같음.
          <div key={index}>
            {group.data.trending_posts.map((post, index) => (
              <div
                key={index}
                className='grid-cols-1 items-center justify-center'
              >
                <NewPostLayout
                  postId={post.post_id}
                  author={post.username}
                  location={post.landmark_name}
                  title={post.post_title}
                  content={post.post_content.replace(/(<([^>]+)>)/gi, '')}
                  images={post.post_image}
                />
              </div>
            ))}
          </div>
        ))}
      <div ref={bottom} />
      {isFetchingNextPage && <p>continue loading</p>}
      {/* <button onClick={() => fetchNextPage()}>더 불러오기</button>
      <button onClick={() => requestPermission}>FCM</button> */}
    </div>
  );
}
