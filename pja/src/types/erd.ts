// 단일 필드 정의
export interface ERDField {
  id: string,
  name: string;
  type: string | null; // 일부 필드에서 null 허용
  primary: boolean;
  nullable: boolean;
  foreign: boolean;
}

// 테이블 정의
export interface ERDTable {
  id: string; // ReactFlow 노드 ID
  tableName: string;
  fields: ERDField[];
}

// 관계 정의 (Edge에 해당)
export interface ERDRelation {
  id: string; // ReactFlow 엣지 ID
  source: string; // 출발 노드 id (예: "User")
  target: string; // 도착 노드 id (예: "Students")
  sourceHandle: string; // 출발 필드 핸들 ID (예: "source-stunum")
  targetHandle: string; // 도착 필드 핸들 ID (예: "target-id")
  label: string; // 관계 라벨 (예: "1:1")
}

export type RelationType = "ONE_TO_ONE" | "ONE_TO_MANY"
  | "MANY_TO_ONE" | "MANY_TO_MANY" | "SELF_REFERENCE" | "INHERITANCE"

//erd관계 생성 시 보내야할 데이터 구조{
export interface setRelation {
  fromTableId: string,
  toTableId: string,
  foreignKeyId: string,
  toTableKeyId: string,
  foreignKeyName: string,
  constraintName: string,
  type: RelationType,
}

// 전체 데이터 구조
export interface ERDData {
  tables: ERDTable[];
  relations: ERDRelation[];
}

//erd 생성 시 받는 response 구조
export interface geterd {
  erdId: number;
  createAt: Date;
  workspaceId: number;
  tables?: ERDTable;
}

//erd table 생성 후 성공 응답
export interface gettable {
  erdId: number,
  tableId: string,
  tableName: string,
}

//erd 컬럼 생성 후 성공 응답
export interface getcolumn {
  columnId: string,
  tableId: string,
  columnName: string,
  columnType: string | null,
  primaryKey: boolean;
  nullable: boolean;
  foreignKey: boolean;
}

export interface getrelation {
  relationId: string,
  relationType: string,
  foreignKeyName: string,
  constraintName: string,
  fromTable: {
    erdId: number,
    tableId: string,
    tableName: String,
  }
  toTable: {
    erdId: number,
    tableId: string,
    tableName: String,
  }
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
