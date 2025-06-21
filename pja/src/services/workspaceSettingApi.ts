import api from "../lib/axios";
import type { ApiResponse } from "../types/common";
import type { workspace } from "../types/workspace";
import type { UpdateWorkspacePayload } from "../types/workspace";

//워크스페이스 단일 조회
export const getworkspace = async (
  workspaceId: number
): Promise<ApiResponse<workspace>> => {
  try {
    const response = await api.get(`/workspaces/${workspaceId}`);
    console.log("Select workspace", response.data);
    return response.data;
  } catch (error: any) {
    console.error("워크스페이스 단일 정보 요청 실패:", error);

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

//워크스페이스 수정 (설정 페이지)
export const updateWorkspace = async (
  workspaceId: number,
  data: UpdateWorkspacePayload
): Promise<ApiResponse<workspace>> => {
  try {
    const response = await api.put(`/workspaces/${workspaceId}`, data);
    return response.data;
  } catch (error: any) {
    console.error(" 워크스페이스 수정 실패:", error);
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
