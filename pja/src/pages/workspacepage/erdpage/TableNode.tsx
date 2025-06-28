import { Handle, Position } from "reactflow";
import type { NodeProps, NodeTypes } from "reactflow";
import type { ERDField, ERDTable } from "../../../types/erd";
import "./ERDPage.css";
import "reactflow/dist/style.css";
import { useState } from "react";
import { useEditLock } from "../../../hooks/useEditLock";
import type { LockedUser } from "../../../types/edit";

const TableNode: React.FC<NodeProps<ERDTable>> = ({ data }) => (
  <div className="table-node">
    <div className="table-node-header">
      <p>{data.tableName}</p>
    </div>
    <div className="table-node-body">
      {data.fields.map((field) => (
        <div key={field.name} className="table-node-row">
          <Handle
            type="target"
            position={Position.Left}
            isConnectable={false}
            id={`${field.id}`}
            className="handle-left"
          />
          <div className="table-node-field">
            {field.primary && <span>🔑</span>}
            {field.foreign && <span>🔗</span>}
            <p
              className={`field-name ${field.primary ? "font-bold" : ""} ${field.foreign ? "text-foreign" : ""
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
            isConnectable={false}
            id={`${field.id}`}
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
        fieldId: string,
        key: keyof ERDField,
        value: string | boolean
      ) => void;
      onAddField: (tableId: string) => void;
      onDeleteField: (tableId: string, fieldId: string) => void;
      onTableNameChange: (tableId: string, newName: string) => void;
      onDeleteTable: (tableId: string) => void;
    }
  >
> = ({ data }) => {
  const { getUserEditingField, startEditing, stopEditing } = useEditLock("erd");

  const {
    onFieldChange,
    onAddField,
    onDeleteField,
    onTableNameChange,
    onDeleteTable,
    ...tableData
  } = data;
  console.log(
    "editing user:",
    getUserEditingField(tableData.tableName, tableData.id)
  );
  const [tempName, setTempName] = useState<string>("");
  const [editId, setEditId] = useState<string>("");

  const renderEditor = (user: LockedUser | null) => {
    //확인 용
    if (!user) return;

    return user.userProfile ? (
      <img
        key={user.userId}
        src={user.userProfile}
        alt={user.userName}
        title={user.userName}
        className="profile-image"
      />
    ) : (
      <div key={user.userId} className="profile" title={user.userName}>
        {user.userName.charAt(0)}
      </div>
    );
  };

  return (
    <div className="table-node editable-table-node">
      <div className="edittable-node-header">
        <div className="table-editors">
          {renderEditor(getUserEditingField(tableData.tableName, tableData.id))}
        </div>
        <input
          className="table-name-input"
          value={editId === "tablename" ? tempName : tableData.tableName}
          onClick={() => {
            setTempName(tableData.tableName);
            setEditId("tablename");
          }}
          onChange={(e) => setTempName(e.target.value)}
          onFocus={() => {
            startEditing(tableData.tableName, tableData.id);
          }}
          onBlur={() => {
            onTableNameChange(tableData.id, tempName);
            stopEditing(tableData.tableName, tableData.id);
            setEditId("");
            setTempName("");
          }} // 포커스 아웃 시 반영
          placeholder="테이블 이름"
        />
        <button
          className="delete-table-btn"
          onClick={() => data.onDeleteTable(tableData.id)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            fill="#FFFFFF"
          >
            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
          </svg>
        </button>
      </div>
      <div className="table-node-body">
        {tableData.fields.map((field) => (
          <div key={field.id} className="table-node-row editable-row">
            <Handle
              type="target"
              position={Position.Left}
              id={`${field.id}`}
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
                    field.id,
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
                    field.id,
                    "foreign",
                    e.target.checked
                  )
                }
                className="checkbox-foreign"
              />

              {/* 필드명 입력 */}
              <input
                className="field-name-input"
                value={
                  editId === `${field.id}-fieldname` ? tempName : field.name
                }
                onClick={() => {
                  setTempName(field.name);
                  setEditId(`${field.id}-fieldname`);
                }}
                onChange={(e) => setTempName(e.target.value)}
                onFocus={() => {
                  startEditing(tableData.tableName, tableData.id);
                }}
                onBlur={() => {
                  onFieldChange(tableData.id, field.id, "name", tempName);
                  stopEditing(tableData.tableName, tableData.id);
                  setEditId("");
                  setTempName("");
                }}
                placeholder="필드명"
              />

              {/* 타입 입력 */}
              <input
                className="field-type-input"
                value={
                  editId === `${field.id}-fieldtype`
                    ? tempName
                    : field.type ?? ""
                }
                onClick={() => {
                  setTempName(field.type ?? "");
                  setEditId(`${field.id}-fieldtype`);
                }}
                onChange={(e) => setTempName(e.target.value)}
                onFocus={() => {
                  startEditing(tableData.tableName, tableData.id);
                }}
                onBlur={() => {
                  onFieldChange(tableData.id, field.id, "type", tempName);
                  stopEditing(tableData.tableName, tableData.id);
                  setEditId("");
                  setTempName("");
                }}
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
                      field.id,
                      "nullable",
                      e.target.checked
                    )
                  }
                />
                NULL
              </label>

              {/* 필드 삭제 버튼 - 새로 추가 */}
              <button
                className="delete-field-btn"
                onClick={() => data.onDeleteField(data.id, field.id)}
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
            </div>

            <Handle
              type="source"
              position={Position.Right}
              id={`${field.id}`}
              className="handle-right"
            />
          </div>
        ))}

        {/* 새 필드 추가 버튼 */}
        <div className="add-field-row">
          <button
            className="add-field-btn"
            onClick={() => {
              onAddField(tableData.id);
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
