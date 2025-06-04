interface NameValidationResult {
  isValid: boolean;
  message: string;
}

const NAME_VALIDATION_MESSAGES = {
  EMPTY: "이름을 입력해주세요",
  PATTERN: "이름은 한글 또는 영문자만 사용할 수 있습니다 (특수문자, 공백 금지)",
};

export const validateName = (name: string): NameValidationResult => {
  const trimmedName = name.trim();

  // 1. 빈 값(필수입력) 검사
  if (!trimmedName) {
    return { isValid: false, message: NAME_VALIDATION_MESSAGES.EMPTY };
  }

  // 2. 한글 또는 영문자만 허용(공백, 숫자, 특수문자 허용)
  const validPattern = /^[a-zA-Z가-힣]+$/;
  if (!validPattern.test(trimmedName)) {
    return {
      isValid: false,
      message: NAME_VALIDATION_MESSAGES.PATTERN,
    };
  }

  // 모든 유효성 검사 통과
  return { isValid: true, message: "" };
};
