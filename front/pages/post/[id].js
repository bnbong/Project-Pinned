import React from "react";
import axiosBaseURL from "@/components/axiosBaseUrl";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.bubble.css";
import { useMutation, useQueries, useQuery } from "react-query";
import { toast } from "react-hot-toast";
import { useState } from "react";
import Comment from "@/components/Comment";

export default function Post({ data }) {
  const ReactQuill = dynamic(() => import("react-quill"), {
    ssr: false,
  });

  const title = data.post_title;
  const content = data.post_content;
  const landmark = data.landmark_name;
  const username = data.username;
  const created = data.created_at;
  const id = data.post_id;
  const [comment, setComment] = useState("");

  const onChange = (e) => {
    setComment(e.target.value);
  };

  //댓글 작성
  const { mutate } = useMutation({
    mutationFn: async (comment) => {
      return await axiosBaseURL.post(`api/v1/post/${id}/comments/`, comment);
    },
    onSuccess: (data, variables, context) => {
      toast.success("댓글 작성 성공");
    },
    onError: (error, variables, context) => {
      toast.error("댓글 작성 실패");
    },
  });
  //해당 포스트 댓글 가져오기
  // const { status, data, error } = useQuery({
  //   queryKey: ["comments"],
  //   queryFn: () => axiosBaseURL.get("api/v1/post/2/comments/"),
  // });

  return (
    <div className="min-h-screen bg-gray-100 mb-20">
      <div className="min-h-screen max-w-3xl mx-auto py-8">
        <div className="min-h-screen bg-white rounded-lg shadow-md p-10">
          <h1 className="text-2xl font-bold mb-4">{title}</h1>
          <hr></hr>
          <br></br>
          <time pubdate dateTime="2022-02-08" title="February 8th, 2022">
            by {username} 생성일자 : {created.slice(0, 10)}
          </time>
          <ReactQuill value={content} readOnly={true} theme={"bubble"} />
          <br></br>

          <section className="not-format">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">
                댓글 수 (20)
              </h2>
            </div>
            <div className="mb-6">
              <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <label htmlFor="comment" className="sr-only">
                  Your comment
                </label>
                <textarea
                  id="comment"
                  onChange={(e) => onChange(e)}
                  rows="6"
                  className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                  placeholder="Write a comment..."
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                onClick={() => {
                  if (comment) {
                    mutate({ comment_content: comment });
                  } else {
                    toast.error("댓글 창이 비어있습니다.");
                  }
                }}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                댓글 남기기
              </button>
            </div>
            <Comment />
            <article className="p-6 mb-6 ml-6 lg:ml-12 text-base bg-white rounded-lg dark:bg-gray-900">
              <footer className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
                    <img
                      className="mr-2 w-6 h-6 rounded-full"
                      src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                      alt="Jese Leos"
                    />
                    Jese Leos
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <time
                      pubdate
                      dateTime="2022-02-12"
                      title="February 12th, 2022"
                    >
                      Feb. 12, 2022
                    </time>
                  </p>
                </div>
                <button
                  id="dropdownComment2Button"
                  data-dropdown-toggle="dropdownComment2"
                  className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-400 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                  type="button"
                >
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
                  </svg>
                  <span className="sr-only">Comment settings</span>
                </button>

                <div
                  id="dropdownComment2"
                  className="hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
                >
                  <ul
                    className="py-1 text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="dropdownMenuIconHorizontalButton"
                  >
                    <li>
                      <a
                        href="#"
                        className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Edit
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Remove
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Report
                      </a>
                    </li>
                  </ul>
                </div>
              </footer>
              <p>Much appreciated! Glad you liked it ☺️</p>
              <div className="flex items-center mt-4 space-x-4">
                <button
                  type="button"
                  className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400"
                >
                  <svg
                    aria-hidden="true"
                    className="mr-1 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    ></path>
                  </svg>
                  Reply
                </button>
              </div>
            </article>
            <Comment />
            <Comment />
          </section>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params; // context를 사용해 만든 쿼리 정보
  try {
    const res = await axiosBaseURL.get(`api/v1/post/${id}`); // 상세 페이지 데이터

    if (res.status === 200) {
      const data = res.data;

      return { props: { id: id, data: data } }; // 컴포넌트에 넘겨줄 props
    }

    return { props: { id } };
  } catch (error) {
    console.log(error);
    return { props: { id } };
  }
}
