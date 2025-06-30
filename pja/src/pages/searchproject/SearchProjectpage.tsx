import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getworkspace } from "../../services/workspaceApi";
import { WSHeader } from "../../components/header/WSHeader";
import { getSimilarProject } from "../../services/projectApi";
import type { similarproject } from "../../types/project";
import { getStepIdFromNumber } from "../../utils/projectSteps";
import "./SearchProjectpage.css";

export default function SearchProjectpage() {
  const { wsid } = useParams<{
    wsid: string;
  }>();
  const navigate = useNavigate();
  const [wsName, setWsName] = useState<string>("");
  const [similarProject, setSimilarProject] = useState<similarproject[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getws = async () => {
      try {
        const response = await getworkspace(Number(wsid));
        console.log("getworkspace 결과 : ", response);
        setWsName(response.data?.projectName ?? "");
      } catch (err) {
        console.log("getworkspace 실패 : ", err);
      }
    };
    const getsimilarpj = async () => {
      try {
        setIsLoading(true);
        const response = await getSimilarProject(Number(wsid));
        setSimilarProject(response.data ?? []);
      } catch {
        console.log("유사 프로젝트 조회 실패");
      } finally {
        setIsLoading(false);
      }
    };
    getws();
    getsimilarpj();
  }, [wsid]);

  const renderCards = (data: similarproject[]) =>
    data
      .filter((dt) => dt.isPublic === true)
      .map((ws) => (
        <div
          key={ws.workspaceId}
          className="similarworkspace-card"
          onDoubleClick={() => {
            const stepId = getStepIdFromNumber(ws.progressStep);
            navigate(`/ws/${ws.workspaceId}/${stepId}`);
          }}
        >
          <div className="similarws-title-container">
            <p className="similarworkspace-title" title={ws.projectName}>
              {/* 마우스 가져다대면 title뜨는거 기본인데 나중에 시간 남으면 커스텀 해보기로! */}
              {ws.isPublic ? "" : "🔒"}
              {ws.projectName}
            </p>
          </div>
          <div className="similarworkspace-team">
            <p>{ws.teamName}</p>
          </div>
        </div>
      ));

  return (
    <div className="searchpj-container">
      <WSHeader title={`${wsName}의 유사 프로젝트`} />
      <div className="searchpj-content">
        {similarProject.length > 0 ? (
          <>{renderCards(similarProject)}</>
        ) : (
          <div>유사 프로젝트가 없습니다</div>
        )}
      </div>
    </div>
  );
}
