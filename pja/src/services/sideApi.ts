import api from "../lib/axios";

export const leaveWorkspace = async (workspaceId: number) => {
  try {
    const response = await api.delete(`/workspaces/${workspaceId}/leave`);
    return response.data;
  } catch (error: any) {
    console.error("워크스페이스 출처리 실패:", error);
    throw error;
  }
};
