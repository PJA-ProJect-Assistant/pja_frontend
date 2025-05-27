import React, { useState } from "react";
import "./LoginPage.css"; // CSS 파일 연결

const LoginPage = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

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
  const handleLogin = () => {};

  return (
    <div className="login-container">
      <div className="login-box">
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
              type="password"
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
        <div className="google-login-section">
          <button className="google-login-button">
            Google 계정으로 로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
