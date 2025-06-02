import axios, { AxiosError } from "axios";

// 1. axios 인스턴스 생성
const api = axios.create({
  baseURL: "http://localhost:8080/api", // 백엔드 API 기본 주소
  withCredentials: true, // (선택) 쿠키 기반 인증 시 사용
});

//  2. 요청 인터셉터 설정: 요청 전에 JWT 토큰 자동 삽입
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      // headers 초기화
      config.headers = config.headers || {};

      // 타입 단언을 사용하여 Authorization 설정
      (config.headers as any)["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// 3. 응답 인터셉터 (선택)
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn("인증 실패: 다시 로그인하세요.");
      // 예: localStorage.clear(); navigate("/login");
    }
    return Promise.reject(error);
  }
);

export default api;
