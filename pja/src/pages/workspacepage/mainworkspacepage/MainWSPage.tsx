import { useParams } from "react-router-dom";
import type { workspace } from "../../../types/workspace";
import { dummyWorkspaces } from "../../../constants/wsconstants";

export default function MainWSPage() {
  const { wsid } = useParams<{
    wsid: string;
  }>();

  const selectws: workspace | undefined = dummyWorkspaces.find(
    (ws) => ws.workspace_id === Number(wsid)
  );
  return (
    <>
      <div>워크스페이스페이지</div>
      <div>{selectws?.project_name}</div>
    </>
  );
}
