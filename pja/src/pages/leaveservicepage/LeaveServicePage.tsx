import { useState } from "react";
import "./LeaveServicePage.css";
import { useDispatch } from "react-redux";
import { LeaveHeader } from "../../components/header/LeaveHeader"; // 1단계: 올바르게 가져오기
import { checkPassword, deleteUser } from "../../services/authApi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { clearAccessToken } from "../../store/authSlice";
import { BasicModal } from "../../components/modal/BasicModal";

const LeaveServicePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isAgreed, setIsAgreed] = useState(false);
  // 1. 비밀번호 입력을 저장할 state
  const [password, setPassword] = useState("");
  // 2. 비밀번호 오류 메시지를 저장할 state (빈 문자열이면 오류 없음)
  const [passwordError, setPasswordError] = useState("");
  // 3. 본인인증 완료 상태를 저장할 state
  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");

  // '확인' 버튼 클릭 시 실행될 함수
  const handlePasswordCheck = async () => {
    // 비밀번호를 입력하지 않은 경우
    if (!password) {
      setPasswordError("*비밀번호를 입력해주세요.");
      return;
    }

    try {
      await checkPassword(password);

      setPasswordError("");
      setIsPasswordConfirmed(true);
      setModalTitle("본인인증 완료");
      setModalDescription("본인인증이 완료되었습니다.");
      setIsModalOpen(true);
    } catch (error) {
      setIsPasswordConfirmed(false);

      if (axios.isAxiosError(error) && error.response) {
        // 서버에서 보낸 에러 메시지가 있는 경우
        const errorMessage =
          error.response.data.message || "오류가 발생했습니다.";
        setPasswordError(`*${errorMessage}`);
      } else {
        setPasswordError("*서버와 통신 중 오류가 발생했습니다.");
      }
      console.error("Password check failed:", error);
    }
  };

  const handleLeaveService = async () => {
    if (
      !window.confirm("정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.")
    ) {
      return;
    }
    try {
      await deleteUser();

      setModalTitle("회원 탈퇴 완료");
      setModalDescription(
        "회원 탈퇴가 성공적으로 처리되었습니다. 이용해주셔서 감사합니다."
      );
      setIsModalOpen(true);
      //  Redux 스토어의 인증 상태를 초기화
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error("응답 상태코드:", error.response.status);
          console.error("서버 메시지:", error.response.data?.message);

          switch (error.response.status) {
            case 401:
              alert(
                "인증 정보가 유효하지 않습니다. 다시 로그인 후 시도해주세요."
              );
              break;
            case 403:
              alert("회원을 탈퇴할 권한이 없습니다.");
              break;
            case 404:
              alert(
                "회원 탈퇴 API 경로를 찾을 수 없습니다. 관리자에게 문의해주세요."
              );
              break;
            default:
              const userMessage =
                error.response.data?.message ||
                "탈퇴 처리 중 오류가 발생했습니다.";
              alert(userMessage);
          }
        } else if (error.request) {
          alert("서버와 통신할 수 없습니다. 네트워크 연결을 확인해주세요.");
        } else {
          alert("요청 중 예기치 않은 오류가 발생했습니다.");
        }
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="leave-service-main-container">
      <div className="leave-service-header">
        <LeaveHeader />
      </div>
      <h1 className="leave-service-title">회원탈퇴</h1>
      <div className="underline" />
      <div className="leave-service-container">
        <p className="leave-service-content">회원탈퇴 유의사항</p>
        <ul className="leave-notice-list">
          <li>
            사용하고 계신 아이디는 탈퇴 후 재사용 및 복구가 불가능합니다.{" "}
          </li>
          <li>탈퇴 후 회원정보 및 개인형 서비스 이용기록은 모두 삭제됩니다.</li>
          <div className="notice-detail">
            회원정보 및 이메일 등 서비스 이용기록은 모두 삭제되며, 삭제된
            데이터는 복구되지 않습니다.
            <br />
            삭제되는 내용을 확인하시고 필요한 데이터는 미리 백업을 진행해주세요.
          </div>
        </ul>
      </div>
      <div className="agreement-container">
        <input
          type="checkbox"
          id="agreement-checkbox"
          checked={isAgreed}
          onChange={() => setIsAgreed(!isAgreed)} // 클릭할 때마다 state를 반대로 변경 (false -> true, true -> false)
        />
        <label htmlFor="agreement-checkbox">
          안내사항을 모두 확인하였으며, 이에 동의합니다.
        </label>
      </div>
      <div className="leave-user-check-container">
        <div className="leave-user-check-title"> 본인확인</div>
        <ul className="leave-user-check-list">
          <li>본인 확인 후 탈퇴가 가능합니다.</li>
          <li>비밀번호를 입력해주세요</li>
        </ul>
      </div>
      <div className="leave-password-input-wrapper">
        <div className="leave-password-input-container">
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handlePasswordCheck}>확인</button>
        </div>
        {/* passwordError에 내용이 있을 때만 p 태그를 렌더링합니다. */}
        {passwordError && (
          <p className="leave-error-message">{passwordError}</p>
        )}
      </div>
      <button
        className="leave-button"
        disabled={!isAgreed || !isPasswordConfirmed}
        onClick={handleLeaveService}
      >
        탈퇴하기
      </button>
      {isModalOpen && (
        <BasicModal
          modalTitle={modalTitle}
          modalDescription={modalDescription}
          Close={(open) => {
            setIsModalOpen(open);
            // 만약 탈퇴 성공 모달을 닫을 때 리다이렉트가 필요하다면:
            if (!open && modalTitle === "회원 탈퇴 완료") {
              dispatch(clearAccessToken());
              localStorage.removeItem("accessToken");
              navigate("/");
            }
          }}
        />
      )}
    </div>
  );
};

export default LeaveServicePage;
