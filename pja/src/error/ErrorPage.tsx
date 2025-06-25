import { useNavigate } from "react-router-dom";
import "./ErrorBoundary.css";

interface ErrorPageProps {
  code?: number;
  message?: string;
}

export const ErrorPage = ({ code = 404, message }: ErrorPageProps) => {
  const navigate = useNavigate();

  const defaultMessages: Record<number, string> = {
    404: "페이지를 찾을 수 없습니다.",
    500: "서버에 오류가 발생했습니다.",
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="error-container">
      <h1>{code}</h1>
      <p>{message || defaultMessages[code] || "알 수 없는 오류입니다."}</p>
      {code === 500 ? (
        <button onClick={handleReload}>새로고침</button>
      ) : (
        <button onClick={() => navigate(-1)}>뒤로 가기</button>
      )}
    </div>
  );
};
