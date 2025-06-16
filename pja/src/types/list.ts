import type { workspace_member } from "./workspace";

export interface feature_category {
    featureCategoryId: number,
    name: string,
    state: boolean,
    orderIndex: number,
    has_test: boolean | null,
    features: feature[],
}
export interface feature {
    featureId: number;
    name: string;
    state: boolean;
    hasTest: boolean | null;
    orderIndex: number;
    actions: action[];
}
// 이거 status바뀐건지 물어보기
export type Status = "BEFORE" | "IN_PROGRESS" | "DONE";
export type Importance = 0 | 1 | 2 | 3 | 4 | 5;
export interface action {
    actionId: number;
    name: string;
    startDate: string;
    endDate: string;
    state: Status;
    hasTest: boolean;
    importance: Importance;
    orderIndex: number;
    actionPostId: number | null;
    participants: workspace_member[];
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