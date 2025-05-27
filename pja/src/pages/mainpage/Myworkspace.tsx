import "./Myworkspace.css";
import { useRef } from "react";
import { Users } from "../../constants/userconstants";
import { dummyWorkspaces } from "../../constants/wsconstants";

export function Myworkspace() {
  const myWorkspaces = dummyWorkspaces.filter(
    (ws) => ws.owner_id === Users.user_id && ws.is_completed === false
  );
  const completews = dummyWorkspaces.filter(
    (ws) => ws.owner_id === Users.user_id && ws.is_completed === true
  );

  // 각각의 스크롤 영역에 대해 따로 참조 만들기
  const activeRef = useRef<HTMLDivElement>(null);
  const completeRef = useRef<HTMLDivElement>(null);

  // 드래그 로직 재사용 함수
  const useDragScroll = (ref: React.RefObject<HTMLDivElement | null>) => {
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    const handleMouseDown = (e: React.MouseEvent) => {
      isDragging.current = true;
      startX.current = e.pageX - (ref.current?.offsetLeft ?? 0);
      scrollLeft.current = ref.current?.scrollLeft ?? 0;
    };

    const handleMouseLeave = () => {
      isDragging.current = false;
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!isDragging.current || !ref.current) return;
      e.preventDefault();
      const x = e.pageX - ref.current.offsetLeft;
      const walk = x - startX.current;
      ref.current.scrollLeft = scrollLeft.current - walk;
    };

    return {
      onMouseDown: handleMouseDown,
      onMouseLeave: handleMouseLeave,
      onMouseUp: handleMouseUp,
      onMouseMove: handleMouseMove,
    };
  };

  const activeHandlers = useDragScroll(activeRef);
  const completeHandlers = useDragScroll(completeRef);

  const renderCards = (data: any[]) =>
    data.map((ws) => (
      <div key={ws.workspace_id} className="workspace-card">
        <div>
          <div className="workspace-more">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#000000"
            >
              <path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z" />
            </svg>
          </div>
          <div className="ws-title-container">
            <p className="workspace-title" title={ws.project_name}>
              {" "}
              {/* 마우스 가져다대면 title뜨는거 기본인데 나중에 시간 남으면 커스텀 해보기로! */}
              {ws.project_name}
            </p>
          </div>
        </div>
        <p className="workspace-team">{ws.team_name}</p>
      </div>
    ));

  return (
    <div className="workspacecontainer">
      <div className="ws-container-2">
        <p className="wstitle">내 워크스페이스</p>
        <div className="workspace-scroll" ref={activeRef} {...activeHandlers}>
          {renderCards(myWorkspaces)}
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#000000"
            >
              <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
            </svg>
          </button>
        </div>
        <p className="wstitle">완료한 워크스페이스</p>
        <div
          className="workspace-scroll"
          ref={completeRef}
          {...completeHandlers}
        >
          {renderCards(completews)}
        </div>
      </div>
    </div>
  );
}
