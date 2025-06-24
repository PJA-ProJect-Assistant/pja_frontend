import React, { useEffect, useState } from "react";
import "./NotifyTabComp.css";
import signbellIcon from "../../assets/img/signbell.png";
import NotifyItem from "./NotifyItem";
import axios from "axios";
import api from "../../lib/axios";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

interface Notification {
  notificationId: number;
  message: string;
  createdAt: string;
  actionPostId: number;
  read: boolean;
}

const NotifyTabComp = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const selectedWS = useSelector(
    (state: RootState) => state.workspace.selectedWS
  );
  const workspaceId = selectedWS?.workspaceId;
  console.log("workspaceId 는 ", workspaceId);

  useEffect(() => {
    fetchNotifications();

    const accessToken = localStorage.getItem("accessToken");
    console.log("accessToken: ", accessToken);
    
    // SSE 연결
    const eventSource = new EventSource(
      `https://pja-server.kr/api/workspaces/${workspaceId}/noti/subscribe?token=${accessToken}`,
    );

    eventSource.addEventListener("connect", (e) => {
      console.log("SSE 연결 성공:", e);
    });

    eventSource.addEventListener("notification", (e) => {
      const data: Notification = JSON.parse(e.data);
      setNotifications((prev) => [data, ...prev]);
    });

    eventSource.onerror = (err) => {
      console.error("SSE 오류 발생:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const fetchNotifications = async () => {
    try {
          const accessToken = localStorage.getItem("accessToken");
          const headers = {
            Authorization: `Bearer ${accessToken}`
          };
          const response = await api.get(
            `/workspaces/${workspaceId}/members`,
            { headers }            
          );
          setNotifications(response.data.data);
    } catch (err) {
      console.error("알림 조회 실패:", err);
    }
  };

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
