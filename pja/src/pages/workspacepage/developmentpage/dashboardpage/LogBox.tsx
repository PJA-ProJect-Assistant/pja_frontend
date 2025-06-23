import { useSelector } from "react-redux";
import "./LogBox.css";
import { useEffect, useState } from "react";
import type { RootState } from "../../../../store/store";
import { getWsActivity } from "../../../../services/listapi/DashboardApi";
import type { wsActivity } from "../../../../types/list";
export function LogBox() {
  const selectedWS = useSelector(
    (state: RootState) => state.workspace.selectedWS
  );
  const [log, setLog] = useState<wsActivity[]>([]);
  useEffect(() => {
    const getLog = async () => {
      const response = await getWsActivity(selectedWS?.workspaceId ?? 0);
      setLog(response.data ?? []);
    };
    getLog();
  }, []);
  return (
    <div className="log-container">
      <p>최근활동</p>
      <div className="log-lists">
        {log.map((log) => (
          <>
            <div className="log-list">
              {log.userProfile ? (
                <img
                  src={log.userProfile}
                  alt={log.username}
                  className="logprofile-img"
                />
              ) : (
                <div className="logprofile-none">{log.username.charAt(0)}</div>
              )}
              <p>{log.username}</p>
              <div className="log-date">{log.relativeDateLabel}</div>
            </div>
            <div className="log-list-info">
              <p>{log.targetType}</p>
              <p>{log.actionType}</p>
            </div>
          </>
        ))}
      </div>
    </div>
  );
}
