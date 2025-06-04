interface PasswordValidationResult {
  isValid: boolean;
  message: string;
}

const PASSWORD_VALIDATION_MESSAGES = {
  EMPTY: "비밀번호를 입력해주세요",
  LENGTH: "비밀번호는 8자 이상 16자 이하로 입력해주세요",
  COMBINATION:
    "비밀번호는 영문 대/소문자, 숫자, 특수문자 중 3가지 이상 조합해야 합니다",
};

const SPECIAL_CHAR_REGEX = /[!@#$%^&*()]/;

export const validatePassword = (
  password: string
): PasswordValidationResult => {
  // 1. 빈 값(필수 입력) 검사
  if (!password) {
    // 비밀번호는 trim하지 않고 원본으로 검사 (공백도 비밀번호의 일부일 수 있음)
    return { isValid: false, message: PASSWORD_VALIDATION_MESSAGES.EMPTY };
  }

  // 2. 길이 검사 (8-20자)
  if (password.length < 8 || password.length > 16) {
    return {
      isValid: false,
      message: PASSWORD_VALIDATION_MESSAGES.LENGTH,
    };
  }

  // 3. 문자 조합 검사
  let strength = 0;
  if (/[A-Z]/.test(password)) strength++; // 영문 대문자
  if (/[a-z]/.test(password)) strength++; // 영문 소문자
  if (/[0-9]/.test(password)) strength++; // 숫자
  if (SPECIAL_CHAR_REGEX.test(password)) strength++; // 특수문자

  if (strength < 3) {
    return {
      isValid: false,
      message: PASSWORD_VALIDATION_MESSAGES.COMBINATION,
    };
  }

  // 모든 유효성 검사 통과
  return { isValid: true, message: "" };
};
