import { React, useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";

function leftPad(value) {
  if (value >= 10) {
    return value;
  }

  return `0${value}`;
}

//Client sided에서 동작하는 라이브러리라 ssr을 false로 바꿔 런타임에 동적 import한다.
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

const Edit = (props) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("initial content");
  const onChange = useCallback((content) => {
    setContent(content), [];
  });

  /* SSR 방식이라 pre-rendering 될때는 window,document객체에 접근할 수없기 때문에
  localstorage를 이용할 때는 조건문을 사용해야함.
  */

  const autosavedContent =
    typeof window !== "undefined" ? localStorage.getItem(`smde_demo`) : null;

  const delay = 2000;

  const anOptions = useMemo(() => {
    return {
      autosave: {
        enabled: true,
        uniqueId: "editor",
        delay,
      },
    };
  }, [delay]);

  return (
    <div>
      <input
        className="w-full h-11 mb-2 px-3 border border-[#ced4da] rounded placeholder:font-bold  "
        placeholder="제목"
        id="title"
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <SimpleMDE
        id="editor"
        value={autosavedContent}
        placeholder="내용을 입력하세요."
        onChange={onChange}
        options={anOptions}
      />

      <div className="flex justify-center">
        <button className="px-14 py-1 bg-[#ced4da] rounded-md">취소</button>
        <button
          className="px-14 py-1 mx-1 bg-[#f0545459] rounded-md"
          onClick={() => {
            const datetime = new Date(Date.now());
            const time = `${datetime.getFullYear()}-${datetime.getMonth()}-${datetime.getDate()}T${leftPad(
              datetime.getHours()
            )}:${leftPad(datetime.getMinutes())}:${leftPad(
              datetime.getSeconds()
            )}.000000`;
            console.log(time);
          }}
        >
          완료
        </button>
      </div>
    </div>
  );
};

export default Edit;
