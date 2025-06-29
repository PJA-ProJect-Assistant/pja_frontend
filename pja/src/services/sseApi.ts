import type { Notification } from "./notiApi";

export const subscribeNotificationSSE = (
  workspaceId: number | string,
  onMessage: (data: Notification) => void,
  onError?: (e: Event) => void
) => {
  const accessToken = localStorage.getItem("accessToken");

  const eventSource = new EventSource(
    `https://api.pja.kr/api/workspaces/${workspaceId}/noti/subscribe?token=${accessToken}`
  );

  eventSource.addEventListener("connect", (e) => {
    console.log("SSE 연결 성공:", e);
  });

  eventSource.addEventListener("notification", (e) => {
    const data: Notification = JSON.parse(e.data);
    onMessage(data);
  });

  eventSource.onerror = (err) => {
    console.error("SSE 오류 발생:", err);
    eventSource.close();
    if (onError) {
      onError(err);
    }
  };

  return eventSource;
};
