import { Navigate } from "react-router-dom";
import { useAuthInit } from "../../hooks/useAuthInit";

const RootRedirect = () => {
  const localToken = localStorage.getItem("accessToken");

  // accessToken이 없으면 바로 login 페이지로 이동
  if (!localToken) {
    return <Navigate to="/login" replace />;
  }

  const authInitialized = useAuthInit();

  if (!authInitialized) {
    return <>로딩중....</>;
    // 나중에 여기에 로딩 페이지 만들게....
  }

  return <Navigate to="/main" replace />;
};

export default RootRedirect;
