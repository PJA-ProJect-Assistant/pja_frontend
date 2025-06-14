import { useDispatch, useSelector } from "react-redux";
import "./ProjectSummaryPage.css";
import type { RootState } from "../../../store/store";
import { setSelectedWS } from "../../../store/workspaceSlice";
import { useNavigate } from "react-router-dom";
import { getStepIdFromNumber } from "../../../utils/projectSteps";

export default function ProjectSummaryPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedWS = useSelector(
    (state: RootState) => state.workspace.selectedWS
  );
  const handleSummaryComplete = () => {
    if (selectedWS) {
      dispatch(
        setSelectedWS({
          ...selectedWS,
          progressStep: "3",
        })
      );
      navigate(
        `/ws/${selectedWS?.workspaceId}/step/${getStepIdFromNumber(
          selectedWS?.progressStep
        )}`
      );
    }
  };
  return (
    <div className="ideasummary-container">
      {selectedWS?.progressStep === "2" && (
        <h2>✨입력하신 프로젝트를 요약하였어요</h2>
      )}
      <div className="ideasummary-box">
        <div className="ideasummary-content">
          <p>프로젝트명 : </p>
          <p>서비스 대상 :</p>
          <p>확정된 기술 스택:</p>
          <p>
            메인 기능
            <ul>
              {/* {selectedWS?.project_features &&
                JSON.parse(selectedWS.project_features).map(
                  (feature: string, index: number) => (
                    <li key={index}>{feature}</li>
                  )
                )} */}
            </ul>
          </p>
        </div>
        <div className="ideasummary-btn">
          <button>수정하기</button>
          {selectedWS?.progressStep === "2" && (
            <button onClick={handleSummaryComplete}>완료하기</button>
          )}
        </div>
      </div>
    </div>
  );
}
