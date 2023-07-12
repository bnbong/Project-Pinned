import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import axiosBaseURL from "@/components/axiosBaseUrl";
import NewPostLayout from "@/components/PostLayout";
export default function UserPage() {
  //현재 페이지는 다른 유저의 페이지.
  const router = useRouter();
  if (!router.isReady) return null;
  const { id } = router.query;

  const [userID, setUserID] = useState("");
  const [active, setActive] = useState(true);
  const [userName, setUserName] = useState("로딩중...");
  const [follower, setFollower] = useState(0);
  const [following, setFollowing] = useState(0);
  const [postNumber, setPostNumber] = useState(0);

  const [posts, setPosts] = useState([]);
  const [followerCheck, setFollowerCheck] = [];

  const followCheck = async (user_id) => {
    try {
      const res = await axiosBaseURL.get(`api/v1/user/${user_id}/followings`);
      console.log(res.data);
      return res.data.followings_list.some((obj) => obj.user_id === id);
    } catch (error) {
      console.log(error);
    }
  };
  const getMyId = async () => {
    try {
      const res = await axiosBaseURL.get(`api/v1/user/mypage/`);
      return res.data.user_id;
    } catch (error) {
      console.log(error);
    }
  };
  const handleClick = async () => {
    setActive(!active);
    //팔로우 했을때 안했을때 나눠서 적용.
    if (active === true) {
      try {
        console.log("팔로우 시작");
        const res = await axiosBaseURL.post(`api/v1/user/${userID}/follow/`);
        console.log(res);
        //야매로 팔로우 변동 현황 컨트롤
        setFollower(follower + 1);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        console.log("팔로우 해제");
        const res = await axiosBaseURL.post(`api/v1/user/${userID}/unfollow/`);
        console.log(res);
        //야매로 팔로우 변동 현황 컨트롤
        setFollower(follower - 1);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    setUserID(router.query.id);
    getMyId().then((userId) => {
      followCheck(userId).then((isFollowing) => {
        if (isFollowing) {
          setActive(false);
        }
      });
    });
  }, [id]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (userID == "undefined" || userID == null) return;
      console.log(userID);
      try {
        console.log("포스트 불러오기");
        const resPost = await axiosBaseURL.get(`api/v1/post/posts/${userID}/`);
        //유저 Post 설정
        setPosts(resPost.data.user_posts);

        console.log("프로필 불러오기");
        const resProfile = await axiosBaseURL.get(
          `api/v1/user/${userID}/profile/`
        );
        //유저 이름, 팔로워, 팔로잉 설정
        setUserName(resProfile.data.username);
        setFollower(resProfile.data.followers);
        setFollowing(resProfile.data.followings);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPosts();
  }, [userID]);

  useEffect(() => {
    setPostNumber(posts.length);
  }, [posts]);

  return (
    <div className="p-5 bg-neutral-50">
      <div className="flex flex-col items-center justify-center mb-5 pb-2.5 bg-neutral-50 bg-opacity-100 shadow-md">
        <div className="flex items-center">
          <img
            className="w-12 h-12 rounded-full object-cover mr-5"
            src="https://via.placeholder.com/150"
            alt="Avatar"
          />
          <h2 className="text-2xl font-bold mb-0">{userName}</h2>
          <button
            onClick={handleClick}
            className={`${
              active ? "bg-gray-500" : "bg-indigo-600"
            } w-14 text-white p-1 px-1 py-1 inline-block ml-4 rounded cursor-pointer`}
          >
            팔로우
          </button>
        </div>
        <div className="flex list-none p-0 m-0 mt-2">
          <ul className="flex list-none p-0 m-0">
            <li className="mr-5">
              <strong className="block">{postNumber}</strong>
              <span>Posts</span>
            </li>
            <li className="mr-5">
              <strong className="block">{follower}</strong>
              <span>Followers</span>
            </li>
            <li>
              <strong className="block">{following}</strong>
              <span>Following</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="grid-cols-1 items-center justify-center">
        {posts.map((post, index) => (
          <NewPostLayout
            author={post.username}
            location={post.landmark_name}
            title={post.post_title}
            content={post.post_content}
            images={post.post_image}
          />
        ))}
      </div>
    </div>
  );
}
