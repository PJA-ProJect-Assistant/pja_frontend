import React, { useState } from "react";
import "./LoginPage.css"; // CSS 파일 연결
import logoImage from "../../assets/img/logo.png";
import GoogleImage from "../../assets/img/Google.png";

const LoginPage = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleIdChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setId(event.target.value);
  const handlePasswordChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setPassword(event.target.value);
  //삭제 아이콘 클릭 시 아이디 값을 빈 문자열로 설정
  const handleClearId = () => setId("");
  //삭제 아이콘 클릭 시 비밀번호 값을 빈 문자열로 설정
  const handleClearPassword = () => {
    setPassword("");
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = () => {};

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-logo">
          <img src={logoImage} alt="logo" className="logo-image"></img>
        </div>
        <h1 className="login-title">로그인</h1>

        <div className="input-section">
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="아이디"
              className="id-input"
              value={id}
              onChange={handleIdChange}
              // onFocus={(e) => {
              //   e.target.classList.add("input-focus");
              // }}
              // onBlur={(e) => {
              //   e.target.classList.remove("input-focus");
              // }}
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

        <div className="input-section">
          <div className="input-wrapper">
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
          </div>
        </div>

        <div className="button-section">
          <button type="button" onClick={handleLogin} className="login-button">
            로그인
          </button>
        </div>

        <div className="search-section">
          <div className="search-wrapper">
            {/* 아이디 찾기, 비밀번호 찾기 그룹 */}
            <div className="search-group">
              <a href="/find-id" className="search-link">
                아이디 찾기
              </a>
              <span className="search-separator">|</span>
              <a href="/find-pw" className="search-link">
                비밀번호 찾기
              </a>
            </div>
            <a href="/signup" className="search-link">
              회원가입
            </a>
          </div>
        </div>
        <div className="google-login-wrapper">
          <button className="google-login-button">
            <img src={GoogleImage} alt="Google logo" className="google-logo" />
            <span className="google-text">Google 계정으로 로그인</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
