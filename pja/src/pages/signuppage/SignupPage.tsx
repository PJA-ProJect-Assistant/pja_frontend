import { useState } from "react";
import "./SignupPage.css";
import logoImage from "../../assets/img/logo.png";
import personIcon from "../../assets/img/person.png";
import emailIcon from "../../assets/img/email.png";
import lockIcon from "../../assets/img/lock.png";
import { SignupHeader } from "../../components/header/SignupHeader";

const SignupPage = () => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleIdChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setId(event.target.value);
  const handlePasswordChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setPassword(event.target.value);
  // 2. 비밀번호 확인 입력 변경 핸들러
  const handlePasswordConfirmChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setPasswordConfirm(event.target.value);
  const handleNameChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setName(event.target.value);
  const handleEmailChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setEmail(event.target.value);

  //삭제 아이콘 클릭 시 아이디 값을 빈 문자열로 설정
  const handleClearId = () => setId("");
  //삭제 아이콘 클릭 시 이름 값을 빈 문자열로 설정
  const handleClearName = () => setName("");
  //삭제 아이콘 클릭 시 이메일 값을 빈 문자열로 설정
  const handleClearEmail = () => setEmail("");
  //삭제 아이콘 클릭 시 비밀번호 값을 빈 문자열로 설정
  const handleClearPassword = () => {
    setPassword("");
  };
  // 3. 비밀번호 확인 필드 클리어 핸들러
  const handleClearPasswordConfirm = () => {
    setPasswordConfirm("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  //const handleLogin = () => {};

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
            <div className="input-wrapper">
              <img
                src={personIcon}
                alt="person"
                className="person-icon-inside"
              />

              <input
                type="text"
                placeholder="아이디"
                className="id-input"
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
            </div>
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
                className="name-input"
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
          </div>
          <div className="email-title">이메일</div>
          <div className="input-section">
            <div className="input-wrapper">
              <img src={emailIcon} alt="이메일" className="email-icon-inside" />
              <input
                type="text"
                placeholder="이메일"
                className="email-input"
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
            </div>
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
            <button type="submit" className="signup-button">
              회원가입
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
