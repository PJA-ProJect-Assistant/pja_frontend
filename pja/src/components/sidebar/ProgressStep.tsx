import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import "./ProgressStep.css";
import { useNavigate } from "react-router-dom";
import { BasicModal } from "../modal/BasicModal";
import { useState } from "react";
import { getStepIdFromNumber } from "../../utils/projectSteps";
import type { Status } from "../../types/list";

export default function ProgressStep() {
  const navigate = useNavigate();
  const selectedWS = useSelector(
    (state: RootState) => state.workspace.selectedWS
  );
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const handleStepClick = (step: Status) => {
    if (Number(step) <= Number(selectedWS?.progressStep)) {
      navigate(`/ws/${selectedWS?.workspaceId}/${getStepIdFromNumber(step)}`);
    } else setModalOpen(true);
  };
  const steps = [
    "아이디어 작성",
    "요구사항 명세서 작성",
    "프로젝트 정보",
    "ERD 생성",
    "API 명세서 작성",
    "프로젝트 진행",
  ];
  return (
    <>
      <div className="progress-container">
        <h3>프로젝트 진행 상황</h3>
        <div className="progressbar-container">
          <div className="bar-container">
            {steps.map((_, index) => {
              let barClass = "bar";
              if (index === 0) barClass += " top";
              if (index === steps.length - 1) barClass += " bottom";
              if (index < Number(selectedWS?.progressStep)) {
                barClass += " filled";
              } else if (index === Number(selectedWS?.progressStep)) {
                barClass += " gradient";
              }

              return <div key={index} className={barClass}></div>;
            })}
          </div>
          <div className="bar-labels">
            {steps.map((label, index) => (
              <div
                key={index}
                className="bar-label"
                onClick={() => {
                  handleStepClick(index.toString() as Status);
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
      {modalOpen && (
        <BasicModal
          modalTitle="이동이 불가능합니다"
          modalDescription="이전 단계를 모두 완료한 후 이동 가능합니다"
          Close={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
