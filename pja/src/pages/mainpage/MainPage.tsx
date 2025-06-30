import { useEffect, useState } from "react";
import { MainHeader } from "../../components/header/MainHeader";
import { Myworkspace } from "./Myworkspace";
import MainMenu from "../../components/sidebar/MainMenuSidebar";
import { AnimatePresence } from "framer-motion";
import "./MainPage.css";
import { useUserData } from "../../hooks/useUserData";
import LoadingSpinner from "../loadingpage/LoadingSpinner";
import { BasicModal } from "../../components/modal/BasicModal";

export default function MainPage() {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const { refetchUser, refetchWorkspaces } = useUserData();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([refetchUser(), refetchWorkspaces()]);
      } catch {
        setError("데이터를 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false); // 모든 로딩이 끝났을 때만 false
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />; // 또는 스피너 컴포넌트
  }

  return (
    <>
      <div className="main-container">
        <MainHeader onMenuToggle={() => setOpenMenu((prev) => !prev)} />
        <Myworkspace />
        <AnimatePresence>
          {openMenu && <MainMenu onClose={() => setOpenMenu(false)} />}
        </AnimatePresence>
      </div>
      {error && (
        <BasicModal
          modalTitle={error}
          modalDescription={
            "일시적인 오류가 발생했습니다 페이지를 새로고침하거나 잠시 후 다시 시도해 주세요"
          }
          Close={() => setError("")}
        ></BasicModal>
      )}
    </>
  );
}
