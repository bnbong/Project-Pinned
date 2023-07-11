import React from "react";
import { useRouter } from "next/router";

const Card = ({ author, location, title, content, images, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="max-w-l mx-auto bg-white shadow-md rounded overflow-hidden md:max-w-xl m-2"
    >
      <div className="md:flex items-center bg-purple-200">
        <div className="m-1 rounded-full h-8 w-8 flex-shrink-0 bg-gray-400">
          <img
            className="h-full w-full object-cover rounded-full"
            src="https://via.placeholder.com/150"
            alt="프로필 이미지"
          />
        </div>
        <div className="flex-grow">
          <div className="ml-2 mt-1 mb-1 text-gray-600 font-semibold">
            {author}
          </div>
        </div>
        <div className="flex-shrink-0">
          <div className="mr-2 mt-0.5 mb-0.5 p-1 pt-0.5 pb-0.5 text-white bg-indigo-500 font-semibold rounded-3xl drop-shadow-md">
            {location}
          </div>
        </div>
      </div>
      <div className="md:flex justify-between">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            {title}
          </div>
          <p className="mt-2 text-gray-500">{content}</p>
        </div>
        <div className="md:flex-shrink-0">
          <img
            className="h-48 w-full object-cover md:w-48"
            src={images[0]?.image || "https://via.placeholder.com/150"}
            onError={(e)=>{e.target.onerror = null; e.target.src="https://via.placeholder.com/150"}}
            alt="A random image"
          />
        </div>
      </div>
    </div>
  );
};

export default function NewPostLayout({
  author,
  location,
  title,
  content,
  images = [],
  postId,
}) {
  const router = useRouter();
  return (
    <div className="justify-around items-start">
      <Card
        onClick={() => router.push(`/post/${postId}`)}
        author={author}
        location={location}
        title={title}
        content={content}
        images={images}
      ></Card>
    </div>
  );
}
