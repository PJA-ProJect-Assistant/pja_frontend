import api from "../lib/axios";
import type { ApiResponse } from "../types/common";
import type { LockedUser } from "../types/edit";
//편집 동시성 관련 api

//편집 상태 조회 api
export const getedit = async (
  workspaceId: number,
  page: string
): Promise<ApiResponse<LockedUser[]>> => {
  try {
    const response = await api.get(`/editing/${workspaceId}/${page}`);

    return response.data;
  } catch (error: any) {
    console.error("🔴 [getedit] 편집 조회 실패:", error);

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

//편집 시작 api
export const startedit = async (
  workspaceId: number,
  page: string,
  field: string | null,
  fieldId: string | null
): Promise<ApiResponse<LockedUser>> => {
  try {
    const response = await api.post(`/editing/${workspaceId}/start`, {
      page,
      field,
      fieldId,
    });

    return response.data;
  } catch (error: any) {
    console.error("🔴 [startedit] 편집 시작 실패:", error);

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

//편집 유지 api
export const keepedit = async (
  workspaceId: number,
  page: string,
  field: string | null,
  fieldId: string | null
): Promise<ApiResponse<LockedUser>> => {
  try {
    console.log("편집 유지 api");
    const response = await api.post(`/editing/${workspaceId}/keep`, {
      page,
      field,
      fieldId,
    });
    console.log("편집 유지 :", response);
    return response.data;
  } catch (error: any) {
    console.error("🔴 [keepedit] 편집 유지 실패:", error);

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

//편집 종료 api
export const stopedit = async (
  workspaceId: number,
  page: string,
  field: string | null,
  fieldId: string | null
): Promise<ApiResponse<LockedUser>> => {
  try {
    console.log("편집 종료 api");
    const response = await api.post(`/editing/${workspaceId}/stop`, {
      page,
      field,
      fieldId,
    });
    console.log("편집 종료 :", response);
    return response.data;
  } catch (error: any) {
    console.error("🔴 [stopedit] 편집 종료 실패:", error);

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
