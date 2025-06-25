import { useNavigate } from "react-router-dom";
import "./AddWSPage.css";
import { useState } from "react";
import { getStepIdFromNumber } from "../../../utils/projectSteps";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import axios from "axios";
import api from "../../../lib/axios";

// API 응답 데이터의 타입을 명확하게 정의합니다.
interface InviteResponse {
  status: "success" | "fail" | "error";
  message: string;
  data?: {
    workspaceId: number;
    invitedEmails: string[];
    role: string;
  };
}

export default function AddWSTeam() {
  const navigate = useNavigate();

  const selectedWS = useSelector(
    (state: RootState) => state.workspace.selectedWS
  );

  console.log("팀원 초대 컴포넌트가 사용하는 워크스페이스:", selectedWS);

  const stepId = getStepIdFromNumber(selectedWS?.progressStep ?? "0");

  const [emailInput, setEmailInput] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [workspaceRole, setWorkspaceRole] = useState("ROLE_USER");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const value = emailInput.trim();

      if (emailRegex.test(value)) {
        if (!emails.includes(value)) {
          setEmails([...emails, value]);
        }
        setEmailInput("");
      }
    }
  };

  const handleInvite = async () => {
    if (!selectedWS || !selectedWS.workspaceId || emails.length === 0) {
      alert("워크스페이스를 선택하고, 초대할 이메일을 1개 이상 입력해주세요.");

      console.error(
        "초대 요청 실패: 워크스페이스 ID가 없거나 초대할 이메일이 없습니다.",
        {
          selectedWS,
          emails,
        }
      );
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    const apiRole = workspaceRole === "ROLE_USER" ? "MEMBER" : "GUEST";

    const body = {
      emails: emails,
      role: apiRole,
    };

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    try {
      const response = await api.post<InviteResponse>(
        `/workspaces/${selectedWS.workspaceId}/invite`,
        body,
        { headers }
      );

      if (response.status === 200 && response.data.status === "success") {
        alert(response.data.message);
        // 성공 후 페이지 이동 시에도 안전하게 selectedWS.workspaceId를 사용합니다.
        navigate(`/ws/${selectedWS.workspaceId}/${stepId}`);
      } else {
        alert(
          response.data.message ||
            "초대에 성공했으나 예기치 않은 응답을 받았습니다."
        );
      }
    } catch (error: any) {
      console.error("🔴 [inputtech] 팀원 초대 API 호출 실패:", error);

      if (axios.isAxiosError(error) && error.response) {
        // 서버에서 내려준 응답이 있을 때
        console.error("응답 상태코드:", error.response.status);
        console.error("서버 응답 데이터:", error.response.data);
        console.log("✅ 백엔드 메시지:", error.response.data.message);
        const errorData = error.response.data as InviteResponse;
        const errorMessage =
          errorData.message || "알 수 없는 서버 오류가 발생했습니다.";
        alert(errorMessage);

        if (error.response.status === 401) {
          navigate("/login");
        }
      } else if (axios.isAxiosError(error) && error.request) {
        // 요청은 보냈지만 응답이 없을 때
        console.error("요청은 보냈지만 응답 없음:", error.request);
        alert("서버 응답이 없습니다. 네트워크 상태를 확인해주세요.");
      } else {
        // axios 외 다른 에러
        console.error("알 수 없는 에러 발생:", error.message);
        console.log("✅ 백엔드 메시지:", error.response.data.message);
        alert("알 수 없는 오류가 발생했습니다.");
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
              value={workspaceRole}
              onChange={(e) => setWorkspaceRole(e.target.value)}
            >
              <option value="ROLE_USER">멤버</option>
              <option value="ROLE_GUEST">게스트</option>
            </select>
          </div>
        </div>
        <div className="addws-btn-container">
          <button
            onClick={handleInvite}
            // 5. disabled 조건도 selectedWS로 통일하여 일관성을 유지합니다.
            disabled={emails.length === 0 || !selectedWS}
            className={
              emails.length > 0 && selectedWS ? "addws-btn1" : "addws-btn2"
            }
          >
            초대하기
          </button>
          <button
            onClick={() => {
              // 6. '넘어가기' 버튼도 동일한 selectedWS 변수와 안정성 검사를 사용합니다.
              if (selectedWS && selectedWS.workspaceId) {
                navigate(`/ws/${selectedWS.workspaceId}/${stepId}`);
              }
            }}
            disabled={!selectedWS}
            className="addws-btn2"
          >
            넘어가기
          </button>
        </div>
      </div>
    </div>
  );
}
