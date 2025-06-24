import "./NotifyTabComp.css";
import trashIcon from "../../assets/img/trash.png";

interface NotifyItemProps {
  message: string;
}
//message를 props로 받아서 동적으로 표시
const NotifyItem = ({ message }: NotifyItemProps) => {
  return (
    <div className="notify-tab-box">
      <span className="text-content">{message}</span>
      <img src={trashIcon} alt="알람 삭제" className="notify-trash-icon" />
    </div>
  );
};

export default NotifyItem;
