import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "../../store/store";
import { useAuthInit } from "../../hooks/useAuthInit";
import LoadingSpinner from "../../pages/loadingpage/LoadingSpinner";

const RootRedirect = () => {
  const token = useSelector((state: RootState) => state.auth.accessToken);

  const authInitialized = useAuthInit();

  // 초기화가 완료되지 않았으면 로딩
  if (!authInitialized) {
    return <LoadingSpinner />;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 토큰이 있으면 메인으로
  return <Navigate to="/main" replace />;
};

export default RootRedirect;
