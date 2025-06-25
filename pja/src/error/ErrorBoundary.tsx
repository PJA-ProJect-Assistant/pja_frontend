import React, { Component } from "react";
import type { ReactNode } from "react";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import "./ErrorBoundary.css";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorCode?: number;
  errorMessage?: string;
}

class ErrorBoundaryInner extends Component<
  ErrorBoundaryProps & { navigate: NavigateFunction },
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps & { navigate: NavigateFunction }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // 여기서 상태를 업데이트해서 fallback UI 보여줌
    // 에러 타입에 따라 코드 지정, 없으면 500 처리
    const code = error?.status || 500;
    const message = error?.message || "";
    return { hasError: true, errorCode: code, errorMessage: message };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 에러 로깅 등 추가 작업 가능
    console.error("ErrorBoundary caught error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const code = this.state.errorCode || 500;
      const message = this.state.errorMessage;

      const defaultMessages: Record<number, string> = {
        404: "페이지를 찾을 수 없습니다.",
        500: "서버에 오류가 발생했습니다.",
      };

      return (
        <div className="error-container">
          <h1>{code}</h1>
          <p>{message || defaultMessages[code] || "알 수 없는 오류입니다."}</p>
          <div className="error-buttons">
            {code === 500 ? (
              <button onClick={this.handleReload}>새로고침</button>
            ) : (
              <button onClick={() => this.props.navigate(-1)}>뒤로 가기</button>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// react-router-dom v6 훅을 클래스 컴포넌트에 주입하기 위한 래퍼
export function ErrorBoundary({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  return (
    <ErrorBoundaryInner navigate={navigate}>{children}</ErrorBoundaryInner>
  );
}
