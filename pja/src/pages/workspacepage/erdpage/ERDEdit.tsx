import { useEffect, useState } from "react";
import type { ERDField, ERDRelation, ERDTable } from "../../../types/erd";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { getAllErd, getErdId } from "../../../services/erdApi";
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
  const [erdId, setErdId] = useState<number>();

  const geterd = async () => {
    // erdId조회
    try {
      if (selectedWS?.workspaceId) {
        const getid = await getErdId(selectedWS.workspaceId);
        console.log("erdId 성공", getid.data);
        const ERDID = getid.data?.erdId;
        console.log(ERDID);

        if (ERDID) {
          setErdId(ERDID);
          try {
            const getallerd = await getAllErd(selectedWS?.workspaceId, ERDID);
            console.log("getallerd 결과", getallerd);

            if (getallerd.data) {
              setTables(getallerd.data.tables);
              setEdges(getallerd.data.relations);
            }
          } catch (err) {
            console.log("getallerd 실패", err);
          }
        }
      }
    } catch (err) {
      console.log("erdId 조회 실패");
    }
  };

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
  const handleFieldChange = (
    tableId: string,
    fieldId: number,
    key: keyof ERDField,
    value: string | boolean
  ) => {
    setTables((prevTables) => {
      return prevTables.map((table) => {
        if (table.id === tableId) {
          const updatedFields = [...table.fields];
          updatedFields[fieldId] = {
            ...updatedFields[fieldId],
            [key]: value,
          };
          return {
            ...table,
            fields: updatedFields,
          };
        }
        return table;
      });
    });
  };

  // 필드 추가 핸들러 (수정됨)
  const handleAddField = (tableId: string, newField: ERDField) => {
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
  };

  // 필드 삭제 핸들러 (새로 추가)
  const handleDeleteField = (tableId: string, fieldIndex: number) => {
    setTables((prevTables) => {
      return prevTables.map((table) => {
        if (table.id === tableId) {
          const updatedFields = table.fields.filter(
            (_, index) => index !== fieldIndex
          );
          return {
            ...table,
            fields: updatedFields,
          };
        }
        return table;
      });
    });
  };

  // 테이블명 변경 핸들러 (새로 추가)
  const handleTableNameChange = (tableId: string, newName: string) => {
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
  };

  // 새 테이블 추가 핸들러
  const handleAddTable = () => {
    const newTableId = `table_${Date.now()}`;
    const newTable: ERDTable = {
      id: newTableId,
      tableName: "새테이블",
      fields: [
        {
          name: "",
          type: "",
          primary: false,
          nullable: false,
          foreign: false,
        },
      ],
    };

    setTables((prev) => [...prev, newTable]);
  };

  // 관계선 연결 핸들러 (ID 생성 수정)
  const handleConnect = (connection: Connection) => {
    const newRelation: ERDRelation = {
      id: `edge_0`,
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
    setEdges((prev) =>
      prev.map((edge) =>
        edge.id === edgeId ? { ...edge, label: newLabel } : edge
      )
    );
  };

  // 관계선 삭제 핸들러
  const handleEdgesDelete = (edgesToDelete: Edge[]) => {
    const idsToDelete = edgesToDelete.map((edge) => edge.id);
    setEdges((prev) => prev.filter((edge) => !idsToDelete.includes(edge.id)));
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
              onFieldChange: handleFieldChange,
              onAddField: handleAddField, // 추가
              onDeleteField: handleDeleteField, // 추가
              onTableNameChange: handleTableNameChange, // 추가
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
          onEdgesDelete={handleEdgesDelete}
          nodeTypes={editableNodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
          className="erdflow-container"
          nodesDraggable={true}
          nodesConnectable={true}
          elementsSelectable={true}
          onConnect={handleConnect}
          deleteKeyCode={["Backspace", "Delete"]} // 삭제 키 설정
        />
      </div>
    </>
  );
}

//   //필드 내용 변경
//   const handleFieldChange = (
//     tableId: string,
//     fieldId: number,
//     key: keyof ERDField,
//     value: string | boolean
//   ) => {
//     setTables((prevTables) => {
//       return prevTables.map((table) => {
//         if (table.id === tableId) {
//           const updatedFields = [...table.fields];
//           updatedFields[fieldId] = {
//             ...updatedFields[fieldId],
//             [key]: value,
//           };
//           return {
//             ...table,
//             fields: updatedFields,
//           };
//         }
//         return table;
//       });
//     });
//   };

//   // 새 테이블 추가 핸들러
//   const handleAddTable = () => {
//     const newTableId = `table_${Date.now()}`;
//     const newTable: ERDTable = {
//       id: newTableId,
//       tableName: "새테이블",
//       fields: [
//         {
//           name: "",
//           type: "",
//           primary: false,
//           nullable: false,
//           foreign: false,
//         },
//       ],
//     };

//     setTables((prev) => [...prev, newTable]);
//   };

//   //edge 연결
//   const handleConnect = (connection: Connection) => {
//     const newRelation: ERDRelation = {
//       id: `edge_0`,
//       source: connection.source!,
//       target: connection.target!,
//       sourceHandle: connection.sourceHandle!,
//       targetHandle: connection.targetHandle!,
//       label: "1:1", // 기본값
//     };
//     setEdges((prev) => [...prev, newRelation]);
//   };

//   //라벨 변경
//   const handleEdgeLabelChange = (edgeId: string, newLabel: string) => {
//     setEdges((prev) =>
//       prev.map((edge) =>
//         edge.id === edgeId ? { ...edge, label: newLabel } : edge
//       )
//     );
//   };

//   //관계선 삭제
//   const handleEdgesDelete = (edgesToDelete: Edge[]) => {
//     const idsToDelete = edgesToDelete.map((edge) => edge.id);
//     setEdges((prev) => prev.filter((edge) => !idsToDelete.includes(edge.id)));
//   };

//   //필드 추가
//   const handleAddField = (tableId: string, newField: ERDField) => {
//     setTables((prevTables) =>
//       prevTables.map((table) =>
//         table.id === tableId
//           ? {
//               ...table,
//               fields: [...table.fields, newField],
//             }
//           : table
//       )
//     );
//   };
//   //필드 삭제
//   const handleDeleteField = (tableId: string, fieldIdx: number) => {
//     setTables((prevTables) =>
//       prevTables.map((table) =>
//         table.id === tableId
//           ? {
//               ...table,
//               fields: table.fields.filter((_, idx) => idx !== fieldIdx),
//             }
//           : table
//       )
//     );
//   };

//   // 저장 핸들러
//   const handleSave = async () => {
//     try {
//       // 여기에 저장 API 호출
//       console.log("저장할 데이터:", { tables, edges });
//       // await saveErd(selectedWS?.workspaceId, erdId, { tables, relations: edges });
//       onClose();
//     } catch (err) {
//       console.log("저장 실패:", err);
//     }
//   };

//   return (
//     <>
//       <div className="erd-page-header">
//         <p className="erd-title">✨ERD를 직접 편집해보세요</p>
//         <div className="erd-btn-group">
//           <div className="erd-btn" onClick={handleSave}>
//             완료하기
//           </div>
//           <div className="erd-btn" onClick={handleAddTable}>
//             새 테이블 생성하기
//           </div>
//         </div>
//       </div>
//       <div className="erd-edit-container">
//         <ReactFlow
//           nodes={nodes.map((node) => ({
//             ...node,
//             data: {
//               ...node.data,
//               onFieldChange: handleFieldChange,
//               onAddField: handleAddField,
//               onfieldDelete: handleDeleteField,
//             },
//           }))}
//           edges={flowEdges}
//           onEdgesDelete={handleEdgesDelete}
//           nodeTypes={editableNodeTypes}
//           fitView
//           fitViewOptions={{ padding: 0.2 }}
//           defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
//           className="erdflow-container"
//           nodesDraggable={true}
//           nodesConnectable={true}
//           elementsSelectable={true}
//           onConnect={handleConnect}
//           onEdgeClick={(event, edge) => {
//             event.preventDefault();
//             setSelectedEdge(edge);
//             setLabelMenuPos({ x: event.clientX, y: event.clientY });
//           }}
//         />
//         {labelMenuPos && selectedEdge && (
//           <div
//             style={{
//               position: "absolute",
//               top: labelMenuPos.y,
//               left: labelMenuPos.x,
//               background: "#fff",
//               border: "1px solid #ccc",
//               padding: "8px",
//               zIndex: 999,
//             }}
//           >
//             {["1:1", "1:N", "N:1", "N:N"].map((label) => (
//               <div
//                 key={label}
//                 style={{ padding: "4px", cursor: "pointer" }}
//                 onClick={() => {
//                   handleEdgeLabelChange(selectedEdge.id, label);
//                   setSelectedEdge(null);
//                   setLabelMenuPos(null);
//                 }}
//               >
//                 {label}
//               </div>
//             ))}
//             {/* 🔥 삭제 버튼 추가 */}
//             <div
//               style={{ padding: "4px", cursor: "pointer", color: "red" }}
//               onClick={() => {
//                 if (selectedEdge !== null) {
//                   handleEdgesDelete([selectedEdge]);
//                 }
//                 setSelectedEdge(null);
//                 setLabelMenuPos(null);
//               }}
//             >
//               ❌ 관계선 삭제
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }
