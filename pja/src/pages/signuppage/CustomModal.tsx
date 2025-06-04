import React from "react";
import "./CustomModal.css";

//Props 타입을 위한 인터페이스
interface CustomModalProps {
  message: React.ReactNode;
  onClose: () => void;
}
const CustomModal: React.FC<CustomModalProps> = ({ message, onClose }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="signup-custom-modal-overlay">
      <div className="signup-modal-content">
        <div className="signup-modal-header"></div>
        <div className="signup-custom-modal-body-text-wrapper">{message}</div>
        <button className="signup-modal-close-button" onClick={onClose}>
          확인
        </button>
      </div>
    </div>
  );
};
export default CustomModal;
