import axios from 'axios';
import toast from 'react-hot-toast';
import mem from 'mem';

/**
 * refresh api 요청이 중복되서 서버에 전송되면 DB에 저장된 refresh 토큰과 다른 토큰을 클라이언트가
 * 가지게 될 수 있다. 따라서 refresh api 를 1000 타임동안 memoization하여 이 시간동안 추가적으로 요청되는
 * refresh api를 재사용한다. refresh 응답이 오면은 memoization된 api를 기다리던 요청들은 동일한 access token과 refresh token으로
 * 기존 api를 재요청 보낼 수 있다.
 *
 */
const getNewAccessToken = mem(
  async () => {
    try {
      const {
        data: { access },
      } = await axiosBaseURL.post('api/v1/user/token/refresh/');

      return access;
    } catch (err) {
      toast.error('다시 로그인해주세요.');
      localStorage.removeItem('access_token');
    }
  },
  { maxAge: 1000 }
);

const axiosBaseURL = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_URL}/`, // 프로덕션 이미지 빌드 시 실제 URL로 변경
  withCredentials: true,
});

// 모듈 스코프에서 선언된 변수는 모듈이 임포트 될 때 한번만 초기화 된다. 이후 초기화 값에서 변경되지 않는다.
// 클로저의 특징을 가진 요청 인터셉터는 최초 초기화 값을 기억한다.
// 변수 값은 변경되지 않는데 이 특성 때문에 요청 인터셉터는 토큰의 값이 변경되어도 항상 최초 초기화 값만 사용하게 된다.
let accessToken =
  typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

axiosBaseURL.interceptors.request.use(
  (config) => {
    console.log('requeset interceptor', config.url);
    accessToken =
      typeof window !== 'undefined'
        ? localStorage.getItem('access_token')
        : null;
    // 모든 Request Header에 Access토큰을 넣어주는 역할
    if (!config.headers['Authorization'] && accessToken !== '' && accessToken) {
      //메인 피드 동적으로 변경시 변경 필요
      if (config.url === 'api/v1/post/feed') {
        config.headers['Authorization'] = '';
        config.headers['Content-Type'] = 'application/json';
      } else {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
        config.headers['Content-Type'] = 'application/json';
      }
      //return config;
    }
    //login & signup 페이지에선 access_token을 header에서 없앤다.
    if (
      config.url === 'api/v1/user/login/' ||
      config.url === 'api/v1/user/register/' ||
      config.url === 'api/v1/landmark/landmarks'
    ) {
      config.headers['Authorization'] = '';
      config.headers['Content-Type'] = 'application/json';
    }
    if (
      config.url.includes('api/v1/user/') &&
      config.url.includes('profile/') &&
      config.method == 'put'
    ) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosBaseURL.interceptors.response.use(
  (response) => response,
  async (error) => {
    const prevRequest = error?.config;

    // mypage api에선 로그아웃 연장이 안된다.
    // 1. 이 부분이 재발급 받는 부분인데, 그 과정에서 access_token 지워지고 생성된다.
    // 2. 그 과정에서 local storage에 undefined 된 access_token이 생성되어 401 error가 뜬다
    // 3. 그럼 401 에 걸려서 err catch로 넘어가고, 그 결과로 로그인이 안된 상태로 처리되는 것 같다.

    if (error?.response?.status === 401 && !prevRequest?.sent) {
      console.log('401 token 재발급');

      try {
        const newAccessToken = await getNewAccessToken();
        localStorage.setItem('access_token', newAccessToken);

        prevRequest.sent = true;
        prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return axiosBaseURL(prevRequest);
      } catch (err) {
        toast.error('다시 로그인 해주세요!');
        throw err;
      }
    }

    if (error?.response?.status >= 500) {
      toast.error('서버 에러가 발생했습니다.');
    }

    return Promise.reject(error);
  }
);
export default axiosBaseURL;
