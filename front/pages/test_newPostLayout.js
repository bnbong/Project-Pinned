import React from 'react';

const Card = ({ author, location, title, content }) => {
  return (
    <div className="max-w-3xl bg-white shadow-md rounded overflow-hidden md:max-w-4xl m-2">
      <div className="md:flex items-center bg-purple-200">
        <div className="m-1 rounded-full h-8 w-8 flex-shrink-0 bg-gray-400">
          <img className="h-full w-full object-cover rounded-full" src="https://via.placeholder.com/150" alt="프로필 이미지" />
        </div>
        <div className="flex-grow">
          <div className="ml-2 mt-1 mb-1 text-gray-600 font-semibold">{author}</div>
        </div>
        <div className="flex-shrink-0">
          <div className="mr-2 mt-1 mb-1 text-gray-600 font-semibold">{location}</div>
        </div>
      </div>
      <div className="md:flex">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{title}</div>
          <p className="mt-2 text-gray-500">{content}</p>
        </div>
        <div className="md:flex-shrink-0">
          <img className="h-48 w-full object-cover md:w-48" src="https://via.placeholder.com/150" alt="A random image"/>
        </div>
      </div>
    </div>
  );
};

function PostCard() {
  
  return (
    <div className="flex flex-wrap justify-around items-start">
      <Card author="허재원" location="보정동" title="Card Title 1" content="This is a short description of the card."></Card>
    </div>
  )
}

export default PostCard;