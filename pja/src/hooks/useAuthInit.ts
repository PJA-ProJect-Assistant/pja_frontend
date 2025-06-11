import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAccessToken, clearAccessToken } from "../store/authSlice";
import { refreshAccessToken } from "../services/authApi";

//Base64URL을 일반 Base64로 변환해서 atob()를 사용
function base64UrlDecode(str: string) {
  // URL-safe -> standard Base64
  str = str.replace(/-/g, "+").replace(/_/g, "/");

  // Add padding if missing
  while (str.length % 4 !== 0) {
    str += "=";
  }

  return atob(str);
}

// 토큰 만료 확인
function isTokenExpired(token: string): boolean {
  try {
    const base64Payload = token.split(".")[1];
    const jsonPayload = base64UrlDecode(base64Payload);
    console.log("jsonPayload : ", jsonPayload);
    const payload = JSON.parse(jsonPayload);
    const exp = payload.exp;
    if (!exp) return true;
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

export function useAuthInit() {
  const dispatch = useDispatch();

  useEffect(() => {
    const tryRefreshToken = async () => {
      try {
        const data = await refreshAccessToken(); // 새 accessToken 요청
        console.log("액세스토큰 저장 디스패치 직전", token);
        dispatch(setAccessToken(data.accessToken));
      } catch {
        dispatch(clearAccessToken());
        window.location.href = "/login"; // 로그인 페이지로 리다이렉트
      }
    };

    const token = localStorage.getItem("accessToken");

    if (token) {
      // if (isTokenExpired(token)) {
      //   tryRefreshToken(); // 만료 시 새 토큰 받기 시도
      // } else {
      //   dispatch(setAccessToken(token)); // 유효하면 세팅
      // }
      tryRefreshToken();
    }
  }, [dispatch]);
}
