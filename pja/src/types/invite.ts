export interface InviteRequest {
  emails: string[];
  role: "MEMBER" | "ADMIN";
}

// API 성공 응답의 data 필드 타입을 정의
export interface InviteSuccessData {
  invitedEmails: string[];
  role: "MEMBER" | "ADMIN";
}

export interface InviteApiResponse {
  status: "success" | "fail" | "error";
  message: string;
  data?: any;
}

export type MemberRole = "MEMBER" | "ADMIN";
export interface Member {
  memberId: string;
  name: string;
  email: string;
  profile: string | null;
  role: MemberRole;
}
