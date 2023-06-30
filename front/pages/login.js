import { useState, useEffect } from "react";
import Input from "./../components/Input";

export default function Login() {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const { email, password, username, confirm_password } = inputs;

  const onChange = (e) => {
    const { id, value } = e.target;
    setInputs({
      ...inputs,
      [id]: value,
    });
    console.log(inputs);
  };

  const validation = (id) => {
    if (id == "email") {
      const emailRegex =
        /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
      if (!emailRegex.test()) {
        return "이메일 형식에 맞춰서 작성해주세요.";
      }
    }
    if (id == "name") {
      const nameRegex = /^[가-힣a-zA-Z]+$/;
      if (!nameRegex.test()) {
        return "사용자 이름은 한글/영어만 가능합니다.";
      }
    }
    if (id == "password") {
      const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,25}$/;
      if (!passwordRegex.test()) {
        return "비밀번호는 한글/영어/숫자 조합 8자 이상이어야 합니다.";
      }
    }
  };
  useEffect(validation, []);
  const validText = validation();
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        ></a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              회원가입
            </h1>
            <form className="space-y-4 md:space-y-6" action="#">
              <Input
                name="사용자 이름"
                id="username"
                onChange={onChange}
                value={username}
                placeholder="사용자 이름"
              />
              <Input
                name="이메일"
                id="email"
                onChange={onChange}
                value={email}
                placeholder="name@company.com"
              />
              <Input
                name="비밀번호"
                id="password"
                onChange={onChange}
                value={password}
                placeholder="••••••••"
              />
              <Input
                name="비밀번호 확인"
                id="confirm-password"
                onChange={onChange}
                value={confirm_password}
                placeholder="••••••••"
              />

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    aria-describedby="terms"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    required=""
                  ></input>
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="terms"
                    className="font-light text-gray-500 dark:text-gray-300"
                  >
                    I accept the{" "}
                    <a
                      className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                      href="#"
                    >
                      Terms and Conditions
                    </a>
                  </label>
                </div>
              </div>
              <button
                type="submit"
                class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Create an account
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                이미 계정이 있으신가요?{" "}
                <a
                  href="#"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  로그인 하기
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
