import React, { useState } from "react";
import "./InviteModal.css";

interface InviteModalProps {
  onClose: () => void;
}

const InviteModal = ({ onClose }: InviteModalProps) => {
  const [emails, setEmails] = useState<string[]>([]);

  const [inputValue, setInputValue] = useState("");
  const [role, setRole] = useState("멤버");

  //  키보드 입력(Enter)을 감지하여 이메일을 추가하는 함수
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === " ") && inputValue.trim() !== "") {
      e.preventDefault();

      if (inputValue.includes("@")) {
        setEmails([...emails, inputValue.trim()]);

        setInputValue("");
      } else {
        // 유효하지 않은 형식일 경우 사용자에게 알림
        alert("유효한 이메일 형식을 입력해주세요.");
      }
    }
  };

  const removeEmail = (index: number) => {
    setEmails(emails.filter((_, i) => i !== index));
  };

  const handleInviteClick = () => {
    // 추가된 이메일이 하나 이상 있을 때만 실행
    if (emails.length > 0) {
      console.log("초대할 이메일들:", emails);
      console.log("선택한 역할:", role);
      // 여기에 실제 서버로 초대 요청을 보내는 API 호출 코드를 작성합니다.

      // 초대 후 모달을 닫거나, 이메일 목록을 초기화 할 수 있습니다.
      // 예: onClose();
    } else {
      alert("초대할 이메일을 하나 이상 추가해주세요.");
    }
  };

  return (
    <div className="invite-modal-container">
      <div className="invite-modal-header">
        <p>팀원 초대</p>{" "}
        <button
          type="button"
          className="invite-modal-close-btn"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#000000"
          >
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </svg>
        </button>
      </div>

      <div className="invite-modal-content">
        <div className="form-group">
          <p>이메일</p>

          <div className="email-input-box">
            {emails.map((email, index) => (
              <div key={index} className="email-tag">
                <span>{email}</span>

                <button onClick={() => removeEmail(index)}>x</button>
              </div>
            ))}

            <input
              type="email"
              placeholder="이메일 입력 후 Enter"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        <div className="form-group">
          <p>역할</p>

          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="멤버">멤버</option>
            <option value="관리자">관리자</option>
          </select>
        </div>
      </div>

      <div className="invite-modal-footer">
        <button
          type="button"
          className="invite-submit-btn"
          onClick={handleInviteClick}
        >
          초대하기
        </button>
      </div>
    </div>
  );
};

export default InviteModal;
