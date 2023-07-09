const apiMapper = {
  user: {
    post: {
      REGISTER: "api/v1/user/register/",
      LOGIN: "api/v1/user/login/",
      JWT_VERIFY: "api/v1/user/token/verify/",
      JWT_REFRESH: "api/v1/user/token/refresh/",
      USER_EDIT: `api/v1/user/user_id/profile/`,
      USER_FOLLOW: `api/v1/user/user_id/follow/`,
      USER_UNFOLLOW: `api/v1/user/user_id/unfollow/`,
    },
    get: {
      USER_PROFILE: `api/v1/user/user_id/profile/`,
      USER_SEARCH: "api/v1/user/search/",
      USER_FOLLOWER_CHECK: `api/v1/user/user_id/followers/`,
      USER_FOLLOWING_CHECK: `api/v1/user/user_id/followings/`,
    },
    delete: {
      USER_DELETE: `api/v1/user/user_id/withdrawal/`,
    },
  },
};

export default apiMapper;
