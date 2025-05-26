import { Routes, Route, Navigate } from "react-router-dom";
import MainPage from "./pages/mainpage/mainPage";
import LoginPage from "./pages/loginpage/loginPage";

const Router = () => {
  return (
    <Routes>
      {/* 기본 경로에서 로그인으로 리다이렉트 */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* 공개 라우트 */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/main" element={<MainPage />} />

      {/* 인증 필요 라우트 */}
      {/* <Route element={<PrivateRoute />}>
      </Route> */}
    </Routes>
  );
};

export default Router;
