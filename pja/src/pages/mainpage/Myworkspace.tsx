import "./Myworkspace.css";
import { useRef, useState, useEffect } from "react";
import { Users } from "../../constants/userconstants";
import { dummyWorkspaces } from "../../constants/wsconstants";
import type { workspace } from "../../types/workspace";
import { useNavigate } from "react-router-dom";

export function Myworkspace() {
  const navigate = useNavigate();

  const [workspaces, setWorkspaces] = useState<workspace[]>(dummyWorkspaces);
  const [myWorkspaces, setMyWorkspaces] = useState<workspace[]>([]);
  const [completeWorkspaces, setCompleteWorkspaces] = useState<workspace[]>([]);

  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editTeam, setEditTeam] = useState<string>("");
  const [wsMenuOpenId, setWsMenuOpenId] = useState<number | null>(null);

  const editNameRef = useRef<HTMLDivElement | null>(null);
  const editTeamRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const myWorkspaces = workspaces.filter(
      (ws) => ws.owner_id === Users.user_id && ws.is_completed === false
    );
    setMyWorkspaces(myWorkspaces);
    const completews = workspaces.filter(
      (ws) => ws.owner_id === Users.user_id && ws.is_completed === true
    );
    setCompleteWorkspaces(completews);
  }, [workspaces]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        editId !== null && // 수정 모드일 때만
        editNameRef.current &&
        editTeamRef.current &&
        !editNameRef.current.contains(event.target as Node) &&
        !editTeamRef.current.contains(event.target as Node)
      ) {
        handleSave(editId);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editId, editName, editTeam]);

  // 각각의 스크롤 영역에 대해 따로 참조 만들기
  const activeRef = useRef<HTMLDivElement>(null);
  const completeRef = useRef<HTMLDivElement>(null);

  const toggleMenu = (workspaceId: number) => {
    setWsMenuOpenId((prevId) => (prevId === workspaceId ? null : workspaceId));
  };
  const handleEdit = (ws: workspace) => {
    setEditId(ws.workspace_id);
    setEditName(ws.project_name);
    setEditTeam(ws.team_name);
    setWsMenuOpenId(null);
  };

  const handleSave = (id: number) => {
    setWorkspaces((prev) =>
      prev.map((ws) =>
        ws.workspace_id === id
          ? { ...ws, project_name: editName, team_name: editTeam }
          : ws
      )
    );
    setEditId(null);
  };

  const handleComplete = (id: number, completed: boolean) => {
    setWorkspaces((prev) =>
      prev.map((ws) =>
        ws.workspace_id === id ? { ...ws, is_completed: completed } : ws
      )
    );
    setWsMenuOpenId(null);
  };
  const handleDelete = (id: number) => {
    setWorkspaces((prev) => prev.filter((ws) => ws.workspace_id !== id));
    setWsMenuOpenId(null);
  };

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

  const renderCards = (data: workspace[]) =>
    data.map((ws) => (
      <div
        key={ws.workspace_id}
        className="workspace-card"
        onDoubleClick={() => {
          if (!editId) navigate(`/ws/${ws.workspace_id}`);
        }}
      >
        <div>
          <div
            className="workspace-more"
            onClick={() => toggleMenu(ws.workspace_id)}
          >
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
          {wsMenuOpenId === ws.workspace_id && !ws.is_completed && (
            <div className="workspace-menu">
              <div onClick={() => handleEdit(ws)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#000000"
                >
                  <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                </svg>
                <p>워크스페이스 수정</p>
              </div>
              <div onClick={() => handleComplete(ws.workspace_id, true)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#5EC93D"
                >
                  <path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                </svg>
                <p>워크스페이스 완료</p>
              </div>
              <div onClick={() => handleDelete(ws.workspace_id)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#EA3323"
                >
                  <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                </svg>
                <p>워크스페이스 삭제</p>
              </div>
            </div>
          )}
          {wsMenuOpenId === ws.workspace_id && ws.is_completed && (
            <div className="workspace-menu">
              <div onClick={() => handleComplete(ws.workspace_id, false)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#EA3323"
                >
                  <path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                </svg>
                <p>완료 취소</p>
              </div>
              <div onClick={() => handleDelete(ws.workspace_id)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#EA3323"
                >
                  <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                </svg>
                <p>워크스페이스 삭제</p>
              </div>
            </div>
          )}
          <div
            className="ws-title-container"
            ref={editId === ws.workspace_id ? editNameRef : null}
          >
            {editId === ws.workspace_id ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="workspace-title-input"
              />
            ) : (
              <p className="workspace-title" title={ws.project_name}>
                {/* 마우스 가져다대면 title뜨는거 기본인데 나중에 시간 남으면 커스텀 해보기로! */}
                {ws.project_name}
              </p>
            )}
          </div>
        </div>
        <div ref={editId === ws.workspace_id ? editTeamRef : null}>
          {editId === ws.workspace_id ? (
            <input
              type="text"
              value={editTeam}
              onChange={(e) => setEditTeam(e.target.value)}
              className="workspace-team-input"
            />
          ) : (
            <p className="workspace-team">{ws.team_name}</p>
          )}
        </div>
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
          {renderCards(completeWorkspaces)}
        </div>
      </div>
    </div>
  );
}
