import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getworkspace } from "../../services/workspaceApi";
import { WSHeader } from "../../components/header/WSHeader";
import { getSimilarProject } from "../../services/projectApi";
import type { similarproject } from "../../types/project";
import { getStepIdFromNumber } from "../../utils/projectSteps";
import "./SearchProjectpage.css";
import { BasicModal } from "../../components/modal/BasicModal";
import { useCategoryFeatureCategory } from "../../hooks/useCategoryFeatureAction";

export default function SearchProjectpage() {
  const { wsid } = useParams<{
    wsid: string;
  }>();
  const navigate = useNavigate();
  const [wsName, setWsName] = useState<string>("");
  const [similarProject, setSimilarProject] = useState<similarproject[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { setCategoryList } = useCategoryFeatureCategory();

  useEffect(() => {
    const getws = async () => {
      try {
        const response = await getworkspace(Number(wsid));
        setWsName(response.data?.projectName ?? "");
      } catch (err) {
        console.log("getworkspace 실패 : ", err);
      }
    };
    const getsimilarpj = async () => {
      try {
        const response = await getSimilarProject(Number(wsid));
        setSimilarProject(response.data ?? []);
      } catch {
        console.log("유사 프로젝트 조회 실패");
      }
    };
    const fetchData = async () => {
      try {
        await Promise.all([getws(), getsimilarpj()]);
      } catch {
        setError("유사 프로젝트를 불러오는 데 실패했습니다");
      }
    };
    fetchData();
  }, [wsid]);

  const renderCards = (data: similarproject[]) =>
    data
      .filter((dt) => dt.isPublic === true)
      .map((ws) => (
        <div
          key={ws.workspaceId}
          className="similarworkspace-card"
          onClick={() => {
            const stepId = getStepIdFromNumber(ws.progressStep);
            setCategoryList([]);
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
      {error && (
        <BasicModal
          modalTitle={error}
          modalDescription={
            "일시적인 오류가 발생했습니다 페이지를 새로고침하거나 잠시 후 다시 시도해 주세요"
          }
          Close={() => setError("")}
        ></BasicModal>
      )}
    </div>
  );
}
