import React, { useState } from "react";
import { useEffect } from "react";
import type { ChangeEvent } from "react";
import "./AccountSettingPage.css";
import profileIcon from "../../assets/img/profile.png";
import profilepersonIcon from "../../assets/img/profileperson.png";
import profilelockIcon from "../../assets/img/profilelock.png";
import { validateNewPassword } from "./newPasswordValidator";

//백엔드 api 응답 타입 정의
interface UserInfoResponse {
  status: string;
  message: string;
  data: {
    name: string;
    prosileImage: string;
  };
}

interface ErrorResponse {
  status: string;
  message: string;
}

const AccountSettingPage: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  //프로필 변경
  const [profileImage, setProfileImage] = useState<string | null>(null);

  //비밀번호 중복 확인
  const [isPasswordChecked, setIsPasswordChecked] = useState<boolean>(false);

  //로딩 및 에러 상태
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchUserInfo();
  }, []);

  //사용자 정보 조회
  //const fetchUserInfo=async()=>{
  //  try{
  //    setIsLoading(true);
  //    setError("");

  //LocalStorage에서 accessToken 가져오기
  //    const accessToken=localStorage.getItem('accessToken');

  //    if(!accessToken) {
  //      throw new Error('인증 토큰이 없습니다.');
  //    }

  //    const response=await fetch('http://localhost:8080/api/user/read-info',{
  //      method:'GET',
  //      headers: {
  //        'Authorization': `Bearer ${accessToken}`,
  //        'Content-Type': 'application/json',
  //      },
  //    });

  //    if (!response.ok){
  //      const errorData:ErrorResponse=await response.json();
  //      throw new Error(errorData.message || '사용자 정보 조회에 실패했습니다.');
  //    }

  //    const data:UserInfoResponse=await response.json();
  //
  //    setName(data.data.name || "");

  //  }

  //};

  const handleNameChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setName(event.target.value);

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPassword(event.target.value);
  };

  const handleNewPasswordChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const newPasswordValue = event.target.value;
    setNewPassword(event.target.value);
    const validation = validateNewPassword(newPasswordValue);
    setPasswordValidation(validation);

    //비밀번호 확인과 일치 여부 검사
    const confirmValidation = validatePasswordConfirmation(
      newPasswordValue,
      confirmNewPassword
    );
    setConfirmPasswordValidation(confirmValidation);
  };

  const handleConfirmNewPasswordChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    const confirmValue = event.target.value as string;
    setConfirmNewPassword(confirmValue);

    // 비밀번호 일치 여부 검사
    const confirmValidation = validatePasswordConfirmation(
      newPassword,
      confirmValue
    );
    setConfirmPasswordValidation(confirmValidation);
  };

  //비밀번호 유효성 검사 상태
  const [passwordValidation, setPasswordValidation] = useState<{
    isValid: boolean;
    message: string;
  }>({ isValid: false, message: "" });

  //비밀번호 유효성 검사 상태
  const [confirmPasswordValidation, setConfirmPasswordValidation] = useState<{
    isValid: boolean;
    message: string;
  }>({ isValid: true, message: "" });

  //비밀번호 확인 검증 함수
  const validatePasswordConfirmation = (
    newPassword: string,
    confirmPassword: string
  ) => {
    if (!confirmPassword) {
      return {
        isValid: true, //빈 값일때는 오류 표시안함
        message: "",
      };
    }

    if (newPassword !== confirmPassword) {
      return {
        isValid: false,
        message: "비밀번호가 일치하지 않습니다.",
      };
    }
    return {
      isValid: true,
      message: "",
    };
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  //삭제 아이콘 클릭 시 아이디 값을 빈 문자열로 설정
  const handleClearName = () => setName("");
  const handleClearPassword = () => setPassword("");
  // 새 비밀번호 입력 초기화
  const handleClearNewPassword = () => {
    setNewPassword("");
  };

  // 새 비밀번호 확인 입력 초기화
  const handleClearConfirmNewPassword = () => {
    setConfirmNewPassword("");
    setConfirmPasswordValidation({ isValid: true, message: "" }); // 초기화시 검증 상태도 리셋
  };

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };
  return (
    <div>
      <div className="accountsetting-wrapper">
        <h1 className="accountsetting-title">계정설정</h1>
        <div className="underline" />
        <div className="accountsetting-content">
          <div className="profile-title">프로필 변경</div>

          <div className="profile-image-container">
            <div
              className="profile-image"
              style={{
                backgroundImage: profileImage ? `url(${profileImage})` : "none",
              }}
            ></div>
            <label htmlFor="imageUpload" className="image-upload-button">
              <img src={profileIcon} alt="프로필 이미지" />
            </label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>
          <div className="profile-input-section">
            <div className="profile-input-wrapper">
              <div className="profile-name-title">이름</div>
              <div className="profile-id-wrapper">
                <img
                  src={profilepersonIcon}
                  alt="이메일"
                  className="profile-icon-inside"
                />
                <input
                  type="text"
                  placeholder="이름"
                  className="profile-id-input"
                  value={name}
                  onChange={handleNameChange}
                />
                {name && (
                  <button
                    type="button"
                    onClick={handleClearName}
                    className="profile-clear-icon"
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
                <div className="profile-button-item">
                  <button className="profile btn confirm">변경</button>
                </div>
              </div>
            </div>
            <div className="profile-pw-change-wrapper">
              <div className="pw-change-title">비밀번호 변경</div>
              {/*현재 비밀번호*/}
              <div className="profile-pw-input-wrapper">
                <div className="profile-pw-title">현재 비밀번호</div>
                <div className="profile-pw-wrapper">
                  <img
                    src={profilelockIcon}
                    alt="현재 비밀번호"
                    className="profile-pw-icon-inside"
                  />
                  <input
                    type={showPassword ? "text" : "password"} /*tetx와 passord*/
                    placeholder="비밀번호"
                    className="profile-pw-input"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                  {/*비밀번호 보이기/숨기기 버튼*/}
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="visibility-toggle-icon" /* 새 CSS 클래스 */
                    aria-label={
                      showPassword ? "비밀번호 숨기기" : "비밀번호 보기"
                    }
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
                      className="profile-clear-icon"
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
              {/*새 비밀번호*/}
              <div className="profile-new-pw-input-wrapper">
                <div className="profile-new-pw-title">새 비밀번호</div>
                <div className="profile-new-pw-wrapper">
                  <img
                    src={profilelockIcon}
                    alt="새 비밀번호"
                    className="profile-pw-icon-inside"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="새 비밀번호"
                    className="profile-new-pw-input"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                  />
                  {/*비밀번호 보이기/숨기기 버튼*/}
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="visibility-toggle-icon" /* 새 CSS 클래스 */
                    aria-label={
                      showPassword ? "비밀번호 숨기기" : "비밀번호 보기"
                    }
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
                  {newPassword && (
                    <button
                      type="button"
                      onClick={handleClearNewPassword}
                      className="profile-clear-icon"
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
                {/*유효성 검사*/}
                {!passwordValidation.isValid && newPassword && (
                  <div className="password-error-message">
                    {passwordValidation.message}
                  </div>
                )}
              </div>
              <div className="profile-new-pwcf-input-wrapper">
                <div className="profile-new-pwcf-title">비밀번호 확인</div>
                <div className="profile-new-pwcf-wrapper">
                  <img
                    src={profilelockIcon}
                    alt="비밀번호 확인"
                    className="profile-pw-icon-inside"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호 확인"
                    className="profile-new-pwcf-input"
                    value={confirmNewPassword}
                    onChange={handleConfirmNewPasswordChange}
                  />
                  {/*비밀번호 보이기/숨기기 버튼*/}
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="visibility-toggle-icon" /* 새 CSS 클래스 */
                    aria-label={
                      showPassword ? "비밀번호 숨기기" : "비밀번호 보기"
                    }
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
                  {newPassword && (
                    <button
                      type="button"
                      onClick={handleClearConfirmNewPassword}
                      className="profile-clear-icon"
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
                  <div className="profile-new-button-item">
                    <button className="profile new btn confirm">변경</button>
                  </div>
                </div>
                {!confirmPasswordValidation.isValid && confirmNewPassword && (
                  <div className="password-error-message">
                    {confirmPasswordValidation.message}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingPage;
