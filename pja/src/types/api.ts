export type RequestField = {
  field: string;
  type: string;
  example: string;
};

export type ResponseData = {
  field: string;
  type: string;
  example: string;
};

export type ResponseSpec = {
  status_code: string;
  message: string;
  data: ResponseData[];
};

export type ApiSpecification = {
  id: number;
  title: string;
  tag: string;
  path: string;
  http_method: string;
  request: RequestField[];
  response: ResponseSpec[];
};

// ✅ 2. 백엔드에서 내려주는 데이터 구조 정의
export type BackendApiSpec = {
  apiId: number;
  title: string;
  tag: string;
  path: string;
  httpMethod: string;
  request: RequestField[];
  response: {
    statusCode: string;
    message: string;
    data: ResponseData[];
  }[];
};

//API 생성 요청 Body 타입
export interface CreateApiRequest {
  tag: string;
  path: string;
  httpMethod: string;
  request: RequestField[];
  response: Array<{
    statusCode: string;
    message: string;
    data: ResponseData[];
  }>;
}

//API 생성 성공 응답 데이터 타입
export interface CreatedApiData {
  id: number;
  tag: string;
  path: string;
  httpMethod: string;
  request: RequestField[];
  response: Array<{
    statusCode: string;
    message: string;
    data: ResponseData[];
  }>;
}

export interface ApiSuccessResponse<T> {
  status: "success";
  message: string;
  data: T;
}

// 공통 실패/에러 응답 타입
export interface ApiErrorResponse {
  status: "fail" | "error";
  message: string;
}

//GET api
export interface GetApisResponse {
  status: "success";
  message: string;
  data: BackendApiSpec[];
}

//api 명세서 요청/응답 필드
export interface ApiField {
  field: string;
  type: string;
  example: string | number | boolean;
}

//응답 상태 코드별 상세 정보
export interface ApiResponseDetail {
  statusCode: string;
  message: string;
  data: ApiField[];
}

//단일 API 명세서 구조
export interface ApiSpec {
  apiId: number;
  title: string;
  tag: string;
  path: string;
  httpMethod: string;
  request: ApiField[];
  response: ApiResponseDetail[];
}

// API 명세서 생성 성공 시 응답 타입
export interface GenerateApiResponse {
  status: "success";
  message: string;
  data: ApiSpec[];
}
