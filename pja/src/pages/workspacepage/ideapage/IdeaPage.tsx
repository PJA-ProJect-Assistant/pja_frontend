import { useSelector } from "react-redux"
import type { RootState } from "../../../store/store";
import { useEffect, useState } from "react";
import { WSHeader } from "../../../components/header/WSHeader"
import ProjectForm from "./ProjectForm";
import IdeaSummary from "./IdeaSummary";
import "./IdeaPage.css"

export default function IdeaPage() {
    const selectedWS = useSelector(
        (state: RootState) => state.workspace.selectedWS
    );
    const [doSummary, setDoSummary] = useState<boolean>(false);

    useEffect(() => {
        if (selectedWS?.project_summary) {
            setDoSummary(true);
        }
    }, [])
    return (
        <div className="ideapage-container">
            <WSHeader title="아이디어 요약" />
            {!doSummary && (
                <ProjectForm onClose={() => setDoSummary(true)} />
            )}
            {doSummary &&
                <IdeaSummary />
            }
        </div>
    )
}