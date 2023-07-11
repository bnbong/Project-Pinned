import { AuthContext } from "@/contexts/AuthContext";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import EditProfileModal from "@/components/modal";
import NewPostLayout from "@/components/PostLayout";
import withAuth from "@/HOC/withAuth";
import axiosBaseURL from "@/components/axiosBaseUrl";
import { data } from "autoprefixer";

const MyPage = withAuth(() => {
  const router = useRouter();

  // loginState = 유저의 데이터
  const { loginState, setLoginState } = useContext(AuthContext);
  const user = loginState.user;

  //edit 하는 state & 함수
  const [edit, setEdit] = useState(false);
  const openEdit = () => setEdit(true);
  const closeEdit = () => setEdit(false);

  //user_Id, user_name, follower, following 관리
  const [userID, setUserID] = useState();
  const [userName, setUserName] = useState(user?.username);
  const [follower, setFollower] = useState(user?.followers);
  const [following, setFollowing] = useState(user?.followings);
  const [postNumber, setPostNumber] = useState(0);
  const [response, setResponse] = useState([]);
  //img 파일 관리하는 state
  const [img, setImg] = useState(
    user?.profile_image.replace(
      `${process.env.NEXT_PUBLIC_API_URL}`,
      `${process.env.NEXT_PUBLIC_API_URL}/api`
    ) || "https://via.placeholder.com/150"
  );
  //post 관리하는 state

  const [posts, setPosts] = useState([]);

  // const dummyData = [
  //   {
  //     profileImage: "profile1.jpg",
  //     username: "Username1",
  //     postImage: "https://via.placeholder.com/150",
  //     likes: 999,
  //     description: "Post Description 1...",
  //   },
  //   {
  //     profileImage: "profile2.jpg",
  //     username: "Username2",
  //     postImage: "https://via.placeholder.com/150",
  //     likes: 500,
  //     description: "Post Description 2...",
  //   },
  //   {
  //     profileImage: "profile1.jpg",
  //     username: "Username1",
  //     postImage: "https://via.placeholder.com/150",
  //     likes: 999,
  //     description: "Post Description 1...",
  //   },
  //   {
  //     profileImage: "profile1.jpg",
  //     username: "Username1",
  //     postImage: "https://via.placeholder.com/150",
  //     likes: 999,
  //     description: "Post Description 1...",
  //   },
  //   {
  //     profileImage: "profile1.jpg",
  //     username: "Username1",
  //     postImage: "https://via.placeholder.com/150",
  //     likes: 999,
  //     description: "Post Description 1...",
  //   },
  //   {
  //     profileImage: "profile1.jpg",
  //     username: "Username1",
  //     postImage: "https://via.placeholder.com/150",
  //     likes: 999,
  //     description: "Post Description 1...",
  //   },
  //   {
  //     profileImage: "profile1.jpg",
  //     username: "Username1",
  //     postImage: "https://via.placeholder.com/150",
  //     likes: 999,
  //     description: "Post Description 1...",
  //   },
  // ];
  const fetchUsers = async () => {
    try {
      const res = await axiosBaseURL.get(`api/v1/user/mypage/`);
      // console.log("여기는 res!");
      // console.log(res.data);
      // console.log(res.data.user_id);
      setUserName(res.data.username);
      setFollower(res.data.followers);
      setFollowing(res.data.followings);
      // setPosts(response.data.user_posts);
      // setPostNumber(posts.length);
      return res.data.user_id;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPosts = async (userID) => {
    console.log(userID);
    const response = await axiosBaseURL
      .get(`api/v1/post/posts/${userID}/`)
      .then((res) => {
        setResponse(res.data.user_posts);
        setUserID(userID);
      })
      .catch((err) => {
        console.log(err);
      });
    // console.log(response);

    return response;
  };

  //게시물 로딩
  useEffect(() => {
    fetchUsers().then((userID) => fetchPosts(userID));
  }, []);

  useEffect(() => {
    setPostNumber(response.length);
  }, [response]);

  //프로필 fetch
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/${userID}/profile/`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${loginState.accessToken}`,
  //           },
  //         }
  //       );
  //       console.log("프로필 fetch = " + response.data.profile_image);
  //       setUserName(response.data.username);
  //       setImg(response.data.profile_image);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   if (user) {
  //     fetchUser();
  //   }
  // }, [user, userID, loginState]);

  useEffect(() => {
    setImg(user?.profile_image || "https://via.placeholder.com/150");
  }, [user?.profile_image]);
  console.log(response.map((post) => console.log(post.username)));

  return (
    <div className="p-5 bg-neutral-50">
      {/* {console.log(user)}
      {console.log(userID)}
      {console.log(userName)}
      {console.log(posts)}
      {console.log(posts.length)} */}
      <div className="flex flex-col items-center justify-center mb-5 pb-2.5 bg-neutral-50 bg-opacity-100 shadow-md h-28">
        <div className="flex items-center">
          <img
            className="w-12 h-12 rounded-full object-cover mr-5"
            src={img}
            alt="Avatar"
          />
          <h2 className="text-2xl font-bold mb-0">{userName}</h2>
          <button
            onClick={openEdit}
            className={
              "bg-indigo-600 text-white p-1 px-1 py-1 inline-block ml-4 rounded cursor-pointer"
            }
          >
            Edit
          </button>
          <EditProfileModal
            isOpen={edit}
            onClose={closeEdit}
            userName={userName}
            setUserName={setUserName}
            img={img}
            setImg={setImg}
          />
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
        {response.map((post, index) => (
          <div key={index}>
            {post.username}
            <NewPostLayout
              author={post.username}
              location={post.landmark_name}
              title={post.post_title}
              content={post.post_content}
            />
          </div>
        ))}
        {/* <PostLayout
          key={index}
          profileImage={post.profileImage}
          username={post.username}
          postImage={post.postImage}
          likes={post.likes}
          description={post.description}
        /> */}
      </div>
    </div>
  );
});
//withAuth 벗겨놓음
export default MyPage;
