import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import "./ProgressStep.css"
import { useNavigate } from "react-router-dom";
import { StepRestrictionModal } from "../modal/WsmenuModal";
import { useState } from "react";
import { WscompleteModal } from "../modal/WsmenuModal";
import { setSelectedWS } from "../../store/workspaceSlice";

export default function ProgressStep() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const selectedWS = useSelector(
        (state: RootState) => state.workspace.selectedWS
    );
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [completeModalOpen, setCompleteModalOpen] = useState<boolean>(false);
    const handleStepClick = (step: number) => {
        if (step === 5) {
            if (selectedWS?.progress_step === step) {
                dispatch(setSelectedWS({ ...selectedWS, progress_step: 6 }))
                navigate(`/ws/${selectedWS?.workspace_id}/step/${step}`);
            }
            else if (selectedWS?.progress_step == 6) {

            }
            else setCompleteModalOpen(true);
        }
        else if (typeof selectedWS?.progress_step === "number" && step <= selectedWS.progress_step) {
            navigate(`/ws/${selectedWS?.workspace_id}/step/${step}`);
        }
        else setModalOpen(true);
    };
    console.log({ selectedWS })
    const steps = [
        "아이디어 결정",
        "요구사항 명세서 작성",
        "ERD 생성",
        "API 명세서 작성",
        "프로젝트 진행",
        "프로젝트 완료",
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
                            if (index < (selectedWS?.progress_step ?? 0)) {
                                barClass += " filled";
                            } else if (index === (selectedWS?.progress_step ?? 0)) {
                                barClass += " gradient";
                            }

                            return <div key={index} className={barClass}></div>;
                        })}
                    </div>
                    <div className="bar-labels">
                        {steps.map((label, index) => (
                            <div key={index} className="bar-label" onClick={() => {
                                handleStepClick(index);
                            }}>
                                {label}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {modalOpen && <StepRestrictionModal onClose={() => setModalOpen(false)} />}
            {completeModalOpen && <WscompleteModal onClose={() => setCompleteModalOpen(false)} />}
        </>
    );
}