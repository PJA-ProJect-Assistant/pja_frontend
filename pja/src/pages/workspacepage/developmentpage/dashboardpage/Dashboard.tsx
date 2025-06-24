import MyProgress from "./MyProgress";
import { MyActionTable } from "./MyActionTable";
import { LogBox } from "./LogBox";
import { GraphBox } from "./GraphBox";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-info">
        <MyProgress />
        <MyActionTable />
      </div>
      <div className="dashboard-box">
        <LogBox />
        <GraphBox />
      </div>
    </div>
  );
}
