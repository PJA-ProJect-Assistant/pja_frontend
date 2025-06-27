import React, { useState } from "react";
import "./InviteModal.css";
import { inviteMembersToWorkspace } from "../../services/inviteApi";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import type { InviteRequest } from "../../types/invite";
interface InviteModalProps {
  onClose: () => void;
}

const InviteModal = ({ onClose }: InviteModalProps) => {
  const [emails, setEmails] = useState<string[]>([]);

  const [inputValue, setInputValue] = useState("");
  const [role, setRole] = useState("멤버");
  const [isLoading, setIsLoading] = useState(false);

  const selectedWS = useSelector(
    (state: RootState) => state.workspace.selectedWS
  );

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

  const handleInviteClick = async () => {
    if (!selectedWS || !selectedWS.workspaceId) {
      alert("워크스페이스 정보가 없습니다. 다시 시도해 주세요.");
      return;
    }
    if (emails.length === 0) {
      alert("초대할 이메일을 하나 이상 추가해주세요.");
      return;
    }
    if (isLoading) return;

    setIsLoading(true);

    const apiRole = role === "멤버" ? "MEMBER" : "GUEST";

    const requestData: InviteRequest = {
      emails: emails,
      role: apiRole,
    };

    try {
      const response = await inviteMembersToWorkspace(
        selectedWS.workspaceId,
        requestData
      );

      // inviteMembersToWorkspace 함수는 성공 시 response.data를 반환하도록 설계되었습니다.
      alert(response.message);
      onClose();
    } catch (error: any) {
      // inviteApi.ts에서 던진(throw) 에러를 여기서 잡습니다.
      if (error && error.message) {
        alert(error.message);
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
      console.error("API Error:", error);
    } finally {
      setIsLoading(false);
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
            <option value="게스트">게스트</option>
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
