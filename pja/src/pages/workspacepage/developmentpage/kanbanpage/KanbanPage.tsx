import { useNavigate } from "react-router-dom";
import { useCategoryFeatureCategory } from "../../../../hooks/useCategoryFeatureAction";
import type { Status } from "../../../../types/list";
import { statusLabels, statusColors } from "../../../../constants/statecolor";
import {
  PointerSensor,
  useSensor,
  DndContext,
  useSensors,
  useDraggable,
  useDroppable,
  type DragEndEvent,
} from "@dnd-kit/core";

import "./KanbanPage.css";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
export default function KanbanPage() {
  const navigate = useNavigate();
  const { categoryList, workspaceId, updateStatus } =
    useCategoryFeatureCategory();

  const Role = useSelector((state: RootState) => state.user.userRole);
  const CanEdit: boolean = Role === "OWNER" || Role === "MEMBER";

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

  function DraggableAction({
    actionId,
    children,
    canEdit,
  }: {
    actionId: number;
    children: React.ReactNode;
    canEdit: boolean;
  }) {
    if (!canEdit) {
      // 드래그 비활성화된 유저는 그냥 감싸기만
      return <div>{children}</div>;
    }

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id: actionId.toString(),
    });

    const style: React.CSSProperties | undefined = transform
      ? {
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
          zIndex: 999,
          position: "relative",
          cursor: "grab",
        }
      : undefined;

    return (
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={{ cursor: "grab", ...style }}
      >
        {children}
      </div>
    );
  }

  function DroppableColumn({
    status,
    children,
  }: {
    status: Status;
    children: React.ReactNode;
  }) {
    const { setNodeRef } = useDroppable({
      id: status,
    });

    return (
      <div
        ref={setNodeRef}
        id={status}
        className="kanban-column"
        style={{ backgroundColor: statusBgColors[status] }}
      >
        <div className="kanban-column-title">{statusLabels[status]}</div>
        {children}
      </div>
    );
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const actionId = Number(active.id);
      const newStatus = over.id as Status;

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
            <DraggableAction
              key={`${cg.featureCategoryId}-${ft.featureId}-${ac.actionId}`}
              actionId={ac.actionId}
              canEdit={CanEdit}
            >
              <div className="kanban-category">
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
            </DraggableAction>
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
          <DroppableColumn status={statusKey} key={statusKey}>
            {renderKanbanCards(statusKey)}
          </DroppableColumn>
        ))}
      </div>
    </DndContext>
  );
}
