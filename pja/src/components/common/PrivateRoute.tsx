import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuthInit } from "../../hooks/useAuthInit";
import type { RootState } from "../../store/store";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = useSelector((state: RootState) => state.auth.accessToken);

  const authInitialized = useAuthInit();

  if (!authInitialized) {
    return <>로딩중....</>;
    // 나중에 여기에 로딩 페이지 만들게....
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
