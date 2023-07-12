import React from "react";

export default function SkeletonCard() {
  return (
    <div className="max-w-l mx-auto bg-gray-300 shadow-md rounded overflow-hidden md:max-w-xl m-2 animate-pulse">
      <div className="md:flex items-center bg-gray-300">
        <div className="m-1 rounded-full h-8 w-8 flex-shrink-0 bg-gray-400"></div>
        <div className="flex-grow">
          <div className="max-w-tagsize h-6 ml-2 mt-1 mb-1 text-gray-600 font-semibold h-4 bg-gray-500 rounded-sm"></div>
        </div>
        <div className="flex-shrink-0">
          <div className="min-w-tagsize h-6 mr-2 mt-0.5 mb-0.5 p-1 pt-0.5 pb-0.5 h-4 bg-gray-500 rounded-3xl"></div>
        </div>
      </div>
      <div className="min-w-xl md:flex justify-between">
        <div className="p-8">
          <div className="w-24 h-5 mb-2 uppercase tracking-wide text-sm font-semibold bg-gray-500"></div>
          <p className="w-80 t-2 h-4 w-lg mb-2 bg-gray-500"></p>
          <p className="w-80 t-2 h-4 w-lg mb-2 bg-gray-500"></p>
          <p className="w-80 t-2 h-4 w-lg mb-2 bg-gray-500"></p>
        </div>
        <div className="md:flex-shrink-0">
          <div className="h-48 w-full object-cover md:w-48 bg-gray-500"></div>
        </div>
      </div>
    </div>
  );
}
