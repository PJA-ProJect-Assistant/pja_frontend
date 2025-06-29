import api from "../../lib/axios";
import type { ApiResponse } from "../../types/common";
import type { aiRecommendCateories, listresponse } from "../../types/list";
//리스트페이지 전체 관련 api

//프로젝트 진행 전체 정보 ai 추천
export const postAiList = async (
  workspaceId: number
): Promise<ApiResponse<aiRecommendCateories>> => {
  try {
    console.log("프로젝트 진행 ai api");
    const response = await api.post(
      `/workspaces/${workspaceId}/project/generation`
    );
    console.log("프로젝트 진행 ai 가져오기 :", response);
    return response.data;
  } catch (error: any) {
    console.error("🔴 [getAiList] 프로젝트 진행 ai 가져오기 실패:", error);

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

// 프로젝트 진행 전체 정보
export const getlist = async (
  workspaceId: number
): Promise<ApiResponse<listresponse>> => {
  try {
    const response = await api.get(
      `/workspaces/${workspaceId}/project/progress`
    );
    return response.data;
  } catch (error: any) {
    console.error("🔴 [getlist] 프로젝트 진행 전체 정보 가져오기 실패:", error);

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
