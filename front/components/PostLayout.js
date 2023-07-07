import { React, useState } from 'react';

export default function PostLayout({ profileImage, username, postImage, likes, description }) {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  const handleInputChange = (e) => {
    setComment(e.target.value);
  }

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    setComments(prevComments => [...prevComments, comment]);
    setComment('');
  }

  return (
    <div className="post bg-white border border-gray-300 m-4 p-4 w-[23.5rem] mx-auto">
      <div className="user-info flex items-center mb-4">
        <img className="profile-image w-10 h-10 rounded-full mr-4" src={profileImage} alt="Profile Image" />
        <h2 className="username text-sm font-bold">{username}</h2>
      </div>
      <div>
        <p className='text-base font-bold mb-2'>Hello World</p>
      </div>
      <img className="post-image w-full h-auto" src={postImage} alt="Post Image" />
      <div className="actions flex justify-between items-center my-2">
        <button className="like-button">❤️</button>
        <button className="comment-button">💬</button>
      </div>
      <p className="likes text-sm font-bold mb-2">{likes} likes</p>
      <div className="post-description">
        <strong className="username text-sm font-bold">{username}</strong> <span className="text-sm">{description}</span>
      </div>
      <form onSubmit={handleCommentSubmit} className="mt-4">
        <input 
          type="text" 
          placeholder="Add a comment..." 
          value={comment} 
          onChange={handleInputChange} 
          className="border-none w-full rounded border p-2 text-sm" 
        />
      </form>
    </div>
  );
}


