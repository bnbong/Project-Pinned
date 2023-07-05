import { AuthContext } from "@/contexts/AuthContext";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import EditProfileModal from "@/components/modal";



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
  const [userID, setUserID] = useState(user?.user_id || '');
  const [userName, setUserName] = useState(user?.username);
  const [follower, setFollower] = useState(user?.followers);
  const [following, setFollowing] = useState(user?.followings);
  const [postNumber, setPostNumber] = useState(0);
  //img 파일 관리하는 state
  const [img,setImg] = useState(user?.profile_image || "https://via.placeholder.com/150");

  // const dummyData = [
  //   { title: "Post 1" },
  //   { title: "Post 2" },
  //   { title: "Post 3" },
  //   { title: "Post 4" },
  //   { title: "Post 5" },
  //   { title: "Post 6" },
  //   { title: "Post 7" },
  //   { title: "Post 8" },
  //   { title: "Post 9" },
  //   { title: "Post 10" },
  // ];

  const [posts, setPosts] = useState([]);

  //게시물 로딩
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/post/posts/${userID}/`,
          {
            headers: {
              'Authorization': `Bearer ${loginState.accessToken}`,
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
  useEffect(()=> {
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
        console.log(response.data.profile_image);
        setUserName(response.data.username);
        setImg(response.data.profile_image);
        setLoginState(prevState => ({
            ...prevState,
            user: response.data
        }));
      } catch(error){
        console.log(error);
      }
    }
  }, [userName, img]);

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
            img = {img}
            setImg={setImg}
          ></EditProfileModal>
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
      <div className="grid gap-4 grid-cols-1">
        {posts.map((post) => (
          <div className="text-center" key={post.post_title}>
            <h4>{post.post_title}</h4>
            <div className="flex justify-center">
              <img
                src={post.post_image[0]?.url || "https://via.placeholder.com/150"}
                alt="Post Image"
                className="w-1/4 h-auto"
              />
            </div>
            <p>안녕</p>
            <p>안녕</p>
            <p>안녕</p>
            <div className='flex justify-center'>
              <hr className="w-1/4 border-1 bg-white mb-4"></hr>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPage;
