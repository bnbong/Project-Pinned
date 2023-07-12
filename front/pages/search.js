import { AuthContext } from "@/contexts/AuthContext";
import Link from "next/link";
import { useState, useContext, useEffect } from "react";
import withAuth from "@/HOC/withAuth";
import { users } from '@/components/user';
import UserCard from '@/components/UserCardLayout';
import axiosBaseURL from '@/components/axiosBaseUrl';

export default function SearchPage() {
const { loginState } = useContext(AuthContext);
// const id = "95f20114-c49a-4c75-9f83-5c9192b74c3d";
const userId = "최수용";
const path = "";
const [query, setQuery] = useState("");
const [results, setResults] = useState([]);

const handleSearch = async () => {
    try{
      console.log("서치 시작");
      const res = await axiosBaseURL.get(`api/v1/user/search`, {
        params : {
          username: query,
        },
      });
      console.log("Setting Results...");
      console.log(res.data.searched_users)
      setResults(res.data.searched_users);
    } catch (error) {
      console.log(error);
    }
  }
  // Here you would typically make a request to your server to fetch the user data
  // setResults(users.filter(user => user.name.includes(query)));
  return (
    <div className="p-10">
      <div className="bg-white flex items-center rounded-full shadow-md">
        <input
          className="rounded-l-full w-full py-4 px-6 text-gray-700 leading-tight focus:outline-none"
          id="search"
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="p-4">
          <button 
            onClick={handleSearch} 
            className="text-white rounded-full p-2 focus:outline-none w-12 h-12 flex items-center justify-center">
          🔍</button>
        </div>
      </div>
      <div className="mt-10">
        {/* <Link href={`/user/${id}`}>
            <UserCard  userId="id" userName="user3" userImg={null} userEmail="ddddddddddd"/>
        </Link> */}
        {results.map((user,index) => (
          <Link key={index} href={`/user/${user.user_id}`}>
            <UserCard  userId={user.user_id} userName={user.username} userImg={user.image} userEmail={user.email}/>
          </Link>
        ))}
      </div>
    </div>
  );
}

