import { useNavigate } from "react-router-dom";
import "./AddWSPage.css";
import { useState } from "react";

export default function AddWSTeam() {
  const navi = useNavigate();

  const [emailInput, setEmailInput] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [role, setRole] = useState("ROLE_USER");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const value = emailInput.trim();

      // 이메일 유효성 검증
      if (emailRegex.test(value)) {
        if (!emails.includes(value)) {
          setEmails([...emails, value]); // 이메일 추가
        }
        setEmailInput(""); // 입력창 초기화
      }
    }
  };
  return (
    <div className="addws-container">
      <div className="addws-box">
        <div className="addws-title">
          <p>팀원 초대</p>
          <div></div>
        </div>
        <div className="addws-content">
          <div>
            <p>이메일</p>
            <div className="addws-email">
              <div className="invited-members">
                {emails.map((email, index) => (
                  <div key={index} className="invited-member-email">
                    <p>{email}</p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="15px"
                      viewBox="0 -960 960 960"
                      width="15px"
                      fill="#FFFFFF"
                      className="delete-email-btn"
                      onClick={() => {
                        setEmails(emails.filter((_, i) => i !== index));
                      }}
                    >
                      <path d="m291-240-51-51 189-189-189-189 51-51 189 189 189-189 51 51-189 189 189 189-51 51-189-189-189 189Z" />
                    </svg>
                  </div>
                ))}
              </div>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="초대할 팀원의 이메일"
              />
            </div>
          </div>
          <div>
            <p>역할</p>
            <select
              className="addws-content-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="ROLE_USER">멤버</option>
              <option value="ROLE_GUEST">게스트</option>
            </select>
          </div>
        </div>
        <div className="addws-btn-container">
          <button
            onClick={() => navi("/ws")}
            disabled={emails.length === 0}
            className={emails.length > 0 ? "addws-btn1" : "addws-btn2"}
          >
            초대하기
          </button>
          <button onClick={() => navi("/ws")} className="addws-btn2">
            넘어가기
          </button>
        </div>
      </div>
    </div>
  );
}
