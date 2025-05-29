import { useState } from "react";
import logoImage from "../../../assets/img/logo.png";
import "./FindIdPage.css";
import findEmailIcon from "../../../assets/img/findEmail.png";
const FindIdPage = () => {
  const [email, setEmail] = useState("");
  /*아이디 찾기 버튼 클릭 시 모달창*/
  const [showModal, setShowModal] = useState(false);

  const handleEmailChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setEmail(event.target.value);
  //삭제 아이콘 클릭 시 이메일 값을 빈 문자열로 설정
  const handleClearEmail = () => setEmail("");

  const handleFindId = () => {
    setShowModal(true);
  };
  /*모달창 추가*/
  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="findid-container">
        <div className="findid-box">
          <div className="findid-wrapper">
            <img src={logoImage} alt="logo" className="logo-image" />
          </div>
          <h1 className="findid-title">아이디 찾기</h1>
          <div className="input-wrapper">
            <img
              src={findEmailIcon}
              alt="이메일"
              className="findemail-icon-inside"
            />
            <div className="find-email-title">이메일</div>
            <input
              type="text"
              placeholder="이메일"
              className="find-email-input"
              value={email}
              onChange={handleEmailChange}
            />
            {email && (
              <button
                type="button"
                onClick={handleClearEmail}
                className="clear-icon findid-clear-icon"
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
          <div className="findid-section">
            <button
              type="button"
              onClick={handleFindId}
              className="findid-button"
            >
              아이디 찾기
            </button>
          </div>
        </div>
      </div>
      /*모달창 */
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header" />
            <p>
              아이디는 <strong>OOO</strong>입니다
            </p>
            {/*확인 버튼이 있는 모달 푸터*/}
            <div className="modal-footer">
              <button
                type="button"
                className="modal-close-button"
                onClick={handleCloseModal}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default FindIdPage;
