// 단일 필드 정의
export interface ERDField {
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
