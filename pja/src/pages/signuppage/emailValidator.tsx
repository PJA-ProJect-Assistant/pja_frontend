interface EmailValidationResult {
  isValid: boolean;
  message: string;
}

const EMAIL_VALIDATION_MESSAGES = {
  EMPTY: "이메일주소는 필수 정보입니다",
  INVALID_FORMAT: "이메일주소가 정확한지 확인해 주세요",
};

export const validateEmail = (email: string): EmailValidationResult => {
  const trimmedEmail = email.trim();

  // 1. 빈 값(필수 입력) 검사
  if (!trimmedEmail) {
    return { isValid: false, message: EMAIL_VALIDATION_MESSAGES.EMPTY };
  }

  // 2. 이메일 형식 검사
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return {
      isValid: false,
      message: EMAIL_VALIDATION_MESSAGES.INVALID_FORMAT,
    };
  }

  // 모든 유효성 검사 통과
  return { isValid: true, message: "" };
};
