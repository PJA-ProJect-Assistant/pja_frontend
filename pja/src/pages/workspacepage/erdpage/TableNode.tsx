import { Handle, Position } from "reactflow";
import type { NodeProps, NodeTypes } from "reactflow";
import type { ERDField, ERDTable } from "../../../types/erd";
import "./ERDPage.css";
import "reactflow/dist/style.css";

const TableNode: React.FC<NodeProps<ERDTable>> = ({ data }) => (
  <div className="table-node">
    <div className="table-node-header">{data.tableName}</div>
    <div className="table-node-body">
      {data.fields.map((field) => (
        <div key={field.name} className="table-node-row">
          <Handle
            type="target"
            position={Position.Left}
            id={`target-${field.name}`}
            className="handle-left"
          />
          <div className="table-node-field">
            {field.primary && <span>🔑</span>}
            {field.foreign && <span>🔗</span>}
            <p
              className={`field-name ${field.primary ? "font-bold" : ""} ${
                field.foreign ? "text-foreign" : ""
              }`}
            >
              {field.name}
            </p>
          </div>
          <span className="field-type">{field.type}</span>
          <span className="nullable-type">
            {field.nullable ? "NULL" : "NOT NULL"}
          </span>
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
export const nodeTypes = {
  tableNode: TableNode,
};

const EditableTableNode: React.FC<
  NodeProps<
    ERDTable & {
      onFieldChange: (
        tableId: string,
        fieldIdx: number,
        key: keyof ERDField,
        value: string | boolean
      ) => void;
      onAddField: (tableId: string, newField: ERDField) => void;
      onDeleteField: (tableId: string, fieldIndex: number) => void; // 추가
      onTableNameChange: (tableId: string, newName: string) => void; // 추가
    }
  >
> = ({ data }) => {
  const {
    onFieldChange,
    onAddField,
    onDeleteField,
    onTableNameChange,
    ...tableData
  } = data;

  return (
    <div className="table-node editable-table-node">
      <div className="table-node-header">
        <input
          className="table-name-input"
          value={tableData.tableName}
          onChange={(e) => {
            onTableNameChange(tableData.id, e.target.value); // 수정됨
          }}
          placeholder="테이블 이름"
        />
      </div>
      <div className="table-node-body">
        {tableData.fields.map((field, fieldIdx) => (
          <div key={fieldIdx} className="table-node-row editable-row">
            <Handle
              type="target"
              position={Position.Left}
              id={`target-${field.name}`}
              className="handle-left"
            />

            <div className="editable-field-container">
              {/* Primary Key 체크박스 */}
              <span className="icon-primary">PK</span>
              <input
                type="checkbox"
                checked={field.primary || false}
                onChange={(e) =>
                  onFieldChange(
                    tableData.id,
                    fieldIdx,
                    "primary",
                    e.target.checked
                  )
                }
                className="checkbox-primary"
              />

              {/* Foreign Key 체크박스 */}
              <span className="icon-foreign">FK</span>
              <input
                type="checkbox"
                checked={field.foreign || false}
                onChange={(e) =>
                  onFieldChange(
                    tableData.id,
                    fieldIdx,
                    "foreign",
                    e.target.checked
                  )
                }
                className="checkbox-foreign"
              />

              {/* 필드명 입력 */}
              <input
                className="field-name-input"
                value={field.name}
                onChange={(e) =>
                  onFieldChange(tableData.id, fieldIdx, "name", e.target.value)
                }
                placeholder="필드명"
              />

              {/* 타입 입력 */}
              <input
                className="field-type-input"
                value={field.type || ""}
                onChange={(e) =>
                  onFieldChange(tableData.id, fieldIdx, "type", e.target.value)
                }
                placeholder="타입"
              />

              {/* NULL 허용 체크박스 */}
              <label className="nullable-label">
                <input
                  type="checkbox"
                  checked={field.nullable || false}
                  onChange={(e) =>
                    onFieldChange(
                      tableData.id,
                      fieldIdx,
                      "nullable",
                      e.target.checked
                    )
                  }
                />
                NULL
              </label>

              {/* 필드 삭제 버튼 - 새로 추가 */}
              {tableData.fields.length > 1 && ( // 최소 1개 필드는 유지
                <button
                  className="delete-field-btn"
                  onClick={() => data.onDeleteField(data.id, fieldIdx)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#000000"
                  >
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                  </svg>
                </button>
              )}
            </div>

            <Handle
              type="source"
              position={Position.Right}
              id={`source-${field.name}`}
              className="handle-right"
            />
          </div>
        ))}

        {/* 새 필드 추가 버튼 */}
        <div className="add-field-row">
          <button
            className="add-field-btn"
            onClick={() => {
              const newField: ERDField = {
                name: "new_field",
                type: "",
                nullable: false,
                primary: false,
                foreign: false,
              };
              onAddField(tableData.id, newField); // 수정됨
            }}
          >
            + 필드 추가
          </button>
        </div>
      </div>
    </div>
  );
};

// 노드 타입 정의
export const editableNodeTypes: NodeTypes = {
  editableTableNode: EditableTableNode,
};
