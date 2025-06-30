import api from "../../lib/axios";
import type { ApiResponse } from "../../types/common";
import type {
  myActionList,
  myProgress,
  processtime,
  taskimbalance,
  wsActivity,
} from "../../types/list";

//내 진행률 가져오기
export const getMyPg = async (
  workspaceId: number
): Promise<ApiResponse<myProgress>> => {
  try {
    const response = await api.get(
      `/workspaces/${workspaceId}/project/my-progress`
    );
    return response.data;
  } catch (error: any) {
    console.error("🔴 [getMyPg] 내 진행률 가져오기 실패:", error);

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

//내 액션 리스트(진행전, 진행중) 가져오기
export const getMyAction = async (
  workspaceId: number
): Promise<ApiResponse<myActionList[]>> => {
  try {
    const response = await api.get(
      `/workspaces/${workspaceId}/project/my-actions`
    );
    console.log("내 액션리스트 :", response);
    return response.data;
  } catch (error: any) {
    console.error("🔴 [getMyAction] 내 액션리스트 가져오기 실패:", error);

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

//담당자 불균형 분석 그래프 조회
export const getTaskImbalance = async (
  workspaceId: number
): Promise<ApiResponse<taskimbalance>> => {
  try {
    const response = await api.get(`/workspaces/${workspaceId}/task-imbalance`);
    console.log("불균형 그래프 :", response.data);
    return response.data;
  } catch (error: any) {
    console.error("🔴 [getTaskImbalance] 불균형 그래프 가져오기 실패:", error);

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

//중요도에 따른 평균 작업 처리 시간 그래프 조회
export const getTaskProcessTime = async (
  workspaceId: number
): Promise<ApiResponse<processtime[]>> => {
  try {
    const response = await api.get(
      `/workspaces/${workspaceId}/avg-processing-time`
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "🔴 [getTaskProcessTime] 작업처리시간 그래프 가져오기 실패:",
      error
    );

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

//대시보드 최근활동 조회
export const getWsActivity = async (
  workspaceId: number
): Promise<ApiResponse<wsActivity[]>> => {
  try {
    const response = await api.get(
      `/workspaces/${workspaceId}/workspace-activity`
    );
    return response.data;
  } catch (error: any) {
    console.error("🔴 [getWsActivity] 최근활동 가져오기 실패:", error);

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
