import { useNavigate } from "react-router-dom";
import { useCategoryFeatureCategory } from "../../../../hooks/useCategoryFeatureAction";
import type { Status } from "../../../../types/list";

import "./KanbanPage.css"
import { Members } from "../../../../constants/userconstants";
export default function KanbanPage() {
    const navigate = useNavigate();
    const {
        categoryList,
        featuresByCategoryId,
        actionsByFeatureId,
    } = useCategoryFeatureCategory();

    const statusLabels: Record<Status, string> = {
        NOT_STARTED: "진행 전",
        IN_PROGRESS: "진행 중",
        COMPLETED: "완료",
    };

    const statusColors: Record<Status, string> = {
        NOT_STARTED: "#d9d9d6",
        IN_PROGRESS: "#fec300",
        COMPLETED: "#fe5000",
    };

    const statusBgColors: Record<Status, string> = {
        NOT_STARTED: "rgba(217, 217, 214, 0.2)",
        IN_PROGRESS: "rgba(254, 195, 0, 0.2)",
        COMPLETED: "rgba(254, 80, 0, 0.2)",
    };

    return (
        <div className="kanban-board">
            {(["NOT_STARTED", "IN_PROGRESS", "COMPLETED"] as Status[]).map((statusKey) => (
                <div className="kanban-column" key={statusKey}
                    style={{ backgroundColor: statusBgColors[statusKey] }}>
                    <div className="kanban-column-title">{statusLabels[statusKey]}</div>

                    {categoryList
                        .filter((cg) => {
                            const features = featuresByCategoryId.get(cg.feature_category_id) || [];

                            return features.some((ft) => {
                                const actions = actionsByFeatureId.get(ft.feature_id) || [];
                                return actions.some((ac) => ac.status === statusKey);
                            });
                        }).map((cg) => (
                            <div className="kanban-category" key={cg.feature_category_id}>
                                <div className="category-title" style={{
                                    backgroundColor: statusColors[statusKey]
                                }}>{cg.name}</div>

                                {(featuresByCategoryId.get(cg.feature_category_id) || []).map((ft) => {
                                    const actions = (actionsByFeatureId.get(ft.feature_id) || []).filter(
                                        (ac) => ac.status === statusKey
                                    );

                                    if (actions.length === 0) return null;

                                    return (
                                        <div className="feature-block" key={ft.feature_id}>
                                            <div className="feature-title"
                                            >{ft.name}</div>
                                            {actions.map((ac) => (
                                                <div className="kanban-action-card" key={ac.action_id}>
                                                    <span onClick={() =>
                                                        navigate(
                                                            `/ws/${cg.workspace_id}/action/${ac.action_id}`
                                                        )
                                                    }>{ac.name}</span>
                                                    {/* <span>{ac.end_date?.getDate(yyyy - mm - dd)}</span> */}
                                                    <div className="kanban-action-card-content">
                                                        <div className="kanban-parti">
                                                            {
                                                                ac.assignee_id?.map((member) => {
                                                                    const userInfo = Members.find((m) => m.user_id === member);

                                                                    return userInfo?.profile_image ? (
                                                                        <img
                                                                            key={member}
                                                                            src={userInfo.profile_image}
                                                                            alt={userInfo.name}
                                                                            className="listprofile-img"
                                                                            title={userInfo?.name}
                                                                        />
                                                                    ) : (
                                                                        <div key={member} className="listprofile-none" title={userInfo?.name}>
                                                                            {userInfo?.name.charAt(0)}
                                                                        </div>
                                                                    );
                                                                })
                                                            }
                                                        </div>
                                                    </div>

                                                </div>
                                            ))}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                </div>
            ))
            }
        </div >
    )
}