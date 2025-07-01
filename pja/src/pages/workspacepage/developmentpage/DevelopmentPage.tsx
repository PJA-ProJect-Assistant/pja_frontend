import { WSHeader } from "../../../components/header/WSHeader";
import "./DevelopmentPage.css";
import ListPage from "./listpage/ListPage";
import KanbanPage from "./kanbanpage/KanbanPage";
import GanttChartPage from "./ganttchartpage/GanttChartPage";
import Dashboard from "./dashboardpage/Dashboard";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { setDevPage } from "../../../store/devPageSlice";

export default function DevelopmentPage() {
  const dispatch = useDispatch();
  const page = useSelector((state: RootState) => state.devPage.currentPage);

  const menus = ["리스트", "칸반", "간트차트", "대시보드"];
  return (
    <div className="develop-container">
      <WSHeader title="" />
      <div className="develop-content-container">
        <div className="develop-navigate-container">
          {menus.map((menu, index) => (
            <div
              key={index}
              className={`develop-navigate ${page === index ? "selected" : ""}`}
              onClick={() => dispatch(setDevPage(index))}
            >
              {menu}
            </div>
          ))}
        </div>
        {page === 0 && <ListPage />}
        {page === 1 && <KanbanPage />}
        {page === 2 && <GanttChartPage />}
        {page === 3 && <Dashboard />}
      </div>
    </div>
  );
}
