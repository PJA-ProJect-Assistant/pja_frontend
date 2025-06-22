// 로그인 성공 응답 타입
export interface userToken {
  accessToken: string;
  refreshToken: string;
}

//회원 탈퇴 비밀번호 확인
export interface CheckPasswordRequest {
  password: string;
}
