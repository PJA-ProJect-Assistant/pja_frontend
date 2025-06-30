export interface CommentData {
  commentId: number;
  content: string;
  authorName: string;
  authorId: number;
  updatedAt: string;
  author: boolean;
}

export interface FileData {
  filePath: string;
  contentType: string;
}

export interface PostData {
  commentList: CommentData[];
  content: string;
  fileList: FileData[];
  actionName: string;
}
//API 응답 전체의 타입
export interface ApiResponse {
  status: "success" | "fail";
  message: string;
  data?: PostData; // 성공 시에만 존재할 수 있음
}

//수정 api 성공 응답 데이터 타입
export interface UpdateApiResponse {
  status: "success" | "fail" | "error";
  message: string;
  data?: PostData;
}

//댓글 생성 데이터 타입
export interface CreatedCommentData {
  commentId: number;
  createdAt: string;
  content: string;
  username: string;
}

export interface CreateCommentApiResponse {
  status: "success" | "fail" | "error";
  message: string;
  data?: CreatedCommentData;
}

//댓글 수정 데이터 타입
export interface UpdatedCommentData {
  commentId: number;
  createdAt: string;
  content: string;
  username: string;
}

export interface UpdateCommentApiResponse {
  status: "success" | "fail" | "error";
  message: string;
  data?: UpdatedCommentData;
}

export interface DeleteCommentApiResponse {
  status: "success" | "fail" | "error";
  message: string;
  data?: null; // data가 없을 수 있음
}
