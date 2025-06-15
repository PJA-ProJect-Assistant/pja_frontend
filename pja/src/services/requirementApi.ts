import api from "../lib/axios";
import type { ApiResponse } from "../types/common";
import type { getrequire, setrequire } from "../types/requirement";
//요구사항 명세서 api

//요구사항 생성
export const inputrequirement = async (workspaceId: number, requirementType: string): Promise<ApiResponse<getrequire>> => {
    try {
        console.log("요구사항 생성 api");
        const response = await api.post(`/workspaces/${workspaceId}/requirements`, {
            requirementType,
            content: "",
        });
        console.log("요구사항 생성 :", response);
        return response.data;
    } catch (error: any) {
        console.error("🔴 [inputrequirement] 요구사항 생성 실패:", error);

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
}

//요구사항 조회
export const getrequirement = async (workspaceId: number): Promise<ApiResponse<getrequire[]>> => {
    try {
        console.log("요구사항 조회 api");
        const response = await api.get(`/workspaces/${workspaceId}/requirements`);
        console.log("요구사항 조회 :", response);
        return response.data;
    } catch (error: any) {
        console.error("🔴 [getrequirement] 요구사항 조회 실패:", error);

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
}

//요구사항 명세서 ai추천
export const Requirementgenerate = async (workspaceId: number, requirements: setrequire[]): Promise<ApiResponse<getrequire[]>> => {
    try {
        console.log("요구사항 ai추천 api");
        const response = await api.post(`/workspaces/${workspaceId}/requirements/generate`, {
            requirements,
        });
        console.log("요구사항 ai추천 :", response);
        return response.data;
    } catch (error: any) {
        console.error("🔴 [Requirementgenerate] 요구사항 ai추천 실패:", error);

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
}