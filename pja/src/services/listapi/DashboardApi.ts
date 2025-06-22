import api from "../../lib/axios";
import type { ApiResponse } from "../../types/common";
import type { myActionList, myProgress } from "../../types/list";

//내 진행률 가져오기
export const getMyPg = async (
    workspaceId: number,
): Promise<ApiResponse<myProgress>> => {
    try {
        console.log("내 진행률 가져오기 api");
        const response = await api.get(
            `/workspaces/${workspaceId}/project/my-progress`
        );
        console.log("내 진행률 :", response);
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
    workspaceId: number,
): Promise<ApiResponse<myActionList[]>> => {
    try {
        console.log("내 액션리스트 가져오기 api");
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