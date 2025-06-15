import { WSHeader } from "../../../components/header/WSHeader";
import "./RequirementsPage.css"

export default function RequirementsPage() {
    return (
        <>
            <WSHeader title="요구사항 명세서" />
            <div className="require-container">
                <div className="require-title">
                    <p>✨기능/성능 요구사항 3개 이상 입력하면 AI 추천이 가능해요</p>
                    <div className="require-aibtn ">AI 추천받기</div>
                </div>
            </div>
        </>
    )
}