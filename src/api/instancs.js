import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
});

// 인터셉터(interceptor) : 요청/응답시 중간에 가로채는 함수
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    // 토큰이 있다면 요청시 헤더에 토큰을 붙여서 보냄
    // Authorization : Bearer 토큰dms JWT 인증의 표준 형식
    config.headers.Authorization = `Bearer ${token}`;
  }
  // 수정된 config를 반환해야 요청시 전송됨
  return config;
});

// 응답 인터셉터 : 401 에러 발생시 자동으로 로그아웃 처리
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 에러 처리
    return Promise.reject(error);
  },
);

export default instance;
