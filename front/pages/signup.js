import { useCallback, useEffect, useState } from "react";
import Input from "../components/Input";
import Link from "next/link";
import { useMutation } from "react-query";
import apiMapper from "@/components/apiMapper";
import axiosBaseURL from "@/components/axiosBaseUrl";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";

export default function Login() {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState({});
  const [success, setSuccess] = useState({
    email: false,
    password: false,
    username: false,
    confirm_password: false,
  });
  const [submit, setSubmit] = useState(false);
  const [mount, setMount] = useState(false);
  const { email, password, username, confirm_password } = inputs;
  const router = useRouter();

  const onChange = useCallback(
    (e) => {
      const { id, value } = e.target;

      setInputs((prevInput) => ({
        ...prevInput,
        [id]: value,
      }));
    },
    [inputs]
  );

  useEffect(() => {
    if (mount) {
      const emailRegex =
        /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
      if (!emailRegex.test(email)) {
        console.log(email);
        setEmailError("이메일 형식에 맞춰서 작성해주세요.");
      } else {
        setSuccess({
          ...success,
          email: true,
        });
        setEmailError("");
      }
    }
    setMount(true);
  }, [email]);

  useEffect(() => {
    if (mount) {
      const nameRegex = /^[가-힣a-zA-Z]+$/;
      if (!nameRegex.test(username)) {
        setUsernameError("사용자 이름은 한글/영어만 가능합니다.");
      } else {
        setUsernameError("");
        setSuccess({
          ...success,
          username: true,
        });
      }
    }
  }, [username]);

  useEffect(() => {
    if (mount) {
      const passwordRegex =
        /^[A-Za-z0-9`\-=\\\[\];',\./~!@#\$%\^&\*\(\)_\+|\{\}:"<>\?]{8,16}$/;
      if (confirm_password !== password) {
        setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
        setSuccess({
          ...success,
          confirm_password: false,
        });
      }
      if (confirm_password === password) {
        setConfirmPasswordError("");
        setSuccess({
          ...success,
          confirm_password: true,
        });
      }
      if (!passwordRegex.test(password)) {
        setPasswordError("비밀번호는 영어/숫자 조합 8자 이상이어야 합니다.");
      } else {
        setPasswordError("");
        setSuccess({
          ...success,
          password: true,
        });
      }
    }
  }, [password]);

  useEffect(() => {
    if (mount) {
      if (confirm_password !== password) {
        console.log(confirm_password, password);
        setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
      } else {
        setConfirmPasswordError("");
        setSuccess({
          ...success,
          confirm_password: true,
        });
      }
    }
  }, [confirm_password]);

  const { mutate, data, error, isError, isLoading } = useMutation({
    mutationFn: (userInformation) => {
      return axiosBaseURL.post(apiMapper.user.post.REGISTER, userInformation);
    },
    onSuccess: (data, variables, context) => {
      console.log(data);
      toast.success("회원가입 성공");
      router.push("/");
    },
    onError: (err, variables, context) => {
      if (err.response.status === 400) {
        toast.error("이미 가입된 계정입니다.");
      } else {
        toast.error("에러가 발생했습니다.");
      }
      setErrorMessage(err);
    },
  });

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div>
        <Toaster />
      </div>
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
            <div className="space-y-4 md:space-y-6">
              <Input
                name="사용자 이름"
                id="username"
                onChange={onChange}
                value={username}
                placeholder="사용자 이름"
                valid_text={usernameError}
              />
              <Input
                name="이메일"
                id="email"
                onChange={onChange}
                value={email}
                placeholder="name@company.com"
                valid_text={emailError}
              />
              <Input
                name="비밀번호"
                id="password"
                onChange={onChange}
                value={password}
                placeholder="••••••••"
                valid_text={passwordError}
              />
              <Input
                name="비밀번호 확인"
                id="confirm_password"
                onChange={onChange}
                value={confirm_password}
                placeholder="••••••••"
                valid_text={confirmPasswordError}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    Object.values(success).forEach((e) => {
                      if (e === false) {
                        setSubmit(false);
                      } else setSubmit(true);
                    });
                    if (
                      submit === true &&
                      username !== "" &&
                      password !== "" &&
                      confirm_password !== "" &&
                      email !== ""
                    )
                      mutate({ username, email, password });
                    else toast.error(`입력값을 확인해 주세요.`);
                  }
                }}
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
                onClick={() => {
                  Object.values(success).forEach((e) => {
                    if (e === false) {
                      setSubmit(false);
                    } else setSubmit(true);
                  });
                  if (
                    submit === true &&
                    username !== "" &&
                    password !== "" &&
                    confirm_password !== "" &&
                    email !== ""
                  )
                    mutate({ username, email, password });
                  else toast.error(`입력값을 확인해 주세요.`);
                }}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                회원가입하기
              </button>
              {isError ? <div>{errorMessage.detail}</div> : null}
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                이미 계정이 있으신가요?{" "}
                <Link
                  href="/login"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  로그인 하기
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
