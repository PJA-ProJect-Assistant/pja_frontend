import { AnimatePresence } from "framer-motion";
import WsSidebar from "../../../../components/sidebar/WsSidebar";
import { actions } from "../../../../constants/listconstant";
import type { action } from "../../../../types/list";
import "./ActionPostPage.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PostHeader } from "../../../../components/header/PostHeader";
export default function ActionPostPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showIcon, setShowIcon] = useState(false);
  const [selectAction, setSelectAction] = useState<action>();
  const { acId } = useParams<{
    acId: string;
  }>();

  useEffect(() => {
    const setaction = actions.find((ac) => ac.action_id === Number(acId));
    setSelectAction(setaction);
  }, [acId]);
  return (
    <div className="post-container">
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
        <div className="post-sidebar-icon" onClick={() => setSidebarOpen(true)}>
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
      <div className="actionpost-container">
        <PostHeader />
        <h2>{selectAction?.name}</h2>
      </div>
    </div>
  );
}
