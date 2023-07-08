import React from 'react';

export default function SkeletonUserCard() {
  return (
    <div className="max-w-md mb-5 mx-auto bg-gray-300 rounded-xl shadow-md overflow-hidden md:max-w-l animate-pulse">
        <div className="md:flex">
            <div className="md:flex-shrink-0">
                <div className="my-1 ml-1 rounded-full h-28 w-full md:w-28 bg-gray-400"></div>
            </div>
            <div className="p-8">
                <div className="w-20 uppercase tracking-wide text-sm bg-gray-400 text-indigo-500 font-semibold mb-2 h-4"></div>
                <div className="w-40 mt-4 bg-gray-400 h-4 "></div>
            </div>
        </div>
    </div>
  );
}
