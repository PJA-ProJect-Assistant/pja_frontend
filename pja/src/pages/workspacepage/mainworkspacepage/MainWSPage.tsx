import { useParams } from "react-router-dom";
import type { workspace } from "../../../types/workspace";
import { dummyWorkspaces } from "../../../constants/wsconstants";
import WsSidebar from "../../../components/sidebar/WsSideBar";
import "./MainWSPage.css";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { WSHeader } from "../../../components/header/WSHeader";

export default function MainWSPage() {
  const { wsid } = useParams<{
    wsid: string;
  }>();
  const selectws: workspace | undefined = dummyWorkspaces.find(
    (ws) => ws.workspace_id === Number(wsid)
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showIcon, setShowIcon] = useState(false);

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
      )}
      <div className="wscontent-container">
        <WSHeader title="아이디어 요약" />
      </div>
    </div>
  );
}
