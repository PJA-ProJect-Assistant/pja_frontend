import { useEffect, useState } from "react";
import type {
  ERDField,
  ERDRelation,
  ERDTable,
  RelationType,
} from "../../../types/erd";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import {
  deleteErdColumn,
  deleteErdRelation,
  deleteErdTable,
  getAllErd,
  patchRelationLabel,
  postErdColumn,
  postErdRelation,
  postErdTable,
  putErdColumn,
  putErdTable,
} from "../../../services/erdApi";
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
import { useEditLock } from "../../../hooks/useEditLock";

import { BasicModal } from "../../../components/modal/BasicModal";

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
  const [isFailed, setIsFailed] = useState<boolean>(false);

  const { startPolling, stopPolling, setAlreadyEdit, alreadyEdit } =
    useEditLock("erd");

  const labelMap: Record<string, string> = {
    "1:1": "ONE_TO_ONE",
    "1:N": "ONE_TO_MANY",
    "N:1": "MANY_TO_ONE",
    "N:N": "MANY_TO_MANY",
  };

  const selectedWS = useSelector(
    (state: RootState) => state.workspace.selectedWS
  );
  const erdId = useSelector((state: RootState) => state.erd.erdId);

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
        setIsFailed(true);
      }
    }
  };

  useEffect(() => {
    startPolling();
    geterd();
  }, [selectedWS]);

  useEffect(() => {
    const generatedNodes = generateEdittableNodes(tables);

    setNodes(generatedNodes);
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
  }, []);

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
        console.log("업데이트할 필드:", updatedField);
        //수정api 호출
        await putErdColumn(
          selectedWS.workspaceId,
          erdId,
          tableId,
          fieldId,
          updatedField
        );

        setTables((prevTables) => {
          const newTables = prevTables.map((table) => {
            if (table.id === tableId) {
              const newFields = table.fields.map((field) => {
                if (field.id === fieldId) {
                  return {
                    ...field,
                    [key]: value,
                  };
                }
                return field;
              });

              return {
                ...table,
                fields: newFields,
              };
            }
            return table;
          });
          return newTables;
        });
      } catch {
        setIsFailed(true);
      }
    }
  };

  // 필드 추가 핸들러
  const handleAddField = async (tableId: string) => {
    if (selectedWS?.workspaceId && erdId) {
      try {
        const response = await postErdColumn(
          selectedWS?.workspaceId,
          erdId,
          tableId
        );
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
        setIsFailed(true);
      }
    }
  };

  // 필드 삭제 핸들러
  const handleDeleteField = async (tableId: string, fieldId: string) => {
    if (selectedWS?.workspaceId && erdId) {
      try {
        await deleteErdColumn(selectedWS.workspaceId, erdId, tableId, fieldId);
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
        setIsFailed(true);
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
        setIsFailed(true);
      }
    }
  };

  // 새 테이블 추가 핸들러
  const handleAddTable = async () => {
    if (selectedWS?.workspaceId && erdId) {
      try {
        const response = await postErdTable(selectedWS?.workspaceId, erdId);
        const newTableId = response.data?.tableId ?? "0";
        console.log("새 테이블 아이디 : ", newTableId);

        const newTable: ERDTable = {
          id: newTableId,
          tableName: "새테이블",
          fields: [],
        };

        setTables((prev) => [...prev, newTable]);
      } catch {
        setIsFailed(true);
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
            table.id != tableId;
            return table;
          });
        });
        geterd();
      } catch {
        setIsFailed(true);
      }
    }
  };

  // 관계선 연결 핸들러 (ID 생성 수정)
  const handleConnect = async (connection: Connection) => {
    if (selectedWS?.workspaceId && erdId) {
      try {
        const newRelation: ERDRelation = {
          id: "0",
          source: connection.source!,
          target: connection.target!,
          sourceHandle: connection.sourceHandle!,
          targetHandle: connection.targetHandle!,
          label: "ONE_TO_ONE", // 기본값
        };
        const response = await postErdRelation(
          selectedWS.workspaceId,
          erdId,
          newRelation
        );
        if (response.data) {
          const Relation: ERDRelation = {
            id: response.data.relationId,
            source: connection.source!,
            target: connection.target!,
            sourceHandle: connection.sourceHandle!,
            targetHandle: connection.targetHandle!,
            label: "1:1", // 기본값
          };
          setEdges((prev) => [...prev, Relation]);
        }
      } catch {
        setIsFailed(true);
      }
    }
  };

  // 관계선 라벨 변경 핸들러
  const handleEdgeLabelChange = async (edgeId: string, newLabel: string) => {
    if (selectedWS?.workspaceId && erdId) {
      try {
        console.log("라벨 수정 핸들러 실행");
        const labeltype = labelMap[newLabel] as RelationType;
        await patchRelationLabel(
          selectedWS.workspaceId,
          erdId,
          edgeId,
          labeltype
        );
        setEdges((prev) =>
          prev.map((edge) =>
            edge.id === edgeId ? { ...edge, label: newLabel } : edge
          )
        );
        // geterd();
      } catch {
        setIsFailed(true);
      }
    }
  };

  // 관계선 삭제 핸들러
  const handleEdgeDelete = async (edgeId: string) => {
    if (selectedWS?.workspaceId && erdId) {
      try {
        console.log("관계 삭제 핸들러 실행", edgeId);
        await deleteErdRelation(selectedWS.workspaceId, erdId, edgeId);
        setEdges((prev) => prev.filter((edge) => edge.id !== edgeId));
      } catch {
        setIsFailed(true);
      }
    }
  };

  return (
    <>
      <div className="erd-page-header">
        <p className="erd-title">✨ERD를 직접 편집해보세요</p>
        <div className="erd-btn-group">
          <div
            className="erd-btn"
            onClick={() => {
              stopPolling();
              onClose();
            }}
          >
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
          minZoom={0.1}
          maxZoom={2}
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
        {labelMenuPos && selectedEdge && (
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
        )}
        {isFailed && (
          <BasicModal
            modalTitle="요청을 처리할 수 없습니다"
            modalDescription="요청 중 오류가 발생했습니다 새로고침 후 다시 시도해주세요"
            Close={() => setIsFailed(false)}
          />
        )}
        {alreadyEdit && (
          <BasicModal
            modalTitle="수정이 불가능합니다"
            modalDescription="다른 사용자가 수정 중입니다"
            Close={() => setAlreadyEdit(false)}
          />
        )}
      </div>
    </>
  );
}
