import type { action, feature, feature_category } from "../types/list";

const featureCategories: feature_category[] = [
    {
        feature_catefory_id: 1,
        name: "회원 관리",
        state: true,
        order: 1,
        workspace_id: 101,
        has_test: true,
    },
    {
        feature_catefory_id: 2,
        name: "결제 시스템",
        state: true,
        order: 2,
        workspace_id: 101,
        has_test: false,
    },
];

const features: feature[] = [
    {
        feature_id: 1,
        name: "회원가입",
        category_id: 1,
        state: true,
        order: 1,
        has_test: true,
    },
    {
        feature_id: 2,
        name: "로그인",
        category_id: 1,
        state: false,
        order: 2,
        has_test: false,
    },
    {
        feature_id: 3,
        name: "카드 결제",
        category_id: 2,
        state: true,
        order: 1,
        has_test: true,
    },
];
const actions: action[] = [
    {
        action_id: 1,
        name: "회원가입 폼 UI",
        start_date: new Date("2025-06-01"),
        end_date: new Date("2025-06-03"),
        status: "NOT_STARTED",
        importance: 3,
        assignee_id: [1, 2],
        order: 1,
        has_test: false,
        feature_id: 1,
    },
    {
        action_id: 2,
        name: "로그인 API 연결",
        start_date: new Date("2025-06-04"),
        end_date: new Date("2025-06-06"),
        status: "IN_PROGRESS",
        importance: 4,
        assignee_id: [3],
        order: 1,
        has_test: false,
        feature_id: 2,
    },
    {
        action_id: 3,
        name: "카드 결제 테스트 코드 작성",
        start_date: new Date("2025-06-02"),
        end_date: new Date("2025-06-07"),
        status: "COMPLETED",
        importance: 5,
        assignee_id: [1],
        order: 1,
        has_test: true,
        feature_id: 3,
    },
];