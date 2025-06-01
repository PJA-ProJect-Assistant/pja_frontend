import { useState } from "react";
import React from "react";
import "./FindPwPage.css";
import logoImage from "../../../assets/img/logo.png";
import findPwIcon from "../../../assets/img/findPw.png";
import findEmailIcon from "../../../assets/img/findEmail.png";
import authIcon from "../../../assets/img/auth.png";
import alertIcon from "../../../assets/img/alert.png";

const FindPwPage: React.FC = () => {
  const [clickBtn, setClickBtn] = useState(false);
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [authcode, setAuthcode] = useState("");

  const handleIdChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setId(event.target.value);

  const handleEmailChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setEmail(event.target.value);

  const handleAuthcodeChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setAuthcode(event.target.value);

  //삭제 아이콘 클릭 시 아이디 값을 빈 문자열로 설정
  const handleClearId = () => setId("");
  //삭제 아이콘 클릭 시 이메일 값을 빈 문자열로 설정
  const handleClearEmail = () => setEmail("");
  //삭제 아이콘 클릭 시 이메일 값을 빈 문자열로 설정
  const handleClearAuthcode = () => setAuthcode("");

  return (
    <div className="findpw-container">
      <img src={logoImage} alt="PJA Logo" className="logo" />
      <h2 className="title">비밀번호 찾기</h2>

      <div className="form-group">
        <label htmlFor="username">아이디</label>
        <div className="input-wrapper">
          <img src={findPwIcon} alt="아이디 아이콘" className="icon" />
          <input
            type="text"
            id="username"
            placeholder="아이디"
            value={id}
            onChange={handleIdChange}
          />
          {id && (
            <button
              type="button"
              onClick={handleClearId}
              className="findpw-clear-id-icon"
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

      <div className="form-group">
        <label htmlFor="email">이메일</label>

        <div className="input-wrapper">
          <img src={findEmailIcon} alt="이메일 아이콘" className="icon" />
          <input
            type="email"
            id="email"
            placeholder="이메일"
            value={email}
            onChange={handleEmailChange}
          />
          {email && (
            <button
              type="button"
              onClick={handleClearEmail}
              className="findpw-clear-email-icon"
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

          <div className="button-group">
            {!clickBtn && <button className="btn small">인증번호 받기</button>}
            {clickBtn && (
              <button className="btn small">인증번호 다시 보내기</button>
            )}
          </div>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="code">인증번호</label>
        <div className="input-wrapper">
          <img src={authIcon} alt="이메일 아이콘" className="icon" />
          <input
            type="text"
            id="code"
            placeholder="인증번호를 입력하세요."
            value={authcode}
            onChange={handleAuthcodeChange}
          />
          {authcode && (
            <button
              type="button"
              onClick={handleClearAuthcode}
              className="findpw-clear-email-icon"
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

          <div className="button-item">
            <button className="btn confirm">확인</button>
          </div>
        </div>
        {/* <p className="error">*인증번호가 틀렸습니다</p> */}
      </div>

      <div className="bottom-check">
        <div className="tooltip-wrapper">
          <img src={alertIcon} alt="알림아이콘" className="alert-icon" />
          <span>인증메일을 받지 못 하셨나요?</span>
          <span className="tooltip-text">
            <p>
              전송한 메일함을 확인하시고, 이름과 이메일을 정확히 입력했는지
              확인해 주세요.{" "}
            </p>
            <p>메일 수신까지 다소 시간이 걸릴 수 있습니다.</p>
          </span>
        </div>
      </div>

      <div className="btn-container">
        <button className="btn reset">비밀번호 재설정</button>
      </div>
    </div>
  );
};

export default FindPwPage;
