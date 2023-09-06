import Input from '@/components/Input';
import apiMapper from '@/components/apiMapper';
import axiosBaseURL from '@/components/axiosBaseUrl';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useCallback } from 'react';
import { useMutation } from 'react-query';
import toast from 'react-hot-toast';
import { Spinner } from 'flowbite-react';
import withAuth from '@/HOC/withAuth';

export default withAuth(function Login() {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const router = useRouter();
  const onChange = useCallback(
    (e) => {
      const { id, value } = e.target;
      if (id == 'email') {
        setEmail(value);
      }
      if (id == 'password') {
        setPassword(value);
      }
    },
    [email, password]
  );
  const { mutate, data, isLoading, isError } = useMutation({
    mutationFn: (loginInformation) => {
      return axiosBaseURL.post(apiMapper.user.post.LOGIN, loginInformation);
    },
    onSuccess: (data, variables, context) => {
      //data에 서버 resonse값이 저장됨

      console.log('success');
      console.log(data);
      localStorage.setItem('access_token', data.data.access_token);
      toast.success('로그인 성공했습니다.');
      router.replace('/');
    },
    onError: (error, variables, context) => {
      if (error) {
        toast.error('아이디 또는 비밀번호가 유효하지 않습니다.');
      } else {
        toast.error('예상치 못한 오류가 발생했습니다.');
      }
    },
  });

  return (
    <>
      <section className='bg-gray-50 dark:bg-gray-900'>
        <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
          <a
            href='#'
            className='flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white'
          >
            핀드 - 내 추억 속의 랜드마크
          </a>

          <div className='w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700'>
            <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
              <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white'>
                로그인하기{isLoading && <Spinner />}
              </h1>
              <div className='space-y-4 md:space-y-6'>
                <Input
                  name='이메일'
                  id='email'
                  value={email}
                  onChange={onChange}
                  placeholder='name@company.com'
                />
                <Input
                  name='비밀번호'
                  id='password'
                  type='password'
                  value={password}
                  onChange={onChange}
                  placeholder='••••••••'
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      mutate({ email, password });
                    }
                  }}
                />
                <div className='flex items-center justify-between'>
                  <div className='flex items-start'>
                    <div className='flex items-center h-5'>
                      <input
                        id='remember'
                        aria-describedby='remember'
                        type='checkbox'
                        className='w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800'
                        required=''
                      ></input>{' '}
                    </div>
                    <div className='ml-3 text-sm'>
                      <label
                        htmlFor='remember'
                        className='text-gray-500 dark:text-gray-300'
                      >
                        계정 기억하기
                      </label>
                    </div>
                  </div>
                  <a
                    href='#'
                    className='text-sm font-medium text-primary-600 hover:underline dark:text-primary-500'
                  >
                    비밀번호를 잊으셨나요?
                  </a>
                </div>
                <button
                  type='submit'
                  onClick={() => mutate({ email, password })}
                  className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                >
                  로그인하기
                </button>

                <p className='text-sm font-light text-gray-500 dark:text-gray-400'>
                  계정이 아직 없으신가요?{' '}
                  <Link
                    href='/signup'
                    className='font-medium text-primary-600 hover:underline dark:text-primary-500'
                  >
                    가입하기
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
});
