import "./ListPage.css";
import MyProgress from "./myProgress";
import { MyActionTable } from "./myActionTable";
import "./Dashboard.css"

export default function Dashboard() {
    return (
        <div className="dashboard-container">
            <div className="dashboards-info">
                <MyProgress />
                <MyActionTable />
            </div>
            <div className="dashboard-box">
                {/* 알림박스 */}
                {/* 그래프 박스 */}
            </div>
        </div>
    );
}
