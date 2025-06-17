import { Handle, Position } from "reactflow";
import type { NodeProps } from "reactflow";
import type { TableData } from "../../../types/erd";
import "./ERDPage.css";

export const TableNode: React.FC<NodeProps<TableData>> = ({ data }) => (
  <div className="table-node">
    <div className="table-node-header">{data.tableName}</div>
    <div className="table-node-body">
      {data.fields.map((field, idx) => (
        <div key={idx} className="table-node-row">
          <Handle
            type="target"
            position={Position.Left}
            id={`target-${field.name}`}
            className="handle-left"
          />
          <div className="table-node-field">
            {field.isPrimary && <span className="icon-primary">🔑</span>}
            {field.isForeign && <span className="icon-foreign">🔗</span>}
            <span
              className={`field-name ${field.isPrimary ? "font-bold" : ""} ${
                field.isForeign ? "text-foreign" : ""
              }`}
            >
              {field.name}
            </span>
          </div>
          <span className="field-type">{field.type}</span>
          <Handle
            type="source"
            position={Position.Right}
            id={`source-${field.name}`}
            className="handle-right"
          />
        </div>
      ))}
    </div>
  </div>
);
