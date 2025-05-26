import "./Myworkspace.css";
import { Users } from "../../constants/userconstants";
import { dummyWorkspaces } from "../../constants/wsconstants";

export function Myworkspace() {
  const myWorkspaces = dummyWorkspaces.filter(
    (ws) => ws.owner_id === Users.user_id && ws.is_completed === false
  );
  const completews = dummyWorkspaces.filter(
    (ws) => ws.owner_id === Users.user_id && ws.is_completed === true
  );
  return (
    <div className="workspacecontainer">
      <p className="wstitle">내 워크스페이스</p>
      <div className="workspace-row">
        {myWorkspaces.map((ws) => (
          <div key={ws.workspace_id} className="workspace-card">
            <h3>{ws.project_name}</h3>
            <p>{ws.project_description}</p>
          </div>
        ))}
      </div>
      <p className="wstitle">완료한 워크스페이스</p>
      <div className="workspace-row">
        {completews.map((ws) => (
          <div key={ws.workspace_id} className="workspace-card">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#000000"
              className="ws-moreicon"
            >
              <path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z" />
            </svg>
            <h3>{ws.project_name}</h3>
            <p>{ws.project_description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
