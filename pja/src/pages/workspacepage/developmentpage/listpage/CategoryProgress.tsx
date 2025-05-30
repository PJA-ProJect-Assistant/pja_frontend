import "./CategoryProgress.css"
import { PieChart, Pie, Cell } from "recharts";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import { featureCategories } from "../../../../constants/listconstant";
import type { feature_category } from "../../../../types/list";
import { useEffect, useState } from "react";

export default function CategoryProgress() {
    const selectedWS = useSelector(
        (state: RootState) => state.workspace.selectedWS
    );
    const wsid = selectedWS?.workspace_id;
    const [wscategories, setWscategories] = useState<feature_category[]>([]);
    const [totalCg, setTotalCg] = useState<number>();
    const [completeCg, setCompleteCg] = useState<number>();
    const [completePg, setCompletePg] = useState<number>();

    useEffect(() => {
        if (wsid) {
            const filtered = featureCategories.filter(cg => cg.workspace_id === wsid);
            setWscategories(filtered);
            setTotalCg(filtered.length);
            let completedCount = 0;
            for (const cg of filtered) {
                if (cg.state) completedCount++;
            }
            setCompleteCg(completedCount);
            setCompletePg((completedCount / filtered.length) * 100);
        }
    }, [featureCategories, wsid]);

    const data = [
        { name: "완료", value: completePg ?? 0 },
        { name: "미완료", value: 100 - (completePg ?? 0) },
    ];

    const COLORS = ["#FE5000", "#d9d9d6"];
    return (
        <div className="categorypg-container">
            <div className="categorypg-pie">
                <PieChart width={200} height={200}>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        dataKey="value"
                        stroke="none"
                        startAngle={90}
                        endAngle={-270}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
                <div className="categorypg-pietxt">
                    <p>전체진행률</p>
                    <p>{completeCg}/{totalCg}</p>
                </div>
            </div>
            <div className="categorypg-list">
                <ul>
                    <p>카테고리</p>
                    {wscategories
                        .filter(ws => !ws.state)
                        .map((ws, index) => (
                            <li key={`incomplete-${index}`}>{ws.name}</li>
                        ))}

                    {wscategories
                        .filter(ws => ws.state)
                        .map((ws, index) => (
                            <li key={`complete-${index}`} style={{ textDecoration: "line-through" }}>
                                {ws.name}
                            </li>
                        ))}
                </ul>
            </div>
        </div >
    )
}