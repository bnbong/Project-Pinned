import { useEffect } from "react";

export default function Input(prop) {
  const validation = (id) => {
    if (id == "email") {
      const emailRegex =
        /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
      if (!emailRegex.test(prop.value)) {
        return "이메일 형식에 맞춰서 작성해주세요.";
      }
    }
    if (id == "username") {
      const nameRegex = /^[가-힣a-zA-Z]+$/;
      if (!nameRegex.test(prop.value)) {
        return "사용자 이름은 한글/영어만 가능합니다.";
      }
    }
    if (id == "password") {
      const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,25}$/;
      if (!passwordRegex.test(prop.value)) {
        return "비밀번호는 한글/영어/숫자 조합 8자 이상이어야 합니다.";
      }
    }
  };
  useEffect(validation, [prop.value]);
  const validText = validation(prop.id);
  return (
    <div>
      <label
        htmlFor={prop.id}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {prop.name}
      </label>
      <input
        onChange={prop.onChange}
        type={prop.id}
        name={prop.id}
        id={prop.id}
        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder={prop.placeholder}
        required=""
      ></input>{" "}
      <div style={{ color: "red" }}>{validText}</div>
    </div>
  );
}
