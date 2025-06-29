import "./NotifyTabComp.css";
import type { Notification } from "../../services/notiApi";

interface NotifyItemProps {
  message: string;
  noti: Notification;
  onRead: (notiId: number) => void;
  onDelete: (notiId: number) => void;
}
//message를 props로 받아서 동적으로 표시
const NotifyItem = ({ message, noti, onRead, onDelete }: NotifyItemProps) => {
  return (
    <div className="notify-tab-box">
      {noti.read === false && <div className="notify-notread"></div>}
      <span className="text-content">{message}</span>
      {/* 개별 읽음 버튼 */}
      <svg
        style={{ cursor: "pointer" }}
        className="notify-trash-icon"
        onClick={() => onRead(noti.notificationId)}
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#000000"
      >
        <path d="M638-80 468-250l56-56 114 114 226-226 56 56L638-80ZM480-520l320-200H160l320 200Zm0 80L160-640v400h206l80 80H160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v174l-80 80v-174L480-440Zm0 0Zm0-80Zm0 80Z" />
      </svg>

      {/* 개별 삭제 버튼 */}
      <svg
        style={{ cursor: "pointer" }}
        className="notify-trash-icon"
        onClick={() => onDelete(noti.notificationId)}
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#000000"
      >
        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
      </svg>
    </div>
  );
};

export default NotifyItem;
