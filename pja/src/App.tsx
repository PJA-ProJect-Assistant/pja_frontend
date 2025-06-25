import "./App.css";
import { ErrorBoundary } from "./error/ErrorBoundary";
import Router from "./Rotuer";

function App() {
  return (
    <ErrorBoundary>
      <Router />
    </ErrorBoundary>
  );
}

export default App;
