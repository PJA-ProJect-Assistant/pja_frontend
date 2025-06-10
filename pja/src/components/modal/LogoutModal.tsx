import type { FC, MouseEvent } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import "./LogoutModal.css";

interface LogoutModalProps {
  onConfirm: () => void;
  onClose: () => void;
  accessToken?: string;
}

interface LogoutResponse {
  status: "success" | "fail" | "error";
  message: string;
  data?: null;
}

interface LogoutError {
  status: "fail" | "error";
  message: string;
}

const LogoutModal: FC<LogoutModalProps> = ({
  onConfirm,
  onClose,
  accessToken,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  const logoutUser = async (token: string): Promise<LogoutResponse> => {
    try {
      console.log("🚀 로그아웃 요청 시작");
      console.log("📋 토큰 상태:", token ? "✅ 존재함" : "❌ 없음");

      const response = await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        headers: {
          // Authorization 헤더는 Spring Security가 자동으로 처리
          Authorization: `Bearer ${token}`,
          // Content-Type 제거 (POST 요청이지만 body가 없으므로 불필요할 수 있음)
          // "Content-Type": "application/json",
        },
        // credentials 추가: 쿠키 기반 인증도 함께 사용하는 경우
        credentials: "include",
      });

      console.log("📡 응답 상태:", response.status);
      console.log("📄 응답 OK:", response.ok);

      // 백엔드에서 SuccessResponse 형태로 응답하므로 JSON 파싱
      let data: LogoutResponse | LogoutError;

      try {
        data = await response.json();
        console.log("📦 응답 데이터:", data);
      } catch (jsonError) {
        console.error("JSON 파싱 오류:", jsonError);
        // JSON 파싱 실패 시 기본 응답 생성
        data = {
          status: response.ok ? "success" : "error",
          message: response.ok
            ? "로그아웃 성공"
            : `서버 오류: ${response.status}`,
        };
      }

      // HTTP 상태 코드 확인
      if (!response.ok) {
        // 401 Unauthorized인 경우 특별 처리
        if (response.status === 401) {
          throw new Error("인증이 만료되었습니다. 토큰을 확인해주세요.");
        }
        // 403 Forbidden인 경우
        if (response.status === 403) {
          throw new Error("접근 권한이 없습니다.");
        }
        throw new Error(data.message || `서버 오류 (${response.status})`);
      }

      return data as LogoutResponse;
    } catch (error) {
      console.error("💥 로그아웃 API 호출 오류:", error);

      // 네트워크 오류 처리
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요."
        );
      }

      // CORS 오류 처리
      if (error instanceof TypeError && error.message.includes("CORS")) {
        throw new Error("CORS 오류가 발생했습니다. 서버 설정을 확인해주세요.");
      }

      throw error;
    }
  };

  const handleLogout = async () => {
    console.log("🔄 로그아웃 처리 시작");

    if (!accessToken) {
      console.error("❌ 토큰이 없음");
      setError("인증 토큰이 없습니다. 다시 로그인해주세요.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await logoutUser(accessToken);
      console.log("✅ 로그아웃 성공");

      // 로그아웃 성공 시 모든 인증 관련 데이터 제거
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      // 혹시 다른 키로 저장된 토큰들도 제거
      localStorage.removeItem("token");
      localStorage.removeItem("authToken");

      console.log("🗑️ 토큰 제거 완료");

      onConfirm(); // 성공 콜백 호출
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "로그아웃에 실패했습니다.";
      console.error("❌ 로그아웃 실패:", errorMessage);
      setError(errorMessage);

      // 401 오류인 경우 토큰이 이미 만료되었으므로 강제 로그아웃
      if (errorMessage.includes("인증이 만료")) {
        console.log("🔧 토큰 만료로 인한 강제 로그아웃");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("token");
        localStorage.removeItem("authToken");

        // 약간의 지연 후 자동으로 로그아웃 처리
        setTimeout(() => {
          onConfirm();
        }, 1500);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 강제 로그아웃 함수
  const handleForceLogout = () => {
    console.log("🔧 강제 로그아웃 실행");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    onConfirm();
  };

  return (
    <motion.div
      className="modal-overlay"
      onClick={handleOverlayClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="modal-content"
        initial={{ x: "-50%", y: "-50%", opacity: 0 }}
        animate={{ x: "-50%", y: "-50%", opacity: 1 }}
        exit={{ x: "-80%", y: "-100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="modal-header-bar" />
        <p className="modal-message">로그아웃 하시겠습니까?</p>
        {error && (
          <div className="modal-error">
            {error}
            {(error.includes("토큰이 없습니다") ||
              error.includes("인증이 만료")) && (
              <button
                onClick={handleForceLogout}
                className="modal-button force-logout"
                style={{
                  marginTop: "10px",
                  fontSize: "12px",
                  padding: "5px 10px",
                  backgroundColor: "#ff6b6b",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                강제 로그아웃
              </button>
            )}
          </div>
        )}

        <div className="modal-actions">
          <button
            onClick={handleLogout}
            className={`modal-button confirm ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? "로그아웃 중..." : "로그아웃"}
          </button>
          <button
            onClick={onClose}
            className="modal-button cancel"
            disabled={isLoading}
          >
            취소
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LogoutModal;
