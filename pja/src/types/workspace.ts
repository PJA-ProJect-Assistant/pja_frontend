export interface workspace {
  workspace_id: number;
  owner_id: number;
  team_name: string;
  project_name: string;
  created_at: Date;
  project_target: string;
  project_description: string;
  project_summary?: string;
  project_features: string; //json형태라서 나중에 가져오는 데이터 보고 바꿔야함함
  is_shared_agree: boolean;
  is_completed: boolean;
}

export type Role = "OWNER" | "MEMBER" | "GUEST";

export interface workspace_member {
  workspace_member_id: number;
  role: Role;
  joined_at: Date;
  user_id: number;
  workspace_id: number;
}
