import NewPostLayout from '@/components/PostLayout';
import SkeletonCard from '@/components/SkeletonPostLayout';
import React from 'react';


function PostCard() {
  
  return (
    <>
      <NewPostLayout
            author="허재원"
            location="보정동"
            title="이것은 게시글입니다"
            content={"This is Fucking first description"}
          />
      <div>
        <SkeletonCard/>
      </div>
    </>
  )
}

export default PostCard;