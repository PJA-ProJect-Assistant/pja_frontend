import axios from "axios";
import { setAccessToken, clearAccessToken } from "../store/authSlice";
import { store } from "../store/store";
import type { RootState } from "../store/store";

// 1. axios 인스턴스 생성
const api = axios.create({
  baseURL: "http://localhost:8080/api", // 백엔드 API 기본 주소
  withCredentials: true, // 쿠키 전송 허용
});

//  2. 요청 인터셉터 설정: 요청 전에 JWT 토큰 자동 삽입
api.interceptors.request.use((config) => {
  // store.getState()에서 최신 상태 가져오기
  const state: RootState = store.getState();
  console.log("store.getState() : ", store.getState());

  const token = state.auth.accessToken;
  console.log("📦 요청 인터셉터 - accessToken:", token);
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 3. 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        //refresh token은 쿠키에 저장되어 있으니 빈 바디로 요청 가능
        const refreshResponse = await api.post("/auth/reissue", {
          refreshToken: "dummy", // 백엔드는 쿠키에서 읽기 때문에 값은 의미 없음
        });

        // Redux에 새 토큰 저장
        const newAccessToken = refreshResponse.data.data.accessToken;
        store.dispatch(setAccessToken(newAccessToken));

        // 원래 요청에 새 토큰 설정하고 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        // 재발급 실패 → 로그아웃 처리
        store.dispatch(clearAccessToken());
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
