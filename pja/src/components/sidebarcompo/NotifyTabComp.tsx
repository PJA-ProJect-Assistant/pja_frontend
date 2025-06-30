import { useEffect } from "react";
import "./NotifyTabComp.css";
import NotifyItem from "./NotifyItem";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { subscribeNotificationSSE } from "../../services/sseApi";
import {
  getNotifications,
  readNotification,
  deleteNotification,
} from "../../services/notiApi";
import type { Notification } from "../../services/notiApi";

interface NotifyTabCompProps {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  setIsNoti: React.Dispatch<React.SetStateAction<boolean>>;
}

const NotifyTabComp = ({
  notifications,
  setNotifications,
  setIsNoti,
}: NotifyTabCompProps) => {
  const selectedWS = useSelector(
    (state: RootState) => state.workspace.selectedWS
  );
  const workspaceId = selectedWS?.workspaceId;

  useEffect(() => {
    if (!workspaceId) return;

    const eventSource = subscribeNotificationSSE(workspaceId, (newNoti) => {
      setNotifications((prev) => [newNoti, ...prev]);
    });

    return () => eventSource.close();
  }, [workspaceId, setNotifications]);

  useEffect(() => {
    if (!workspaceId) return;

    const fetchData = async () => {
      try {
        const notiList = await getNotifications(workspaceId);
        setNotifications(notiList);
      } catch (error) {
        console.error("알림 목록 불러오기 실패", error);
      }
    };

    fetchData();

    const eventSource = subscribeNotificationSSE(workspaceId, (newNoti) => {
      setNotifications((prev) => [newNoti, ...prev]);
    });

    return () => {
      eventSource.close();
    };
  }, [workspaceId]);

  const handleRead = async (notiId: number) => {
    if (!workspaceId) return;
    try {
      await readNotification(workspaceId, notiId);
      setNotifications((prev) => {
        const updated = prev.map((n) =>
          n.notificationId === notiId ? { ...n, read: true } : n
        );

        // 모든 알림이 읽혔는지 확인
        const allRead = updated.every((n) => n.read);
        if (allRead) {
          setIsNoti(false); // 모든 알림이 읽혔다면 알림 표시 끄기
        }

        return updated;
      });
    } catch (error) {
      console.error("개별 알림 읽음 처리 실패", error);
    }
  };

  const handleDelete = async (notiId: number) => {
    if (!workspaceId) return;
    try {
      await deleteNotification(workspaceId, notiId);
      setNotifications((prev) => {
        const updated = prev.filter((n) => n.notificationId !== notiId);

        // 모든 알림이 읽혔는지 확인
        const allRead = updated.every((n) => n.read);
        if (allRead) {
          setIsNoti(false); // 모든 알림이 읽혔다면 알림 표시 끄기
        }

        return updated;
      });
    } catch (error) {
      console.error("개별 알림 삭제 실패", error);
    }
  };

  return (
    <>
      <div className="notify-list-container">
        <svg
          className="notify-bell-icon"
          xmlns="http://www.w3.org/2000/svg"
          height="43px"
          viewBox="0 -960 960 960"
          width="43px"
          fill="#000000"
        >
          <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
        </svg>
        {notifications.map((noti) => (
          <NotifyItem
            key={noti.notificationId}
            message={noti.message}
            noti={noti}
            onRead={handleRead}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </>
  );
};

export default NotifyTabComp;
