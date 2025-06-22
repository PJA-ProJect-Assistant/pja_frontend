import "./Featurelist.css"

export default function Featurelist({ coreFeature }: any) {
    return (
        <div className="featurelist-container">
            <p>프로젝트 주요 기능</p>
            <ul>
                {coreFeature.map((feature: string, index: number) => (
                    <li key={index} title={feature}>{feature}</li>
                ))
                }
            </ul>
        </div>
    )
}