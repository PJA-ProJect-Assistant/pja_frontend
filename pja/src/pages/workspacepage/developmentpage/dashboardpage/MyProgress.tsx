import { useEffect, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import "./MyProgress.css"
import { getMyPg } from "../../../../services/listapi/DashboardApi";

export default function MyProgress() {
    const [totalCg, setTotalCg] = useState<number>(0);
    const [completeCg, setCompleteCg] = useState<number>(0);
    const [completePg, setCompletePg] = useState<number>(0);
    const selectedWS = useSelector(
        (state: RootState) => state.workspace.selectedWS
    );

    useEffect(() => {
        const getmyprogress = async () => {
            if (selectedWS?.workspaceId) {
                try {
                    const respone = await getMyPg(selectedWS.workspaceId);
                    const total = respone.data?.total ?? 0;
                    const done = respone.data?.done ?? 0;
                    setTotalCg(total);
                    setCompleteCg(done);
                    setCompletePg((done / total) * 100);

                } catch {
                    console.log("내 진행률 가져오기 실패");
                }
            }
        }
        getmyprogress();
    }, []);

    const data = [
        { name: "완료", value: completePg ?? 0 },
        { name: "미완료", value: 100 - (completePg) },
    ];

    const COLORS = ["#FE5000", "#d9d9d6"];
    return (
        <div className="mypg-container">
            <div className="mypg-pie">
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
