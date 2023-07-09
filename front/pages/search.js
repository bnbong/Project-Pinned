import { AuthContext } from "@/contexts/AuthContext";
import Link from "next/link";
import { useState, useContext, useEffect } from "react";
import withAuth from "@/HOC/withAuth";
import { users } from '@/components/user';
import UserCard from '@/components/UserCardLayout';

export default function SearchPage() {
  const { loginState } = useContext(AuthContext);
  const id = 1;
  const userId = "최수용";
  const path = "";
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = () => {
      // Here you would typically make a request to your server to fetch the user data
      setResults(users.filter(user => user.name.includes(query)));
  }
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
                    className="text-white rounded-full p-2 focus:outline-none w-12 h-12 flex items-center justify-center"
                >
                    🔍
                </button>
            </div>
        </div>
        <h4>Search Page</h4>
        <Link href={userId === id ? "/mypage" : `/user/${userId}`}>
          클릭 = User 이동 로직
        </Link> 
        <div className="mt-10">
                {results.map((user,index) => (
                    <UserCard key={index} userId={user.id} userName={user.name} userImg={user.image} userEmail={user.email}/>
                ))}
        </div>
    </div>
);
}

