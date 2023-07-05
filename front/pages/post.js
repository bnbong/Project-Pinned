import dynamic from "next/dynamic";
import { useRef, useState, useMemo } from "react";
import Input from "@/components/Input";
import "react-quill/dist/quill.snow.css";

export default function Post({ html, setHtml }) {
  const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
  const quillRef = useRef(null);
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: "1" }, { header: "2" }],
          [{ size: [] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" }, { align: [] }],
          ["image"],
        ],
        // handlers: { image: imageHandler },
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    []
  );

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "align",
    "image",
  ];
  const onChange = () => {};

  return (
    <div className="mx-10 mt-10">
      <div className="mb-6">
        <Input
          name="제목"
          id="title"
          onChange={onChange}
          placeholder="제목을 작성하세요"
        />
      </div>
      <div>
        <ReactQuill
          className="h-96"
          ref={quillRef}
          onChange={(e) => console.log(e)}
          modules={modules}
          formats={formats}
          value={html}
          placeholder={"내용을 작성해 주세요!"}
          theme="snow"
        />
      </div>

      <div className="flex pl-0 space-x-1 sm:pl-2 mt-20">
        <button
          type="submit"
          className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
        >
          작성하기
        </button>
        <input
          style={{ height: "0px", overflow: "hidden" }} //사진 아이콘 클릭시 이미지 파일선택창 불러오기 구현
          accept="image/*"
          id="image_input"
          multiple
          type="file"
          onChange={(e) => onUpload(e)}
        />
        <button
          type="button"
          onClick={() => document.getElementById("image_input").click()}
          className="inline-flex justify-center items-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
        >
          <svg
            className="w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 18"
          >
            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
          </svg>
          <span className="sr-only">Upload image</span>
        </button>
        <button
          type="button"
          className="inline-flex justify-center items-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
        >
          <svg
            className="w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 20"
          >
            <path d="M8 0a7.992 7.992 0 0 0-6.583 12.535 1 1 0 0 0 .12.183l.12.146c.112.145.227.285.326.4l5.245 6.374a1 1 0 0 0 1.545-.003l5.092-6.205c.206-.222.4-.455.578-.7l.127-.155a.934.934 0 0 0 .122-.192A8.001 8.001 0 0 0 8 0Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
          </svg>
          <span className="sr-only">Set location</span>
        </button>
      </div>
    </div>
  );
}
