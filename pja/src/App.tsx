import "./App.css";
import Router from "./Rotuer";
import { useAuthInit } from "./hooks/useAuthInit";

function App() {
  const authInitialized = useAuthInit(); // ✅ 초기화 완료 여부

  if (!authInitialized) {
    return <div>로딩 중입니다...</div>; // ✅ 토큰 초기화 전까지 아무 것도 렌더링하지 않음
  }

  return (
    <>
      <Router />
    </>
  );
}

export default App;
