import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "../../../store/store";
import "./IdeaSummary.css"
import { useNavigate } from "react-router-dom";
import { setSelectedWS } from "../../../store/workspaceSlice";
export default function IdeaSummary() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const selectedWS = useSelector(
        (state: RootState) => state.workspace.selectedWS
    );
    const handleIdeaComplete = () => {
        if (selectedWS?.progress_step === 0) {
            dispatch(setSelectedWS({ ...selectedWS, progress_step: 1 }))
            navigate(`/ws/${selectedWS?.workspace_id}/step/1`);
        }
    }
    return (

        <div className="ideasummary-container">
            {selectedWS?.progress_step === 0 && (
                <h2>✨입력하신 프로젝트를 요약하였어요</h2>
            )}
            <div className="ideasummary-box">
                <div className="ideasummary-content">
                    <p>프로젝트명 : {selectedWS?.project_name}</p>
                    <p>서비스 대상 : {selectedWS?.project_target}</p>
                    <p>확정된 기술 스택:</p>
                    <p>메인 기능
                        <ul>
                            {selectedWS?.project_features &&
                                JSON.parse(selectedWS.project_features).map((feature: string, index: number) => (
                                    <li key={index}>{feature}</li>
                                ))
                            }
                        </ul>
                    </p>
                </div>
                <div className="ideasummary-btn">
                    <button>수정하기</button>
                    {selectedWS?.progress_step === 0 && <button onClick={handleIdeaComplete}>저장하기</button>}
                </div>
            </div>
        </div>
    )
}