import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { workspace } from "../../../types/workspace";
import { setSelectedWS } from "../../../store/workspaceSlice";
import { dummyWorkspaces } from "../../../constants/wsconstants";
import WsSidebar from "../../../components/sidebar/WsSidebar";
import "./MainWSPage.css";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import IdeaPage from "../ideapage/IdeaPage";
import RequirementsPage from "../requirementpage/RequirementsPage";
import ERDPage from "../erdpage/ERDPage";
import ApiPage from "../apispecpage/ApiPage";
import DevelopmentPage from "../developmentpage/DevelopmentPage";
import { ReactFlowProvider } from "reactflow";

export default function MainWSPage() {
  const { wsid, stepNumber } = useParams<{
    wsid: string;
    stepNumber: string;
  }>();
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showIcon, setShowIcon] = useState(false);
  const step = Number(stepNumber ?? 0);

  useEffect(() => {
    const selectws: workspace | undefined = dummyWorkspaces.find(
      (ws) => ws.workspace_id === Number(wsid)
    );
    if (selectws) {
      dispatch(setSelectedWS(selectws));
    }
  }, [wsid, dispatch]);

  return (
    <div className="mainws-container">
      <AnimatePresence
        onExitComplete={() => {
          setShowIcon(true); // 사이드바 사라진 후 아이콘 보이기
        }}
      >
        {sidebarOpen && (
          <WsSidebar
            onClose={() => {
              setSidebarOpen(false);
              setShowIcon(false); // 아이콘 숨김 처리
            }}
          />
        )}
      </AnimatePresence>
      {!sidebarOpen && showIcon && (
        <div className="sidebar-closed">
          <div className="sidebar-icon" onClick={() => setSidebarOpen(true)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#000000"
            >
              <path d="M360-120v-720h80v720h-80Zm160-160v-400l200 200-200 200Z" />
            </svg>
          </div>
        </div>
      )}
      <div className="wscontent-container">
        {step === 0 && <IdeaPage />}
        {step === 1 && <RequirementsPage />}
        {step === 2 && (
          <ReactFlowProvider>
            <ERDPage />
          </ReactFlowProvider>
        )}
        {step === 3 && <ApiPage />}
        {(step === 4 || step === 5 || step == 6) && <DevelopmentPage />}
      </div>
    </div>
  );
}
