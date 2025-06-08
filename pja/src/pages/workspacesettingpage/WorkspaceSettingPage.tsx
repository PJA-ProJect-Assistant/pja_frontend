import React, { useState } from "react";
import "./WorkspaceSettingPage.css";

const WorkspaceSettingPage: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [teamname, setTeamName] = useState<string>("");
  const [visibility, setVisibility] = useState<string>("");

  const handleNameChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setName(event.target.value);

  const handleTeamNameChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setTeamName(event.target.value);

  const handleVisibilityChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setVisibility(event.target.value);

  const handleClearName = () => setName("");
  const handleClearTeamName = () => setTeamName("");

  return (
    <div>
      <div className="workspacesetting-wrapper">
        <h1 className="workspacesetting-title">설정</h1>
        <div className="underline" />
        <div className="workspacesetting-content">
          <div className="workspacesetting-input-section">
            <div className="workspacesetting-input-wrapper">
              <div className="workspace-name-title">워크스페이스 이름</div>
              <input
                type="text"
                className="workspace-name-input"
                placeholder="이름"
                value={name}
                onChange={handleNameChange}
              />
              {name && (
                <button
                  type="button"
                  onClick={handleClearName}
                  className="workspace-clear-icon"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M15 9l-6 6" />
                    <path d="M9 9l6 6" />
                  </svg>
                </button>
              )}
            </div>
            <div className="workpspacesetting-teamname-input-wrapper">
              <div className="workspace-teamname-title">팀 이름</div>
              <input
                type="text"
                className="workspace-teamname-input"
                placeholder="팀 이름"
                value={teamname}
                onChange={handleTeamNameChange}
              />
              {teamname && (
                <button
                  type="button"
                  onClick={handleClearTeamName}
                  className="workspace-team-clear-icon"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M15 9l-6 6" />
                    <path d="M9 9l6 6" />
                  </svg>
                </button>
              )}
            </div>
            <div className="workspacesetting-public-wrapper">
              <div className="workspacesetting-pulic-title">공개설정</div>
              <select
                className="workspace-visibility-select"
                value={visibility}
                onChange={handleVisibilityChange}
              >
                <option value="public">public</option>
                <option value="private">private</option>
              </select>
            </div>
            <div className="workspacesetting-button-wrapper">
              <button className="workspace-save-button">변경하기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceSettingPage;
