import { WSHeader } from "../../../components/header/WSHeader";
import "./RequirementsPage.css"
import type { setrequire, getrequire } from "../../../types/requirement";
import { useEffect, useState } from "react";
import { getrequirement, inputrequirement, Requirementgenerate } from "../../../services/requirementApi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store/store";

export default function RequirementsPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const selectedWS = useSelector(
        (state: RootState) => state.workspace.selectedWS
    );
    const [requireDone, setRequireDone] = useState<boolean>(false);
    const [requirements, setRequirements] = useState<getrequire[]>([]);
    useEffect(() => {
        const getRequire = async () => {
            if (selectedWS?.workspaceId) {
                const response = await getrequirement(selectedWS?.workspaceId);
                console.log("요구사항 조회 결과 :", response);
                if (response.data) {
                    setRequirements(response.data); // undefined가 아닐 때만 설정
                }
            }
        }
        getRequire();
    }, [])
    const handleAddFunction = async () => {
        try {
            if (selectedWS?.workspaceId) {
                const response = await inputrequirement(selectedWS?.workspaceId, "FUNCTIONAL");
                console.log("function 생성 결과 :", response);
            }
        }
        catch (err) {
            console.log("function 생성 실패", err);

        }
    }
    const handleAddPerformance = async () => {
        try {
            if (selectedWS?.workspaceId) {
                const response = await inputrequirement(selectedWS?.workspaceId, "PERFORMANCE");
                console.log("performance 생성 결과 :", response);
            }
        }
        catch (err) {
            console.log("performance 생성 실패", err);

        }
    }
    const handleAiRequirements = async () => {
        try {
            if (selectedWS?.workspaceId) {
                const setrequirement: setrequire[] = requirements.map(({ requirementType, content }) => ({
                    requirementType,
                    content
                }));
                const response = await Requirementgenerate(selectedWS.workspaceId, setrequirement);
                console.log("요구사항 저장 성공:", response);
                alert("요구사항이 성공적으로 저장되었습니다!");
            }
        } catch (err) {
            console.error("요구사항 저장 실패", err);
            alert("요구사항 저장 중 오류가 발생했습니다.");
        }
    };
    return (
        <>
            <WSHeader title="요구사항 명세서" />
            <div className="require-container">
                <div className="require-title">
                    <p>✨기능/성능 요구사항 3개 이상 입력하면 AI 추천이 가능해요</p>
                    <div className="require-aibtn ">AI 추천받기</div>
                </div>
                <div className="require-content">
                    <div className="require-content-box ">
                        {!requireDone && <button className="require-add-button" onClick={handleAddFunction}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FFFFFF"><path d="M444-444H240v-72h204v-204h72v204h204v72H516v204h-72v-204Z" /></svg>
                            <p>요구사항 추가</p>
                        </button>
                        }
                    </div>
                    <div className="require-content-box ">
                        {!requireDone && <button className="require-add-button" onClick={handleAddPerformance}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FFFFFF"><path d="M444-444H240v-72h204v-204h72v204h204v72H516v204h-72v-204Z" /></svg>
                            <p>요구사항 추가</p>
                        </button>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}