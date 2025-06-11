import "./App.css";
import Router from "./Rotuer";
import { useAuthInit } from "./hooks/useAuthInit";

function App() {
  useAuthInit();

  return (
    <>
      <Router />
    </>
  );
}

export default App;
