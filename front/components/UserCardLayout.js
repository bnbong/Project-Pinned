import React from "react";

export default function UserCard({ userId, userName, userImg, userEmail }) {
  return (
    <div
      key={userId}
      className="max-w-md mb-5 mx-auto  bg-white rounded-xl drop-shadow-md overflow-hidden md:max-w-l"
    >
      <div className="md:flex">
        <div className="md:flex-shrink-0">
          <img
            className="my-1 ml-1 rounded-full h-28 w-full  md:w-28"
            src={userImg}
            alt={userName}
          />
        </div>
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            {userName}
          </div>
          <p className="mt-2 text-gray-500">{userEmail}</p>
        </div>
      </div>
    </div>
  );
}
