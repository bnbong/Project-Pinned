import { AuthContext } from "@/contexts/AuthContext";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {useParams} from "react"
import { useRouter } from 'next/router';

const UserPage = () => {
  const router =useRouter();
  const { user } = useContext(AuthContext);
  let {id} = router.query;
  const [userID, setUserID] = useState(user.id);
  const [active, setActive] = useState(false);
  const dummyData = [
    { title: "Post 1" },
    { title: "Post 2" },
    { title: "Post 3" },
    { title: "Post 4" },
    { title: "Post 5" },
    { title: "Post 6" },
    { title: "Post 7" },
    { title: "Post 8" },
    { title: "Post 9" },
    { title: "Post 10" },
  ];
  const [posts, setPosts] = useState(dummyData);
  const handleClick = () => {
    setActive(!active);
  }
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`api/v1/post/${userID}`);
        setPosts(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPosts();
  }, [userID]);

  return (
    <div className='p-5 bg-neutral-50'>
      <div className='flex flex-col items-center justify-center mb-5 bg-neutral-50 bg-opacity-100'>
        <div className='flex items-center'>
          <img
            className="w-12 h-12 rounded-full object-cover mr-5"
            src="https://via.placeholder.com/150"
            alt="Avatar"
          />
          <h2 className="text-2xl font-bold mb-0">{id}</h2>
          <button onClick={handleClick}
            className={`${active ? 'bg-black' : 'bg-green-500'} text-white p-1 px-1 py-1 inline-block ml-4 rounded cursor-pointer`}
          >팔로우</button>
        </div>
        <div className='flex list-none p-0 m-0 mt-2'>
          <ul className="flex list-none p-0 m-0">
            <li className="mr-5">
              <strong className="block">150</strong>
              <span>Posts</span>
            </li>
            <li className="mr-5">
              <strong className="block">300</strong>
              <span>Followers</span>
            </li>
            <li>
              <strong className="block">200</strong>
              <span>Following</span>
            </li>
          </ul>
        </div>
      </div>
      <hr className='border-2 bg-white mb-4'></hr>
      <div className="grid gap-4 grid-cols-1">
        {posts.map((post) => (
        <div className='text-center' >
          <h4 >{post.title}</h4>
          <div className= 'flex justify-center' key={post.title}>
            <img src="https://via.placeholder.com/150" alt="Post Image" className="w-1/4 h-auto" />
          </div>
          <p>안녕</p>
          <p>안녕</p>
          <p>안녕</p>
          <hr className='border-2 bg-white mb-4'></hr>
        </div>
        ))}
      </div>
    </div>
    )
  }
export default UserPage;