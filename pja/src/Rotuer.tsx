import { Routes, Route, Navigate } from "react-router-dom";
import MainPage from "./pages/mainpage/MainPage";
import LoginPage from "./pages/loginpage/LoginPage";
// import OAuth2Success from "./pages/loginpage/success/OAuth2SuccessPage";
import FindIdPage from "./pages/loginpage/findid/FindIdPage";
import FindPwPage from "./pages/loginpage/findpw/FindPwPage";
import SignupPage from "./pages/signuppage/SignupPage";
import AddWSPage from "./pages/workspacepage/addworkspacepage/AddWSPage";
import MainWSPage from "./pages/workspacepage/mainworkspacepage/MainWSPage";

const Router = () => {
  return (
    <Routes>
      {/* 기본 경로에서 로그인으로 리다이렉트 */}
      {/* 로그인해서 들어가게 하는거는 백이랑 연결하고 일단 들어가면 바로 홈 나오게 할게여ㅕㅕ */}
      <Route path="/" element={<Navigate to="/main" replace />} />

      {/* 공개 라우트 */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/find-id" element={<FindIdPage />} />
      <Route path="/find-pw" element={<FindPwPage />} />
      {/* 인증 필요 라우트 */}
      {/* <Route element={<PrivateRoute />}*/}
      {/*</Route> */}

      <Route path="/addws" element={<AddWSPage />} />

      <Route path="/ws/:wsid" element={<MainWSPage />} />

      {/*로그인 성공 후 리디렉션 처리용 페이지 */}
      {/* <Route path="/oauth2/success" element={<OAuth2Success />} /> */}
    </Routes>
  );
};

export default Router;
