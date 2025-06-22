import api from "../lib/axios";
import type { ApiResponse } from "../types/common";

// 멤버 삭제
export const deleteMember = async (
    workspaceId: number,
    memberId: number
) => {
  try {
    const response = await api.delete(`workspaces/${workspaceId}/members/${memberId}`);
    return response.data;
  } catch (error: any) {
    console.error("멤버 삭제 실패", error);

    if (error.response) {
      console.error("응답 상태코드:", error.response.status);
      console.error("서버 status:", error.response.data?.status);
      console.error("서버 message:", error.response.data?.message);
    } else if (error.request) {
      console.error("요청은 보냈지만 응답 없음:", error.request);
    } else {
      console.error("요청 설정 중 에러 발생:", error.message);
    }
    throw error;
  }
};
