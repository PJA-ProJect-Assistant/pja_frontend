import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import "./ProgressStep.css"
export default function ProgressStep() {
    const selectedWS = useSelector(
        (state: RootState) => state.workspace.selectedWS
    );
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
                <div className="labels">
                    {steps.map((label, index) => (
                        <div key={index} className="label">
                            {label}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}