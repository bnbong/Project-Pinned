
import React from 'react';
//에러 발생해서 일단 검색한 user 페이지는 임시로 지워 놓음.
const UserPage = ({ id }) => {
  // 동적 경로의 id를 사용하여 페이지를 렌더링하는 로직 작성
  return <div>User ID: {id}</div>;
};

export default UserPage;