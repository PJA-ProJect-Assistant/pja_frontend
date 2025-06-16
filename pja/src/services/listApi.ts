import api from "../lib/axios";
import type { ApiResponse } from "../types/common";
import type { listresponse } from "../types/list";
//리스트페이지 관련 api

// 프로젝트 진행 전체 정보
export const getlist = async (workspaceId: number): Promise<ApiResponse<listresponse>> => {
    try {
        console.log("프로젝트 진행 전체 정보 api");
        const response = await api.get(`/workspaces/${workspaceId}/project/progress`);
        console.log("프로젝트 진행 전체 정보 :", response);
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
}

//카테고리 관련 api
//카테고리 생성 -> 생성된 카테고리 기본키 반환
export const addcategory = async (workspaceId: number, name: string): Promise<ApiResponse<number>> => {
    try {
        console.log("카테고리 생성 api");
        const response = await api.post(`/workspaces/${workspaceId}project/category`, {
            name,
            state: false,
            hasTest: false,
        });
        console.log("카테고리 생성 :", response);
        return response.data;
    } catch (error: any) {
        console.error("🔴 [addcategory] 카테고리 생성 실패:", error);

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




//기능 생성 -> 생성된 기능 기본키 반환
export const addfeature = async (workspaceId: number, categoryId: number, name: string): Promise<ApiResponse<number>> => {
    try {
        console.log("기능 생성 api");
        const response = await api.post(`/workspaces/${workspaceId}/project/category/${categoryId}/feature`, {
            name,
            state: false,
            hasTest: false,
        });
        console.log("기능 생성 :", response);
        return response.data;
    } catch (error: any) {
        console.error("🔴 [addfeature] 기능 생성 실패:", error);

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

//액션 생성 -> 생성된 액션 기본키 반환
export const addAction = async (workspaceId: number, categoryId: number, featureId: number, name: string): Promise<ApiResponse<number>> => {
    try {
        console.log("액션 생성 api");
        const response = await api.post(`/workspaces/${workspaceId}/project/category/${categoryId}/feature/${featureId}/action`, {
            name,
            startDate: "",
            endDate: "",
            state: "BEFORE",
            hasTest: false,
            importance: 0,
            participantsId: [],
        });
        console.log("액션 생성 :", response);
        return response.data;
    } catch (error: any) {
        console.error("🔴 [addAction] 액션 생성 실패:", error);

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