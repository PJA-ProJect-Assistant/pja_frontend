import { useSelector } from "react-redux"
import type { RootState } from "../../../../store/store"
import "./Featurelist.css"

export default function Featurelist() {
    const selectedWS = useSelector(
        (state: RootState) => state.workspace.selectedWS
    );
    return (
        <div className="featurelist-container">
            <p>프로젝트 주요 기능</p>
            <ul>
                {selectedWS?.project_features &&
                    JSON.parse(selectedWS.project_features).map((feature: string, index: number) => (
                        <li key={index} title={feature}>{feature}</li>
                    ))
                }
                <li>어쩌구저쩌꾸1234</li>
                <li>어쩌구저쩌꾸1234</li>
                <li>어쩌구저쩌꾸1234</li>
                <li>어쩌구저쩌꾸1234</li>
            </ul>
        </div>
    )
}