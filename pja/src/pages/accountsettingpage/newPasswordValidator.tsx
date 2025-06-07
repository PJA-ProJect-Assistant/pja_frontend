//비밀번호 유효성 검사 결과 타입
export interface PasswordValidationResult {
  isValid: boolean;
  message: string;
}
//에러 메세지 함수
export const PASSWORD_VALIDATION_MESSAGES = {
  EMPTY: "비밀번호를 입력해주세요",
  LENGTH: "비밀번호는 8자 이상 16자 이하로 입력해주세요",
  COMBINATION:
    "비밀번호는 영문 대/소문자, 숫자, 특수문자 중 3가지 이상 조합해야 합니다",
};
//특수문자 정규식
const SPECIAL_CHAR_REGEX = /[!@#$%^&*()]/;

//실제 유효성 검사 함수
export const validateNewPassword = (
  password: string
): PasswordValidationResult => {
  // 1️⃣ 빈 값 검사
  if (!password) {
    return {
      isValid: false,
      message: PASSWORD_VALIDATION_MESSAGES.EMPTY,
    };
  }

  // 2️⃣ 길이 검사
  if (password.length < 8 || password.length > 16) {
    return {
      isValid: false,
      message: PASSWORD_VALIDATION_MESSAGES.LENGTH,
    };
  }

  // 3️⃣ 조합 검사 (3종 이상)
  let strength = 0;
  if (/[A-Z]/.test(password)) strength++; // 대문자
  if (/[a-z]/.test(password)) strength++; // 소문자
  if (/[0-9]/.test(password)) strength++; // 숫자
  if (SPECIAL_CHAR_REGEX.test(password)) strength++; // 특수문자

  if (strength < 3) {
    return {
      isValid: false,
      message: PASSWORD_VALIDATION_MESSAGES.COMBINATION,
    };
  }

  // ✅ 모든 조건 통과
  return {
    isValid: true,
    message: "",
  };
};
