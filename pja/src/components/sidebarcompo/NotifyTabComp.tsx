import React from "react";
import "./NotifyTabComp.css";

import signbellIcon from "../../assets/img/signbell.png";
import NotifyItem from "./NotifyItem";
const NotifyTabComp = () => {
  const notifications = [
    //실제 api 로 받아온 데이터 넣기
    { id: 1, message: "민정님이 유민님을 초대하였습니다." },
    { id: 2, message: "채빈님이 소현님을 초대하였습니다." },
  ];

  return (
    <>
      <div className="notify-list-container">
        <img src={signbellIcon} alt="알람" className="notify-bell-icon" />
        {notifications.map((noti) => (
          <NotifyItem key={noti.id} message={noti.message} />
        ))}
      </div>
    </>
  );
};

export default NotifyTabComp;
