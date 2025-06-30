import api from "../lib/axios";
import type { ApiResponse } from "../types/common";

export interface Notification {
  notificationId: number;
  message: string;
  createdAt: string;
  actionPostId: number;
  actionId: number;
  read: boolean;
}

// 알림 목록 조회
export const getNotifications = async (
  workspaceId: number
): Promise<Notification[]> => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await api.get(`/workspaces/${workspaceId}/noti`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("알림 조회 실패:", error);
    throw error;
  }
};

// 알림 전체 읽음 처리
export const readAllNotifications = async (
  workspaceId: number
): Promise<void> => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await api.patch(`/workspaces/${workspaceId}/noti`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.data.status !== "success") {
      throw new Error(response.data.message || "알림 전체 읽음 처리 실패");
    }

    console.log("모든 알림을 읽음 처리 완료");

  } catch (error) {
    console.error("알림 전체 읽음 처리 실패:", error);
    throw error;
  }
}

// 알림 개별 읽음 처리
export const readNotification = async (
  workspaceId: number,
  notiId: number
): Promise<void> => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await api.patch(`/workspaces/${workspaceId}/noti/${notiId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.data.status !== "success") {
      throw new Error(response.data.message || "알림 개별 읽음 처리 실패");
    }

    console.log("개별 알림을 읽음 처리 완료");

  } catch (error) {
    console.error("알림 개별 읽음 처리 실패:", error);
    throw error;
  }
}

// 알림 전체 삭제 처리
export const deleteAllNotifications = async (
  workspaceId: number
): Promise<void> => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await api.delete(`/workspaces/${workspaceId}/noti`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.data.status !== "success") {
      throw new Error(response.data.message || "알림 전체 삭제 실패");
    }

    console.log("모든 알림을 삭제 완료");

  } catch (error) {
    console.error("알림 전체 삭제 실패:", error);
    throw error;
  }
}

// 알림 개별 삭제 처리
export const deleteNotification = async (
  workspaceId: number,
  notiId: number
): Promise<void> => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await api.delete(`/workspaces/${workspaceId}/noti/${notiId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.data.status !== "success") {
      throw new Error(response.data.message || "알림 개별 삭제 실패");
    }

    console.log("개별 알림을 삭제 완료");

  } catch (error) {
    console.error("알림 개별 삭제 실패:", error);
    throw error;
  }
}

// 알림 읽음여부 
export const notreadNotification = async (
  workspaceId: number,
): Promise<ApiResponse<boolean>> => {
  try {
    const response = await api.get(`/workspaces/${workspaceId}/not-read-noti`);

    return response.data;

  } catch (error) {
    console.error("알림 읽음 여부 조회 실패:", error);
    throw error;
  }
}
