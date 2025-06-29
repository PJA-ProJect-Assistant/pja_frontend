import { useEffect, useState } from "react";
import "./NotifyTabComp.css";
import signbellIcon from "../../assets/img/signbell.png";
import NotifyItem from "./NotifyItem";
import api from "../../lib/axios";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { subscribeNotificationSSE } from "../../services/sseApi";
import { getNotifications } from "../../services/notiApi";
import type { Notification } from "../../services/notiApi";

const NotifyTabComp = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const selectedWS = useSelector(
    (state: RootState) => state.workspace.selectedWS
  );
  const workspaceId = selectedWS?.workspaceId;
  console.log("workspaceId 는 ", workspaceId);

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

    const eventSource = subscribeNotificationSSE(
      workspaceId,
      (newNoti) => {
        setNotifications((prev) => [newNoti, ...prev]);
      }
    );

    return () => {
      eventSource.close();
    };
  }, [workspaceId]);

  return (
    <>
      <div className="notify-list-container">
        <img src={signbellIcon} alt="알람" className="notify-bell-icon" />
        {notifications.map((noti) => (
          <NotifyItem key={noti.notificationId} message={noti.message} />
        ))}
      </div>
    </>
  );
};

export default NotifyTabComp;
