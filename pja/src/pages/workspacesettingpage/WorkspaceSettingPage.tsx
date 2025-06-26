import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import {
  getworkspace,
  updateWorkspace,
} from "../../services/workspaceSettingApi";
import type { UpdateWorkspacePayload } from "../../types/workspace";
import "./WorkspaceSettingPage.css";
import { SettingHeader } from "../../components/header/SettingHeader";
//  GitHub URL 유효성 검사 함수
const isValidGitHubUrl = (url: string): boolean => {
  // URL이 비어있으면 유효한 것으로 간주 (필수 입력이 아닐 경우)
  if (!url) {
    return true;
  }
  // GitHub URL 정규표현식
  const regex = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+(?:.git)?\/?$/;
  return regex.test(url);
};

export function WorkspaceSettingPage() {
  const selectedWS = useSelector(
    (state: RootState) => state.workspace.selectedWS
  );
  const navigate = useNavigate();

  const [projectName, setProjectName] = useState<string>("");
  const [teamName, setTeamName] = useState<string>("");
  const [visibility, setVisibility] = useState<string>("public");
  const [githubUrl, setGithubUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [githubUrlError, setGithubUrlError] = useState<string>("");

  useEffect(() => {
    if (!selectedWS) {
      alert(
        "선택된 워크스페이스가 없습니다. 워크스페이스를 먼저 선택해주세요."
      );
      navigate("/");
      return;
    }

    const getWorkspaceData = async () => {
      try {
        const response = await getworkspace(selectedWS.workspaceId);
        if (response.data) {
          const wsData = response.data;
          setProjectName(wsData.projectName);
          setTeamName(wsData.teamName);
          setGithubUrl(wsData.githubUrl || "");
          setVisibility(wsData.isPublic ? "public" : "private");
        } else {
          // data 필드가 없는 예외적인 경우에 대한 처리
          throw new Error("API 응답에 데이터가 없습니다.");
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          "워크스페이스 정보를 불러오는 데 실패했습니다.";
        alert(errorMessage);
        navigate(-1);
      }
    };

    getWorkspaceData();
  }, [selectedWS, navigate]);

  const handleSubmit = async () => {
    // ✅ 3. 제출 전 유효성 검사 로직 추가
    if (!isValidGitHubUrl(githubUrl)) {
      setGithubUrlError("올바른 GitHub 저장소 URL을 입력해주세요.");
      alert("입력한 GitHub 주소 형식이 올바르지 않습니다.");
      return; // 유효하지 않으면 API 호출 중단
    }

    if (!selectedWS || !selectedWS.workspaceId) {
      alert("워크스페이스 정보가 없습니다. 다시 시도해 주세요.");
      return;
    }

    const payload: UpdateWorkspacePayload = {
      projectName,
      teamName,
      isPublic: visibility === "public",
      githubUrl,
    };

    setIsLoading(true);

    try {
      const response = await updateWorkspace(selectedWS.workspaceId, payload);
      alert(response.message || "성공적으로 변경되었습니다.");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "변경 중 오류가 발생했습니다.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  //  GitHub URL 입력 시 실시간으로 유효성 검사
  const handleGithubChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = event.target.value;
    setGithubUrl(newUrl);

    if (isValidGitHubUrl(newUrl)) {
      // 유효하면 에러 메시지 제거
      setGithubUrlError("");
    } else {
      // 유효하지 않으면 에러 메시지 설정
      setGithubUrlError(
        "올바른 GitHub 저장소 URL을 입력해주세요. (예: https://github.com/user/repo)"
      );
    }
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setProjectName(event.target.value);
  const handleTeamNameChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setTeamName(event.target.value);

  const handleVisibilityChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => setVisibility(event.target.value);

  const handleClearName = () => setProjectName("");
  const handleClearTeamName = () => setTeamName("");
  const handleClearGithubUrl = () => {
    setGithubUrl("");
    setGithubUrlError("");
  };

  if (!selectedWS) {
    return <div>워크스페이스 정보를 불러오는 중...</div>;
  }

  return (
    <div>
      <div className="workspacesetting-wrapper">
        <div className="workspacesetting-service-header">
          <SettingHeader />
        </div>
        <h1 className="workspacesetting-title">설정</h1>
        <div className="workspacesetting-underline" />
        <div className="workspacesetting-content">
          <div className="workspacesetting-input-section">
            <div className="workspacesetting-input-wrapper">
              <div className="workspace-name-title">워크스페이스 이름</div>
              <input
                type="text"
                className="workspace-name-input"
                placeholder="이름"
                value={projectName}
                onChange={handleNameChange}
              />
              {projectName && (
                <button
                  type="button"
                  onClick={handleClearName}
                  className="workspace-clear-icon"
                ></button>
              )}
            </div>

            <div className="workpspacesetting-teamname-input-wrapper">
              <div className="workspace-teamname-title">팀 이름</div>
              <input
                type="text"
                className="workspace-teamname-input"
                placeholder="팀 이름"
                value={teamName}
                onChange={handleTeamNameChange}
              />
              {teamName && (
                <button
                  type="button"
                  onClick={handleClearTeamName}
                  className="workspace-team-clear-icon"
                ></button>
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

            <div className="workspacesetting-Github-wrapper">
              <div className="workspacesetting-Github-title">Github 주소</div>
              <input
                type="text"
                className={`workspace-Github-input ${
                  githubUrlError ? "input-error" : ""
                }`}
                placeholder="https://github.com/user/repository"
                value={githubUrl}
                onChange={handleGithubChange}
              />
              {githubUrl && (
                <button
                  type="button"
                  onClick={handleClearGithubUrl}
                  className="workspace-team-clear-icon"
                ></button>
              )}

              {githubUrlError && (
                <p className="error-message">{githubUrlError}</p>
              )}
            </div>

            <div className="workspacesetting-button-wrapper">
              <button
                className="workspace-save-button"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? "변경 중" : "변경하기"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
