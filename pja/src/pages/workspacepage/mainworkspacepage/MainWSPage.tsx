import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedWS } from "../../../store/workspaceSlice";
import { getworkspace } from "../../../services/workspaceApi";
import WsSidebar from "../../../components/sidebar/WsSidebar";
import "./MainWSPage.css";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import IdeaPage from "../ideapage/IdeaPage";
import RequirementsPage from "../requirementpage/RequirementsPage";
import ERDPage from "../erdpage/ERDPage";
import ApiPage from "../apispecpage/ApiPage";
import DevelopmentPage from "../developmentpage/DevelopmentPage";
import ProjectSummaryPage from "../projectsummarypage/ProjectSummaryPage";
import { ReactFlowProvider } from "reactflow";
import { getUserRole } from "../../../services/userApi";
import { setUserRole } from "../../../store/userSlice";
import SearchProjectpage from "../../searchproject/SearchProjectpage";
import { WorkspaceSettingPage } from "../../workspacesettingpage/WorkspaceSettingPage";
import LoadingSpinner from "../../loadingpage/LoadingSpinner";
import { BasicModal } from "../../../components/modal/BasicModal";

export default function MainWSPage() {
  const { wsid, stepId } = useParams<{
    wsid: string;
    stepId: string;
  }>();
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch(); //redux에 값 저장하는 함수 필요
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showIcon, setShowIcon] = useState(false);
  const [userRole, serUserRole] = useState<string | null>(null);
  const [wsPublic, setWsPublic] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getws = async () => {
      try {
        const response = await getworkspace(Number(wsid));
        //redux저장
        if (response.data) {
          dispatch(setSelectedWS(response.data));
          setWsPublic(response.data.isPublic);
        }
      } catch (err: any) {
        console.log("getworkspace 실패");
      }
    };
    const getrole = async () => {
      try {
        const response = await getUserRole(Number(wsid));
        dispatch(setUserRole(response.data?.role ?? null));
        serUserRole(response.data?.role ?? null);
      } catch (error) {
        console.log("getrole 실패");
      }
    };
    const fetchData = async () => {
      try {
        await Promise.all([getws(), getrole()]);
      } catch {
        setError("데이터를 불러오는 데 실패했습니다.");
      }
      setIsLoading(false); // 모든 로딩이 끝났을 때만 false
    };
    fetchData();
  }, [wsid]);
  const renderStepComponent = () => {
    switch (stepId) {
      case "idea":
        return <IdeaPage />;
      case "requirements":
        return <RequirementsPage />;
      case "project":
        return <ProjectSummaryPage />;
      case "erd":
        return (
          <ReactFlowProvider>
            <ERDPage />
          </ReactFlowProvider>
        );
      case "api":
        return <ApiPage />;
      case "develop":
      case "complete":
        return <DevelopmentPage />;
      case "search":
        return <SearchProjectpage />;
      case "settings":
        return <WorkspaceSettingPage />;
      default:
        return <div>잘못된 스텝입니다.</div>;
    }
  };

  if (isLoading) {
    return <LoadingSpinner />; // 또는 스피너 컴포넌트
  }

  if (error) {
    return (
      <BasicModal
        modalTitle={error}
        modalDescription="워크스페이스 정보를 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요."
        Close={() => setError(null)}
      />
    );
  }

  return !wsPublic && userRole === null ? (
    <div className="NoEnty-mainws">
      <p>해당 워크스페이스를 조회할 권한이 없습니다</p>
      <button onClick={() => history.back()}>돌아가기</button>
    </div>
  ) : (
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
      <div className="wscontent-container">{renderStepComponent()}</div>
    </div>
  );
}
