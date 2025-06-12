import api from "../lib/axios";
import type { ApiResponse } from "../types/common";
import type { user } from "../types/user";
//사용자 정보관련 api

// 사용자 정보 get
export const getuser = async (): Promise<ApiResponse<user>> => {
  try {
    const response = await api.get("/user/read-info");
    return response.data;
  } catch (error: any) {
    console.error("🔴 [getuser] 유저 정보 요청 실패:", error);

    if (error.response) {
      console.error("응답 상태코드:", error.response.status);
      console.error("서버 status:", error.response.data?.status);
      console.error("서버 message:", error.response.data?.message);
      // data는 응답이 없을 수도 문제가 생겨 안 올 수도 있음
      // 그래서 항상 방어적으로 data?.message 형태로 접근하는 것이 안전
    } else if (error.request) {
      console.error("요청은 보냈지만 응답 없음:", error.request);
    } else {
      console.error("요청 설정 중 에러 발생:", error.message);
    }

    throw error; // 호출한 쪽에서 이 에러를 다시 처리하도록 던짐
  }
};
