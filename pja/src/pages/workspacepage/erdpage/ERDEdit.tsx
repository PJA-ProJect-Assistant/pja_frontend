import { useEffect, useState } from "react";
import type { ERDField, ERDRelation, ERDTable, setRelation } from "../../../types/erd";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { deleteErdColumn, deleteErdTable, getAllErd, postErdColumn, postErdTable, putErdColumn, putErdTable } from "../../../services/erdApi";
import type { IsClose } from "../../../types/common";
import { editableNodeTypes } from "./TableNode";
import {
  generateEdittableNodes,
  generateEdittableRelations,
} from "../../../utils/erdUtils";
import {
  ReactFlow,
  useReactFlow,
  type Connection,
  type Edge,
  type Node,
} from "reactflow";
import "./ERDPage.css";

export default function ERDEdit({ onClose }: IsClose) {
  const [tables, setTables] = useState<ERDTable[]>([]);
  const [edges, setEdges] = useState<ERDRelation[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [flowEdges, setFlowEdges] = useState<Edge[]>([]);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [labelMenuPos, setLabelMenuPos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const selectedWS = useSelector(
    (state: RootState) => state.workspace.selectedWS
  );
  const erdId = useSelector(
    (state: RootState) => state.erd.erdId
  );

  const geterd = async () => {
    // erdId조회
    if (selectedWS?.workspaceId && erdId) {
      try {
        const getallerd = await getAllErd(selectedWS?.workspaceId, erdId);
        console.log("getallerd 결과", getallerd);

        if (getallerd.data) {
          setTables(getallerd.data.tables);
          setEdges(getallerd.data.relations);
        }
      } catch (err) {
        console.log("getallerd 실패", err);
      }
    };
  }

  useEffect(() => {
    geterd();
  }, [selectedWS]);

  useEffect(() => {
    if (tables.length > 0) {
      const generatedNodes = generateEdittableNodes(tables);

      setNodes(generatedNodes);
    }
  }, [tables]);
  useEffect(() => {
    const generatedEdges = generateEdittableRelations(edges);

    setFlowEdges(generatedEdges);
  }, [edges]);

  const { fitView } = useReactFlow();

  useEffect(() => {
    const handleResize = () => {
      fitView({ padding: 0.2 });
    };

    return () => window.removeEventListener("resize", handleResize);
  }, [nodes, fitView]);

  // 필드 변경 핸들러
  const handleFieldChange = async (
    tableId: string,
    fieldId: string,
    key: keyof ERDField,
    value: string | boolean
  ) => {
    if (selectedWS?.workspaceId && erdId) {
      try {
        console.log("필드 수정 시작");

        // 현재 테이블과 필드 찾기
        const table = tables.find((t) => t.id === tableId);
        const field = table?.fields.find((f) => f.id === fieldId);
        if (!field) {
          console.log("필드가 존재하지 않음");

          return;
        }
        // 수정된 필드의 전체 body 생성
        const updatedField = {
          id: fieldId,
          name: key === "name" ? (value as string) : field.name,
          type: key === "type" ? (value as string) : field.type,
          primary: key === "primary" ? (value as boolean) : field.primary,
          foreign: key === "foreign" ? (value as boolean) : field.foreign,
          nullable: key === "nullable" ? (value as boolean) : field.nullable,
        };
        //수정api 호출
        await putErdColumn(selectedWS.workspaceId, erdId, tableId, fieldId, updatedField)

        setTables((prevTables) => {
          return prevTables.map((table) => {
            if (table.id === tableId) {
              const updatedFields = [...table.fields];
              const fieldIndex = updatedFields.findIndex((f) => f.id === fieldId);
              if (fieldIndex !== -1) {
                updatedFields[fieldIndex] = {
                  ...updatedFields[fieldIndex],
                  [key]: value,
                };
              }
              return {
                ...table,
                fields: updatedFields,
              };
            }
            return table;
          });
        });
      } catch {
        console.log("필드 수정 실패");
      }
    }
  };

  // 필드 추가 핸들러
  const handleAddField = async (tableId: string) => {
    if (selectedWS?.workspaceId && erdId) {
      try {
        const response = await postErdColumn(selectedWS?.workspaceId, erdId, tableId)
        const newField: ERDField = {
          id: response.data?.columnId ?? "0",
          name: "new_field",
          type: "",
          nullable: false,
          primary: false,
          foreign: false,
        };
        setTables((prevTables) => {
          return prevTables.map((table) => {
            if (table.id === tableId) {
              return {
                ...table,
                fields: [...table.fields, newField],
              };
            }
            return table;
          });
        });
      } catch {
        console.log("필드 추가 실패");
      }
    }
  };

  // 필드 삭제 핸들러
  const handleDeleteField = async (tableId: string, fieldId: string) => {
    if (selectedWS?.workspaceId && erdId) {
      try {
        await deleteErdColumn(selectedWS.workspaceId, erdId, tableId, fieldId)
        setTables((prevTables) => {
          return prevTables.map((table) => {
            if (table.id === tableId) {
              const updatedFields = table.fields.filter(
                (field) => field.id !== fieldId
              );
              return {
                ...table,
                fields: updatedFields,
              };
            }
            return table;
          });
        });
      } catch {
        console.log("필드 삭제 실패");
      }
    }
  };

  // 테이블명 변경 핸들러
  const handleTableNameChange = async (tableId: string, newName: string) => {
    if (selectedWS?.workspaceId && erdId) {
      try {
        await putErdTable(selectedWS?.workspaceId, erdId, tableId, newName);
        setTables((prevTables) => {
          return prevTables.map((table) => {
            if (table.id === tableId) {
              return {
                ...table,
                tableName: newName,
              };
            }
            return table;
          });
        });
      } catch {
        console.log("테이블명 수정 실패");
      }
    };
  }

  // 새 테이블 추가 핸들러
  const handleAddTable = async () => {
    if (selectedWS?.workspaceId && erdId) {
      try {
        const response = await postErdTable(selectedWS?.workspaceId, erdId);
        const newTableId = response.data?.tableId ?? "0";
        const newTable: ERDTable = {
          id: newTableId,
          tableName: "새테이블",
          fields: [],
        };

        setTables((prev) => [...prev, newTable]);
      } catch {
        console.log("새 테이블 생성 실패");
      }
    }
  };

  // 테이블 삭제 핸들러
  const handleDeleteTable = async (tableId: string) => {
    if (selectedWS?.workspaceId && erdId) {
      try {
        //테이블 삭제 api
        await deleteErdTable(selectedWS?.workspaceId, erdId, tableId);
        setTables((prevTables) => {
          return prevTables.filter((table) => {
            table.id != tableId
            return table;
          });
        });
      } catch {
        console.log("테이블 삭제 실패");
      }
    }
  };

  // 관계선 연결 핸들러 (ID 생성 수정)
  const handleConnect = (connection: Connection) => {
    const newRelation: ERDRelation = {
      id: "0",
      source: connection.source!,
      target: connection.target!,
      sourceHandle: connection.sourceHandle!,
      targetHandle: connection.targetHandle!,
      label: "1:1", // 기본값
    };
    setEdges((prev) => [...prev, newRelation]);
  };

  // 관계선 라벨 변경 핸들러
  const handleEdgeLabelChange = (edgeId: string, newLabel: string) => {
    console.log("라벨 수정 핸들러 실행");
    setEdges((prev) =>
      prev.map((edge) =>
        edge.id === edgeId ? { ...edge, label: newLabel } : edge
      )
    );
  };

  // 관계선 삭제 핸들러
  const handleEdgeDelete = (edgeId: string) => {
    setEdges((prev) => prev.filter((edge) => edge.id !== edgeId));
  };


  return (
    <>
      <div className="erd-page-header">
        <p className="erd-title">✨ERD를 직접 편집해보세요</p>
        <div className="erd-btn-group">
          <div className="erd-btn" onClick={() => onClose()}>
            완료하기
          </div>
          <div className="erd-btn" onClick={handleAddTable}>
            새 테이블 생성하기
          </div>
        </div>
      </div>

      <div
        className="erd-edit-container"
        style={{ height: "calc(100vh - 200px)" }}
      >
        <ReactFlow
          nodes={nodes.map((node) => ({
            ...node,
            data: {
              ...node.data,
              onFieldChange: handleFieldChange, //필드 수정
              onAddField: handleAddField, // 필드 추가
              onDeleteField: handleDeleteField, // 필드 삭제
              onTableNameChange: handleTableNameChange, // 테이블 수정
              onDeleteTable: handleDeleteTable, //테이블 삭제
            },
          }))}
          edges={flowEdges.map((edge) => ({
            ...edge,
            // 라벨 편집을 위한 커스텀 엣지 컴포넌트 사용 가능
            data: {
              ...edge.data,
              onLabelChange: handleEdgeLabelChange,
            },
          }))}
          nodeTypes={editableNodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
          className="erdflow-container"
          nodesDraggable={true}
          nodesConnectable={true}
          elementsSelectable={true}
          onConnect={handleConnect}
          onEdgeClick={(event, edge) => {
            event.preventDefault();
            setSelectedEdge(edge);
            setLabelMenuPos({ x: event.clientX, y: event.clientY });
          }}
        />
        {
          labelMenuPos && selectedEdge && (
            <div
              style={{
                position: "absolute",
                top: labelMenuPos.y,
                left: labelMenuPos.x,
                background: "#fff",
                border: "1px solid #ccc",
                padding: "8px",
                zIndex: 999,
              }}
            >
              {["1:1", "1:N", "N:1", "N:N"].map((label) => (
                <div
                  key={label}
                  style={{ padding: "4px", cursor: "pointer" }}
                  onClick={() => {
                    handleEdgeLabelChange(selectedEdge.id, label);
                    setSelectedEdge(null);
                    setLabelMenuPos(null);
                  }}
                >
                  {label}
                </div>
              ))}
              {/* 🔥 삭제 버튼 추가 */}
              <div
                style={{ padding: "4px", cursor: "pointer", color: "red" }}
                onClick={() => {
                  if (selectedEdge) {
                    handleEdgeDelete(selectedEdge.id);
                  }
                  setSelectedEdge(null);
                  setLabelMenuPos(null);
                }}
              >
                ❌ 관계선 삭제
              </div>
            </div>
          )
        }
      </div >
    </>
  );
}