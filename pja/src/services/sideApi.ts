import api from "../lib/axios";
import type { GitInfoResponse } from "../types/side";

export const leaveWorkspace = async (workspaceId: number) => {
  try {
    const response = await api.delete(`/workspaces/${workspaceId}/leave`);
    return response.data;
  } catch (error: any) {
    console.error("워크스페이스 출처리 실패:", error);
    throw error;
  }
};

//Git 연동 조회
export const getGitInfo = async (
  workspaceId: number
): Promise<GitInfoResponse> => {
  try {
    const response = await api.get<GitInfoResponse>(
      `/workspaces/${workspaceId}/git`
    );
    return response.data;
  } catch (error: any) {
    console.error("getGitInfo API 호출 실패:", error);

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
