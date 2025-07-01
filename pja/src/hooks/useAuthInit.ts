import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setAccessToken, clearAccessToken } from "../store/authSlice";
import { refreshAccessToken } from "../services/authApi";
import { useNavigate } from "react-router-dom";

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
    const payload = JSON.parse(jsonPayload);
    const exp = payload.exp;
    if (!exp) return true;
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

//api 호출 시 타임 아웃 걸기
function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error("Timeout"));
    }, timeoutMs);

    promise
      .then((res) => {
        clearTimeout(timeoutId);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timeoutId);
        reject(err);
      });
  });
}

export function useAuthInit() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const TIMEOUT_MS = 5000; //5초

  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        if (!token || isTokenExpired(token)) {
          //토큰이 없거나 유효기간이 만료되면 실행
          const response = await withTimeout(refreshAccessToken(), TIMEOUT_MS); //새 토큰 요청
          const accessToken = response.data?.accessToken;
          if (!accessToken) {
            console.warn("accessToken이 없음 - 토큰 갱신 실패 처리");
            throw new Error("토큰 갱신 실패 - accessToken 없음");
          } else {
            dispatch(setAccessToken(accessToken));
          }
        } else {
          dispatch(setAccessToken(token));
        }
      } catch (err: any) {
        if (err.message === "Timeout") {
          console.warn("토큰 갱신 요청 타임아웃 발생");
        } else {
          console.warn("토큰 갱신 실패", err);
        }
        dispatch(clearAccessToken());
        setAuthInitialized(true);
        return;
      }
      setAuthInitialized(true);
    };
    initializeAuth();
  }, [dispatch, navigate]);
  return authInitialized;
}
