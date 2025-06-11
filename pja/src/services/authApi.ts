import api from "../lib/axios";

// 로그인 성공 응답 타입
export interface LoginSuccessResponse {
  status: "success";
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

// 로그인 실패 응답 타입
export interface LoginErrorResponse {
  status: "fail" | "error";
  message: string;
}

export const login = async (
  uid: string,
  password: string
): Promise<LoginSuccessResponse> => {
  const response = await api.post<LoginSuccessResponse>("/auth/login", {
    uid,
    password,
  });
  return response.data;
};

//로그아웃 응답 타입
export interface LogoutResponse {
  status: "success" | "fail" | "error";
  message: string;
  data?: null;
}

export interface LogoutError {
  status: "fail" | "error";
  message: string;
}

export const logoutUser = async (): Promise<LogoutResponse> => {
  try {
    const response = await api.post("/auth/logout");
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        error.response.data?.message || `서버 오류 (${error.response.status})`
      );
    }
    if (error.message.includes("fetch")) {
      throw new Error(
        "서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요."
      );
    }
    if (error.message.includes("CORS")) {
      throw new Error("CORS 오류가 발생했습니다. 서버 설정을 확인해주세요.");
    }
    throw error;
  }
};
