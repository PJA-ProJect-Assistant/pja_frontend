import "./AddWSPage.css";
import type { IsClose } from "../../../types/common";
import { useState } from "react";
import { addworkspace } from "../../../services/workspaceApi";
import { useNavigate } from "react-router-dom";
import { useUserData } from "../../../hooks/useUserData";

export default function AddWSName({ onClose }: IsClose) {
  const navigate = useNavigate();
  const { refetchWorkspaces } = useUserData();
  const [projectName, setProjectName] = useState<string>("");
  const [teamName, setTeamName] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(true);

  const isValid = projectName.trim() !== "" && teamName.trim() !== "";

  const handleAddWS = async () => {
    console.log("projectName", projectName);
    console.log("teamName", teamName);
    console.log("isPublic", isPublic);
    try {
      const responese = await addworkspace({ projectName, teamName, isPublic });
      console.log("워크스페이스 생성:", responese.data);
      refetchWorkspaces(); // 워크스페이스 새로고침
      onClose();
    } catch (error) {
      console.error("워크스페이스 생성 실패:", error);
    }
  };

  return (
    <div className="addws-container">
      <div className="addws-box">
        <div className="addws-title">
          <p>워크스페이스 생성</p>
          <svg
            onClick={() => navigate("/main")}
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#FFFFFF"
          >
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </svg>
        </div>
        <div className="addws-content">
          <div>
            <p>프로젝트명</p>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="프로젝트명"
              className="addws-content-input"
            />
          </div>
          <div>
            <p>팀명</p>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="팀명"
              className="addws-content-input"
            />
          </div>
          <div>
            <p>워크스페이스 공개</p>
            <select
              className="addws-content-select"
              value={isPublic.toString()}
              onChange={(e) => setIsPublic(e.target.value === "true")}
            >
              <option value="true">public</option>
              <option value="false">private</option>
            </select>
          </div>
        </div>
        <div className="addws-btn-container">
          {/* 생성하기 누르면 db에 저장 시키기! */}
          <button
            onClick={() => handleAddWS()}
            disabled={!isValid}
            className="addws-btn1"
          >
            생성하기
          </button>
        </div>
      </div>
    </div>
  );
}
