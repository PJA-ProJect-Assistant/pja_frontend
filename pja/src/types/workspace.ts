export type Step = "0" | "1" | "2" | "3" | "4" | "5" | "6";

export interface workspace {
  workspaceId: number;
  projectName: string;
  teamName: string;
  ownerId: number;
  progressStep: Step;
  isPublic: boolean;
}

export interface setworkspace {
  projectName: string;
  teamName: string;
  isPublic: boolean;
}

export type Role = "OWNER" | "MEMBER" | "GUEST";

export interface workspace_member {
  workspace_member_id: number;
  user_id: number;
  workspace_id: number;
  role: Role;
  joined_at: Date;
}
