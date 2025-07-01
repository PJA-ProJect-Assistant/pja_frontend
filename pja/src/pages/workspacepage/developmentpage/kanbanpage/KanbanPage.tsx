import { useNavigate } from "react-router-dom";
import { useCategoryFeatureCategory } from "../../../../hooks/useCategoryFeatureAction";
import type { Status } from "../../../../types/list";
import { statusLabels, statusColors } from "../../../../constants/statecolor";
import {
  PointerSensor,
  useSensor,
  DndContext,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";

import "./KanbanPage.css";
export default function KanbanPage() {
  const navigate = useNavigate();
  const { categoryList, workspaceId, updateStatus } =
    useCategoryFeatureCategory();

  const statusBgColors: Record<Status, string> = {
    BEFORE: "rgba(217, 217, 214, 0.2)",
    IN_PROGRESS: "rgba(254, 195, 0, 0.2)",
    DONE: "rgba(254, 80, 0, 0.2)",
    PENDING: "rgba(80, 181, 255, 0.2)",
    DELETE: "rgba(255, 77, 79, 0.2)",
  };

  // ✅ 남은 날짜 계산 함수
  const getRemainingDays = (endDate?: Date): string => {
    if (!endDate) return "-";
    const today = new Date();
    // 시/분/초 제거 (날짜 비교 정확성 확보)
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(endDate);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "D-DAY";
    if (diffDays > 0) return `D-${diffDays}`;
    return `D+${Math.abs(diffDays)}`;
  };

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    // active.id는 actionId (string)
    // over.id는 statusKey (string)
    if (active.id !== over.id) {
      const actionId = Number(active.id);
      const newStatus = over.id as Status;

      // 액션이 속한 categoryId, featureId 찾기
      let categoryId = 0;
      let featureId = 0;

      outer: for (const cg of categoryList) {
        for (const ft of cg.features) {
          if (ft.actions.find((ac) => ac.actionId === actionId)) {
            categoryId = cg.featureCategoryId;
            featureId = ft.featureId;
            break outer;
          }
        }
      }

      if (categoryId && featureId && actionId) {
        updateStatus(categoryId, featureId, actionId, newStatus);
      }
    }
  };

  const renderKanbanCards = (statusKey: Status) => {
    return categoryList.flatMap((cg) =>
      cg.features.flatMap((ft) =>
        ft.actions
          .filter((ac) => ac.state === statusKey)
          .map((ac) => (
            <div
              className="kanban-category"
              key={`${cg.featureCategoryId}-${ft.featureId}-${ac.actionId}`}
              draggable
            >
              <div
                className="category-title"
                style={{ backgroundColor: statusColors[statusKey] }}
              >
                {cg.name}
              </div>

              <div className="feature-block">
                <div className="feature-title">{ft.name}</div>
                {/* 액션 하나만 있으므로 바로 액션 카드 */}
                <div className="kanban-action-card" key={ac.actionId}>
                  <div className="kanban-action-title">
                    <span
                      onClick={() =>
                        navigate(
                          `/ws/${workspaceId}/post/action/${ac.actionId}/${ac.actionPostId}`
                        )
                      }
                    >
                      {ac.name}
                    </span>
                    <p>{getRemainingDays(ac.endDate ?? undefined)}</p>
                  </div>
                  <div className="kanban-action-card-content">
                    <div className="kanban-parti">
                      {ac.participants?.map((member) =>
                        member?.profileImage ? (
                          <img
                            key={member.memberId}
                            src={member.profileImage}
                            alt={member.username}
                            className="listprofile-img"
                            title={member.username}
                          />
                        ) : (
                          <div
                            key={member.memberId}
                            className="listprofile-none"
                            title={member.username}
                          >
                            {member.username.charAt(0)}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
      )
    );
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="kanban-board">
        {(
          ["BEFORE", "IN_PROGRESS", "DONE", "PENDING", "DELETE"] as Status[]
        ).map((statusKey) => (
          <div
            id={statusKey}
            className="kanban-column"
            key={statusKey}
            style={{ backgroundColor: statusBgColors[statusKey] }}
          >
            <div className="kanban-column-title">{statusLabels[statusKey]}</div>
            {renderKanbanCards(statusKey)}
          </div>
        ))}
      </div>
    </DndContext>
  );
}
