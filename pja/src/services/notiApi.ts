import api from "../lib/axios";

export interface Notification {
  notificationId: number;
  message: string;
  createdAt: string;
  actionPostId: number;
  read: boolean;
}

// 알림 목록 조회
export const getNotifications = async (
  workspaceId: number | string
): Promise<Notification[]> => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await api.get(`/workspaces/${workspaceId}/noti`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data; // 실제 데이터
  } catch (error) {
    console.error("알림 조회 실패:", error);
    throw error;
  }
};
