import api from "../lib/axios";
import type { ApiResponse } from "../types/common";
import type { user } from "../types/user";

export const getuser = async (): Promise<ApiResponse<user>> => {
  try {
    const response = await api.get("/user/read-info");
    return response.data;
  } catch (error: any) {
    console.error("🔴 [getuser] 유저 정보 요청 실패:", error);

    if (error.response) {
      console.error("응답 상태코드:", error.response.status);
      console.error("응답 데이터:", error.response.data);
    } else if (error.request) {
      console.error("요청은 보냈지만 응답 없음:", error.request);
    } else {
      console.error("요청 설정 중 에러 발생:", error.message);
    }

    throw error; // 호출한 쪽에서 이 에러를 다시 처리하도록 던짐
  }
};
