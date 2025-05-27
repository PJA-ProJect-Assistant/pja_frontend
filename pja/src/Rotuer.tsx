import { Routes, Route, Navigate } from "react-router-dom";
import MainPage from "./pages/mainpage/MainPage";
import LoginPage from "./pages/loginpage/LoginPage";
import AddWSPage from "./pages/workspacepage/addworkspacepage/AddWSPage";
import MainWSPage from "./pages/workspacepage/mainworkspacepage/MainWSPage";

const Router = () => {
  return (
    <Routes>
      {/* 기본 경로에서 로그인으로 리다이렉트 */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* 공개 라우트 */}
      <Route path="/login" element={<LoginPage />} />

      {/* 인증 필요 라우트 */}
      {/* <Route element={<PrivateRoute />}>
      </Route> */}
      <Route path="/main" element={<MainPage />} />
      <Route path="/addws" element={<AddWSPage />} />
      <Route path="/ws/:wsid" element={<MainWSPage />} />
    </Routes>
  );
};

export default Router;
