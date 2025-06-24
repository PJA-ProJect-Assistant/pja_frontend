import "./GraphBox.css";
import { TaskImbalance } from "./TaskImbalance";
import { TaskProcessTime } from "./TaskProcessTime";

export function GraphBox() {
  return (
    <div className="graph-container">
      <TaskImbalance />
      <TaskProcessTime />
    </div>
  );
}
