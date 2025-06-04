import { useState, ChangeEvent, type ReactNode } from "react";
import "./SignupPage.css";
import logoImage from "../../assets/img/logo.png";
import personIcon from "../../assets/img/person.png";
import emailIcon from "../../assets/img/email.png";
import lockIcon from "../../assets/img/lock.png";
import { SignupHeader } from "../../components/header/SignupHeader";
import axios from "axios";
import CustomModal from "./CustomModal";
import { validateId } from "./idValidator";
import { validateName } from "./nameValidator";

interface SignupApiResponse {
  // 실제 API 응답에 맞게 수정
  message?: string;
  // 다른 필드가 있다면 추가
}

const SignupPage: React.FC = () => {
  const [id, setId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  //모달창
  const [showModal, setShowModal] = useState<React.ReactNode>(false);
  const [modalMessage, setModalMessage] = useState<React.ReactNode>("");

  //중복확인 상태 관리
  const [isIdChecked, setIsIdChecked] = useState<boolean>(false);
  const [isEmailChecked, setIsEmailChecked] = useState<boolean>(false);
  const [isIdAvailable, setIsIdAvailable] = useState<boolean>(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState<boolean>(false);

  //아이디 유효성 검사 상태
  const [idValidation, setIdValidation] = useState<{
    isValid: boolean;
    message: string;
  }>({ isValid: false, message: "" });

  //이름 유효성 검사 상태
  const [nameValidation, setNameValidation] = useState<{
    isValid: boolean;
    message: String;
  }>({ isValid: false, message: "" });

  //handle 함수보다 먼저 정의되어야 함
  const openModal = (message: ReactNode): void => {
    setModalMessage(message);
    setShowModal(true);
  };

  const closeModal = (): void => {
    setShowModal(false);
    setModalMessage("");
  };

  const handleIdChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const newIdValue = event.target.value;
    setId(newIdValue);

    //실시간 유효성 검사
    const validation = validateId(newIdValue);
    setIdValidation(validation);

    //아이디가 변경되면 중복확인 상태 초기화
    setIsIdChecked(false);
    setIsIdAvailable(false);
  };

  //아이디 중복확인
  const handleCheckIdDuplicate = async (): Promise<void> => {
    if (!id.trim()) {
      openModal("아이디를 입력해주세요.");
      return;
    }

    if (!idValidation.isValid) {
      openModal(idValidation.message || "올바른 형식의 아이디를 입력해주세요.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/api/auth/check-username?username=${id}`
      );
      if (response.data.avialable || response.data.available) {
        setIsIdAvailable(true);
        setIsIdChecked(true);
        openModal("사용 가능한 아이디입니다.");
      } else {
        setIsIdAvailable(false);
        setIsIdChecked(true);
        openModal("이미 사용 중인 아이디입니다.");
      }
    } catch (error) {
      console.error("아이디 중복확인 실패", error);

      console.log("모달 열기 시도 중... (handleCheckIdDuplicate catch)");
      openModal("아이디 중복확인에 실패했습니다 \n 다시 시도해주세요");
    }
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>): void =>
    setPassword(event.target.value);
  // 2. 비밀번호 확인 입력 변경 핸들러
  const handlePasswordConfirmChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => setPasswordConfirm(event.target.value);
  const handleNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const newNameValue = event.target.value;
    setName(newNameValue);

    const validation = validateName(newNameValue); //유효성 검사
    setNameValidation(validation); //유효성 검사 결과 업데이트
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
    //이메일이 변경되면 중복확인 상태 초기화
    setIsEmailChecked(false);
    setIsEmailAvailable(false);
  };

  //이메일 중복확인
  const handleCheckEmailDuplicate = async () => {
    if (!email.trim()) {
      openModal("이메일을 입력해주세요");
      return;
    }
    //간단한 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      openModal("올바른 이메일 형식을 입력해주세요");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/api/auth/check-email?email=${email}`
      );
      if (response.data.avialable) {
        setIsEmailAvailable(true);
        setIsEmailChecked(true);
        openModal("사용 가능한 이메일입니다");
      } else {
        setIsEmailAvailable(false);
        setIsEmailChecked(true);
        openModal("이미 사용 중인 이메일입니다");
      }
    } catch (error) {
      console.error("이메일 중복확인 실패", error);
      openModal(
        <>
          이메일 중복확인에 실패했습니다 <br />
          다시 시도해주세요
        </>
      );
    }
  };

  //삭제 아이콘 클릭 시 아이디 값을 빈 문자열로 설정
  const handleClearId = (): void => {
    setId("");
    setIsIdChecked(false);
    setIsIdAvailable(false);
  };

  //삭제 아이콘 클릭 시 이름 값을 빈 문자열로 설정
  const handleClearName = (): void => {
    setName("");
    setNameValidation({ isValid: false, message: "" }); // 유효성 상태도 초기화
  };

  //삭제 아이콘 클릭 시 이메일 값을 빈 문자열로 설정
  const handleClearEmail = (): void => {
    setEmail("");
    setIsEmailChecked(false);
    setIsEmailAvailable(false);
  };
  //삭제 아이콘 클릭 시 비밀번호 값을 빈 문자열로 설정
  const handleClearPassword = (): void => {
    setPassword("");
  };
  // 3. 비밀번호 확인 필드 클리어 핸들러
  const handleClearPasswordConfirm = (): void => {
    setPasswordConfirm("");
  };

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  const handleSignup = async (): Promise<void> => {
    if (!id || !name || !email || !password || !passwordConfirm) {
      openModal("모든 항목을 입력해주세요");
      return;
    }
    // 중복확인 체크
    if (!isIdChecked || !isIdAvailable) {
      openModal("아이디 중복확인을 해주세요");
      return;
    }

    // 이름 유효성 확인
    if (!nameValidation.isValid) {
      openModal(nameValidation.message || "올바른 형식의 이름을 입력해주세요.");
      return;
    }

    if (!isEmailChecked || !isEmailAvailable) {
      openModal("이메일 중복확인을 해주세요");
      return;
    }

    if (password !== passwordConfirm) {
      openModal("비밀번호가 일치하지 않습니다");
      return;
    }

    try {
      const response: AxiosResponse<SignupApiResponse> = await axios.post(
        "http://localhost:8080/api/auth/signup",
        {
          username: id,
          name: name,
          email: email,
          password: password,
        }
      );

      if (response.status === 201 || response.status === 200) {
        alert("회원가입이 완료되었습니다");
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("회원가입 실패", error);
      openModal("회원가입에 실패했습니다 \n 다시 시도해주세요");
    }
  };

  return (
    <div className="signup-maincontainer">
      <SignupHeader />
      <div className="signup-container">
        <div className="signup-box">
          <div className="signup-logo">
            <img src={logoImage} alt="logo" className="logo-image"></img>
          </div>
          <h1>회원가입</h1>
          <div className="id-title">아이디</div>
          <div className="input-section">
            {/*아이콘, 입력창, 클리어 아이콘만 포함 */}
            <div className="input-wrapper">
              <img
                src={personIcon}
                alt="person"
                className="person-icon-inside"
              />

              <input
                type="text"
                placeholder="아이디"
                className={`id-input ${
                  // 클래스 적용 로직 복원
                  id && !idValidation.isValid ? "input-error" : ""
                } ${
                  isIdChecked
                    ? isIdAvailable
                      ? "input-success"
                      : "input-error"
                    : ""
                }`}
                value={id}
                onChange={handleIdChange}
                onFocus={(e) => {
                  e.target.classList.add("input-focus");
                }}
                onBlur={(e) => {
                  e.target.classList.remove("input-focus");
                }}
              />
              {id && (
                <button
                  type="button"
                  onClick={handleClearId}
                  className="clear-icon"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M15 9l-6 6" />
                    <path d="M9 9l6 6" />
                  </svg>
                </button>
              )}
              {/*아이디 중복확인 버튼*/}
              <button
                type="button"
                onClick={handleCheckIdDuplicate}
                className="duplicate-check-button"
                disabled={!id.trim() || !idValidation.isValid}
              >
                중복확인
              </button>

              {/*중복확인 결과 메세지*/}
              {isIdChecked && idValidation.isValid && (
                <div
                  className={`validation-message ${
                    isIdAvailable ? "success" : "error"
                  }`}
                >
                  {isIdAvailable
                    ? "✓ 사용 가능한 아이디입니다."
                    : "✗ 이미 사용 중인 아이디입니다"}
                </div>
              )}
            </div>

            {/*실시간 유효성 검사 메세지*/}
            {id && idValidation.message && (
              <div className="validation-message error">
                {idValidation.message}
              </div>
            )}
          </div>
          <div className="name-title">이름</div>
          <div className="input-section">
            <div className="input-wrapper">
              <img
                src={personIcon}
                alt="person"
                className="person-icon-inside"
              />
              <input
                type="text"
                placeholder="이름"
                className={`name-input ${
                  name && !nameValidation.isValid ? "input-error" : ""
                }`}
                value={name}
                onChange={handleNameChange}
                onFocus={(e) => {
                  e.target.classList.add("input-focus");
                }}
                onBlur={(e) => {
                  e.target.classList.remove("input-focus");
                }}
              />
              {name && (
                <button
                  type="button"
                  onClick={handleClearName}
                  className="clear-icon"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M15 9l-6 6" />
                    <path d="M9 9l6 6" />
                  </svg>
                </button>
              )}
            </div>
            {/*이름 유효성 검사 메세지*/}
            {name && nameValidation.message && (
              <div className="validation-message error">
                {nameValidation.message}
              </div>
            )}
          </div>

          <div className="email-title">이메일</div>
          <div className="input-section">
            <div className="input-wrapper">
              <img src={emailIcon} alt="이메일" className="email-icon-inside" />
              <input
                type="text"
                placeholder="이메일"
                className={`email-input ${
                  isEmailChecked
                    ? isEmailAvailable
                      ? "input-success"
                      : "input-error"
                    : ""
                }`}
                value={email}
                onChange={handleEmailChange}
                onFocus={(e) => {
                  e.target.classList.add("input-focus");
                }}
                onBlur={(e) => {
                  e.target.classList.remove("input-focus");
                }}
              />

              {email && (
                <button
                  type="button"
                  onClick={handleClearEmail}
                  className="clear-icon"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M15 9l-6 6" />
                    <path d="M9 9l6 6" />
                  </svg>
                </button>
              )}
              {/*이메일 중복확인 버튼*/}
              <button
                type="button"
                onClick={handleCheckEmailDuplicate}
                className="duplicate-check-button"
                disabled={!email.trim()}
              >
                중복확인
              </button>
            </div>
            {/* 중복확인 결과 메시지 */}
            {isEmailChecked && (
              <div
                className={`validation-message ${
                  isEmailAvailable ? "success" : "error"
                }`}
              >
                {isEmailAvailable
                  ? "✓ 사용 가능한 이메일입니다"
                  : "✗ 이미 사용 중인 이메일입니다"}
              </div>
            )}
          </div>

          <div className="pw-title">비밀번호</div>
          <div className="input-section">
            <div className="input-wrapper">
              <img src={lockIcon} alt="lock" className="lock-icon-inside" />
              <input
                type={showPassword ? "text" : "password"} /*type 동적 변경*/
                placeholder="비밀번호"
                className="pw-input"
                value={password}
                onChange={handlePasswordChange}
                onFocus={(e) => {
                  e.target.classList.add("input-focus");
                }}
                onBlur={(e) => {
                  e.target.classList.remove("input-focus");
                }}
              />
              {/*비밀번호 보이기/숨기기 버튼*/}
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="visibility-toggle-icon" /* 새 CSS 클래스 */
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              >
                {showPassword ? (
                  // 비밀번호가 보일 때 (숨기기 아이콘 - 예: 사선 그어진 눈)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  // 비밀번호가 숨겨져 있을 때 (보이기 아이콘 - 예: 일반 눈)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>

              {password && (
                <button
                  type="button"
                  onClick={handleClearPassword}
                  className="clear-icon"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M15 9l-6 6" />
                    <path d="M9 9l6 6" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/*비밀번호 확인*/}
          <div className="pw-title">비밀번호 확인</div>
          <div className="input-section">
            <div className="input-wrapper">
              <img src={lockIcon} alt="lock" className="lock-icon-inside" />
              <input
                type={showPassword ? "text" : "password"} /*type 동적 변경*/
                placeholder="비밀번호"
                className="pw-input"
                value={passwordConfirm}
                onChange={handlePasswordConfirmChange}
                onFocus={(e) => {
                  e.target.classList.add("input-focus");
                }}
                onBlur={(e) => {
                  e.target.classList.remove("input-focus");
                }}
              />
              {/*비밀번호 보이기/숨기기 버튼*/}
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="visibility-toggle-icon" /* 새 CSS 클래스 */
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              >
                {showPassword ? (
                  // 비밀번호가 보일 때 (숨기기 아이콘 - 예: 사선 그어진 눈)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  // 비밀번호가 숨겨져 있을 때 (보이기 아이콘 - 예: 일반 눈)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>

              {password && (
                <button
                  type="button"
                  onClick={handleClearPasswordConfirm}
                  className="clear-icon"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M15 9l-6 6" />
                    <path d="M9 9l6 6" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <div className="agree-select-container">
            <div className="agree-wrapper">
              <input type="checkbox" className="agree-checkbox" />
              (필수)인증약관 전체 동의
            </div>
          </div>
          <div className="signup-button-container">
            <button
              type="submit"
              className="signup-button"
              onClick={handleSignup}
            >
              회원가입
            </button>
          </div>
        </div>
      </div>
      {showModal && <CustomModal message={modalMessage} onClose={closeModal} />}
    </div>
  );
};

export default SignupPage;
