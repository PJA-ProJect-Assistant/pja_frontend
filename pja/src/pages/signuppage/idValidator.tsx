//import "./idValidator.css";

interface IdValidationResult {
  isValid: boolean;
  message: string;
}

//에러 메세지 상수화
const ID_VALIDATION_MESSAGES = {
  EMPTY: "",
  LENGTH: "아이디는 5~20자의 영문, 숫자를 사용해주세요(특수문자, 공백 금지)",
  PATTERN: "아이디는 5~20자의 영문, 숫자를 사용해주세요(특수문자, 공백 금지)",
  NUMERIC_ONLY:
    "아이디는 5~20자의 영문, 숫자를 사용해주세요(특수문자, 공백 금지)",
};

export const validateId = (id: string): IdValidationResult => {
  const trimmedId = id.trim();
  // 0. 빈 문자열 검사
  if (!trimmedId) {
    // trimmedId가 비어있을 시 실행
    return { isValid: false, message: ID_VALIDATION_MESSAGES.EMPTY };
  }

  // 1. 길이 검사 (5-20자)
  if (trimmedId.length < 5 || trimmedId.length > 20) {
    return {
      isValid: false,
      message: ID_VALIDATION_MESSAGES.LENGTH,
    };
  }

  // 2. 영문과 숫자만 허용 (공백 포함 특수문자 금지)
  const validPattern = /^[a-zA-Z0-9]+$/;
  if (!validPattern.test(trimmedId)) {
    return {
      isValid: false,
      message: ID_VALIDATION_MESSAGES.PATTERN,
    };
  }

  // 3. 숫자로만 구성된 경우 금지
  const onlyNumbersPattern = /^[0-9]+$/;
  if (onlyNumbersPattern.test(trimmedId)) {
    return {
      isValid: false,
      message: ID_VALIDATION_MESSAGES.NUMERIC_ONLY,
    };
  }

  // 모든 유효성 검사 통과
  return { isValid: true, message: "" }; // 성공 시 빈 메시지
};
