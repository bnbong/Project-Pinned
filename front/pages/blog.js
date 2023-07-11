import React from 'react';
//후순위로 미뤄둬야겠다.
export default function Post (){
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="min-h-screen max-w-3xl mx-auto py-8">
        <div className="min-h-screen bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">post</h1>
          <p className="text-gray-600">
            This is the detailed view of post. Add your content here.
          </p>
        </div>
      </div>
    </div>
  );
};