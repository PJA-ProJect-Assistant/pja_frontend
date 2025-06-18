import { Handle, Position } from "reactflow";
import type { NodeProps } from "reactflow";
import type { ERDTable } from "../../../types/erd";
import "./ERDPage.css";

const TableNode: React.FC<NodeProps<ERDTable>> = ({ data }) => (
  <div className="table-node">
    <div className="table-node-header">{data.tableName}</div>
    <div className="table-node-body">
      {data.fields.map((field) => (
        <div key={field.name} className="table-node-row">
          <Handle
            type="target"
            position={Position.Left}
            id={`target-${data.tableName}-${field.name}`}
            className="handle-left"
          />
          <div className="table-node-field">
            {field.primary && <span className="icon-primary">🔑</span>}
            {field.foreign && <span className="icon-foreign">🔗</span>}
            <span
              className={`field-name ${field.primary ? "font-bold" : ""} ${
                field.foreign ? "text-foreign" : ""
              }`}
            >
              {field.name}
            </span>
          </div>
          <span className="field-type">{field.type}</span>
          <Handle
            type="source"
            position={Position.Right}
            id={`source-${data.tableName}-${field.name}`}
            className="handle-right"
          />
        </div>
      ))}
    </div>
  </div>
);
export const nodeTypes = {
  tableNode: TableNode,
};
