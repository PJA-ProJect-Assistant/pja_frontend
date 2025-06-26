import type { workspace_member } from "./workspace";

//카테고리랑 기능 state boolean인데 지금만 Status로
export type Status = "BEFORE" | "IN_PROGRESS" | "DELETE" | "PENDING" | "DONE";

export interface aiRecommendCateories {
  workspace_id: number;
  recommendedCategories: [
    {
      name: string;
      features: [
        {
          name: string;
          actions: [{ name: string; Importance: Importance }];
        }
      ];
    }
  ];
}

export interface feature_category {
  featureCategoryId: number;
  name: string;
  state: boolean;
  orderIndex: number;
  hasTest: boolean | null;
  features: feature[];
}
export interface feature {
  featureId: number;
  name: string;
  state: boolean;
  hasTest: boolean | null;
  orderIndex: number;
  actions: action[];
}

export type Importance = 0 | 1 | 2 | 3 | 4 | 5;
export interface responseactionid {
  actionId: number;
  actionPostId: number | null;
}

export interface action extends responseactionid {
  name: string;
  startDate: Date | null;
  endDate: Date | null;
  state: Status;
  hasTest: boolean;
  importance: Importance;
  orderIndex: number;
  participants: workspace_member[];
}

export interface getaction {
  actionId: number;
  actionName: string;
  startDate: Date | null;
  endDate: Date | null;
  actionPostId: number | null;
}

export interface listresponse {
  coreFeatures: string[];
  participants: workspace_member[];
  featureCategories: feature_category[];
}

export interface filtered {
  selectedCategories: number[];
  selectedAssignees: number[];
  selectedStatuses: Status[];
}
export interface getaiaction {
  workspaceId: number;
  categoryId: number;
  featureId: number;
  recommendedActions: recommendedActions[];
}
export interface recommendedActions {
  name: string;
  importance: Importance;
  startDate: Date;
  endDate: Date;
}

export interface myActionList {
  actionId: number;
  actionName: string;
  endDate: Date;
  state: Status;
  importance: Importance;
}
export interface myProgress {
  total: number;
  done: number;
}

export interface taskimbalance {
  graphData: imbalancegraphData[];
  assigness: imbalanceassignees[];
}

export interface imbalancegraphData {
  memberId: number;
  username: string;
  state: Status;
  importance: Importance;
  taskCount: number;
}
export interface imbalanceassignees {
  userId: number,
  username: string,
}

export interface processtime {
  userId: number;
  username: string;
  importance: Importance;
  meanHours: number;
}

export interface wsActivity {
  username: string;
  userProfile: string | null;
  actionType: string;
  targetType: string;
  relativeDateLabel: string;
}
