import { AuthContext } from "@/contexts/AuthContext";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

const MyPage = () => {
  const { user } = useContext(AuthContext);
  const [userID, setUserID] = useState(user.id);
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
    <div>
      <h4>My Page</h4>
    </div>
  );
};

export default MyPage;
