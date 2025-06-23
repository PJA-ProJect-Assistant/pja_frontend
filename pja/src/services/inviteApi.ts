import api from "../lib/axios";
import type { ApiResponse } from "../types/common";
import type { InviteRequest, InviteSuccessData } from "../types/invite";
import { AxiosError } from "axios";
// 초대 정보 조회 응답 데이터 타입
export interface InviteInfo {
  workspaceId: number;
  projectName: string;
  teamName: string;
  ownerName: string;
  role: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
}

// 초대 수락/거절 응답 데이터 타입
export interface AcceptDeclineResponse {
  workspaceId: number;
  invitedEmail: string;
  role: string;
}

// 초대 수락/거절 응답의 data 필드 타입
export interface AcceptDeclineResponseData {
  workspaceId: number;
  invitedEmail: string;
  role: string;
}

export interface AcceptInvitationSuccessResponse {
  status: "success";
  message: string;
  data: AcceptDeclineResponseData;
}

export interface DeclineInvitationSuccessResponse {
  status: "success";
  message: string;
  data: AcceptDeclineResponseData;
}

// const handleResponse = async (response: Response) => {
//   const result = await response.json();
//   if (!response.ok) {
//     throw new Error(result.message || "알 수 없는 오류가 발생했습니다.");
//   }
//   return result;
// };

export const getInvitationInfo = async (
  token: string,
  accessToken: string
): Promise<InviteInfo> => {
  try {
    const response = await api.get(`/invitations?token=${token}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data.data;
  } catch (error: any) {
    // axios 에러 객체는 response.data.message에 서버 에러 메시지를 포함하는 경우가 많습니다.
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "알 수 없는 오류가 발생했습니다.";
    throw new Error(errorMessage);
  }
};

export const acceptInvitation = async (
  token: string,
  accessToken: string
): Promise<AcceptInvitationSuccessResponse> => {
  try {
    const response = await api.patch(`/invitations/${token}/accept`, null, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "알 수 없는 오류가 발생했습니다.";
    throw new Error(errorMessage);
  }
};

export const declineInvitation = async (
  token: string,
  accessToken: string
): Promise<DeclineInvitationSuccessResponse> => {
  try {
    const response = await api.patch(`/invitations/${token}/decline`, null, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "알 수 없는 오류가 발생했습니다.";
    throw new Error(errorMessage);
  }
};

//멤버 초대
export const inviteMembersToWorkspace = async (
  workspaceId: number,
  data: InviteRequest
) => {
  try {
    const response = await api.post<ApiResponse<InviteSuccessData>>(
      `/workspaces/${workspaceId}/invite`,
      data // 요청 Body
    );
    return response.data; // 성공 시 응답 데이터 반환
  } catch (error) {
    // Axios 에러인 경우, 서버에서 보낸 에러 메시지를 포함하여 에러를 다시 던집니다.
    if (error instanceof AxiosError && error.response) {
      throw error.response.data;
    }
    // 그 외의 에러 처리
    throw new Error("An unexpected error occurred");
  }
};
