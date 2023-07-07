import { AuthContext } from "@/contexts/AuthContext";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import EditProfileModal from "@/components/modal";
import PostLayout from '@/components/postLayout';
import NewPostLayout from '@/components/NewPostLayout';

import withAuth from "@/HOC/withAuth";

const MyPage = () => {
  const router = useRouter();

  // loginState = 유저의 데이터
  const { loginState, setLoginState } = useContext(AuthContext);
  const user = loginState.user;

  //edit 하는 state & 함수
  const [edit, setEdit] = useState(false);
  const openEdit = () => setEdit(true);
  const closeEdit = () => setEdit(false);

  //user_Id, user_name, follower, following 관리
  const [userID, setUserID] = useState(user?.user_id || "");
  const [userName, setUserName] = useState(user?.username);
  const [follower, setFollower] = useState(user?.followers);
  const [following, setFollowing] = useState(user?.followings);
  const [postNumber, setPostNumber] = useState(0);
  //img 파일 관리하는 state
  const [img,setImg] = useState(user?.profile_image.replace('localhost:3000', 'localhost:8000') || "https://via.placeholder.com/150");
  //post 관리하는 state

  const [posts, setPosts] = useState([]);

  const dummyData = [
    {
      profileImage: "profile1.jpg",
      username: "Username1",
      postImage: "https://via.placeholder.com/150",
      likes: 999,
      description: "Post Description 1..."
    },
    {
      profileImage: "profile2.jpg",
      username: "Username2",
      postImage: "https://via.placeholder.com/150",
      likes: 500,
      description: "Post Description 2..."
    },
    {
      profileImage: "profile1.jpg",
      username: "Username1",
      postImage: "https://via.placeholder.com/150",
      likes: 999,
      description: "Post Description 1..."
    },{
      profileImage: "profile1.jpg",
      username: "Username1",
      postImage: "https://via.placeholder.com/150",
      likes: 999,
      description: "Post Description 1..."
    },{
      profileImage: "profile1.jpg",
      username: "Username1",
      postImage: "https://via.placeholder.com/150",
      likes: 999,
      description: "Post Description 1..."
    },{
      profileImage: "profile1.jpg",
      username: "Username1",
      postImage: "https://via.placeholder.com/150",
      likes: 999,
      description: "Post Description 1..."
    },{
      profileImage: "profile1.jpg",
      username: "Username1",
      postImage: "https://via.placeholder.com/150",
      likes: 999,
      description: "Post Description 1..."
    },
  ];

  

  //게시물 로딩
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/post/posts/${userID}/`,
          {
            headers: {
              Authorization: `Bearer ${loginState.accessToken}`,
            },
          }
        );
        setPosts(response.data.user_posts);
        setPostNumber(posts.length);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPosts();
  }, [userID]);

  //프로필 fetch
  useEffect(() => {
    const fetchUser = async () => {
        try{
            const response = await axios.get(
                `http://localhost:8000/api/v1/user/${userID}/profile/`,
                {
                headers: {
                    'Authorization': `Bearer ${loginState.accessToken}`,
                },
                }
            );
            console.log("프로필 fetch = "+ response.data.profile_image);
            setUserName(response.data.username);
            setImg(response.data.profile_image);
        } catch(error){
            console.log(error);
        }
    }

    if(user){
        fetchUser();
    }
  }, [user, userID, loginState]);

  useEffect(()=> {
    setImg(user?.profile_image || "https://via.placeholder.com/150");
}, [user?.profile_image]);

  return (
    <div className="p-5 bg-neutral-50">
      {console.log(user)}
      {console.log(userID)}
      {console.log(userName)}
      {console.log(posts)}
      {console.log(posts.length)}
      <div className="flex flex-col items-center justify-center mb-5 pb-2.5 bg-neutral-50 bg-opacity-100 shadow-md">
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
        {dummyData.map((post,index) => (
          <NewPostLayout
            key={index}
            author={post.username}
            location="보정동"
            title="이것은 게시글입니다"
            content={"This is Fucking first description"}
          />
          // <PostLayout
          //   key={index}
          //   profileImage= {post.profileImage}
          //   username= {post.username} 
          //   postImage={post.postImage} 
          //   likes={post.likes} 
          //   description={post.description}
          // />
        ))}
      </div>
    </div>
  );
};

export default withAuth(MyPage);
