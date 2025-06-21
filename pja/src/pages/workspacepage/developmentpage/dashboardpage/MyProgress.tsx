import { useEffect, useState } from "react";
import "./CategoryProgress.css";
import { PieChart, Pie, Cell } from "recharts";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import "./MyProgress.css"

export default function MyProgress() {
    const [totalCg, setTotalCg] = useState<number>(0);
    const [completeCg, setCompleteCg] = useState<number>(20);
    const [completePg, setCompletePg] = useState<number>(0);
    const [progressPg, setProgressPg] = useState<number>(30);
    const selectedWS = useSelector(
        (state: RootState) => state.workspace.selectedWS
    );

    // useEffect(() => {
    //     if (selectedWS && categoryList.length > 0) {
    //         const total = categoryList.length;
    //         const completed = categoryList.filter((cg) => cg.state === "DONE").length;
    //         const percentage = (completed / total) * 100;
    //         const progress = (categoryList.filter((cg) => cg.state === "IN_PROGRESS").length / total) * 100;

    //         setTotalCg(total);
    //         setCompleteCg(completed);
    //         setCompletePg(percentage);
    //         setProgressPg(progress);
    //     }
    // }, []);

    const data = [
        { name: "완료", value: completePg ?? 0 },
        { name: "진행중", value: progressPg ?? 0 },
        { name: "미완료", value: 100 - (completePg + progressPg) },
    ];

    const COLORS = ["#FE5000", "#fec300", "#d9d9d6"];
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
                        style={{ pointerEvents: "none" }}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>
                </PieChart>
                <div className="categorypg-pietxt">
                    <p>내진행률</p>
                    <p>
                        {completeCg}/{totalCg}
                    </p>
                </div>
            </div>
        </div>
    );
}
