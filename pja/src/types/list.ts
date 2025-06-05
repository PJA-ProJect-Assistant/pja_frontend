export interface feature_category {
    feature_category_id: number,
    name: string,
    state: boolean,
    order: number,
    workspace_id: number,
    has_test: boolean,
}
export interface feature {
    feature_id: number,
    name: string,
    category_id: number,
    state: boolean,
    order: number,
    has_test: boolean,
}
export type Status = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
export type Importance = 0 | 1 | 2 | 3 | 4 | 5;
export interface action {
    action_id: number,
    name: string,
    start_date?: Date,
    end_date?: Date,
    status: Status
    importance?: Importance,
    has_test: boolean,
    assignee_id?: number[],
    order: number,
    feature_id: number,
}