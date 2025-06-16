import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { WSHeader } from "../../../components/header/WSHeader";
import ReactFlow, {
  Background,
  Controls,
  useReactFlow,
} from "reactflow";
import type { Node } from "reactflow";
import "reactflow/dist/style.css";
import "./ERDPage.css";
import { useEffect, useState } from "react";
import { edges, generateNodesFromData, nodeTypes, tableData, type TableData } from "./ERDData";
import React from "react";

export default function ERDPage() {
  const dispatch = useDispatch();
  const selectedWS = useSelector(
    (state: RootState) => state.workspace.selectedWS
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [nodes, setNodes] = React.useState<Node<TableData>[]>();
  const [tableList, setTableList] = useState<{ id: string; data: TableData }[]>(tableData);

  const { fitView } = useReactFlow();

  useEffect(() => {
    setNodes(generateNodesFromData(tableList))
  }, [])

  useEffect(() => {
    const handleResize = () => {
      fitView({ padding: 0.2 });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [fitView]);

  const handleEditClick = () => {
    setIsEditMode(true);
    // 필요 시, 노드 편집 상태 변경 로직 추가
  };

  const handleCreateTableClick = () => {
    // // 새 테이블 생성 함수 예시
    // const newTable(id: string; data: TableData) = {
    //   id: `table_${Date.now()}`,
    //     data: {
    //     label: "새 테이블",
    //       fields: [],
    //   },
    // };
    // setTableList((prev) => [...prev, newTable]);
    // // setNodes();
  };

  return (
    <>
      <WSHeader title="ERD 생성" />
      <div className="erd-page-container">
        <div className="erd-page-header">
          <p className="erd-title">
            ✨아이디어와 명세서를 분석하여 ERD 추천을 해드려요
          </p>
          <div className="erd-btn-group">
            <div className="erd-btn" onClick={handleEditClick}>
              수정하기
            </div>
            <div className="erd-btn" onClick={handleCreateTableClick}>
              새 테이블 생성하기
            </div>
          </div>
        </div>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
          zoomOnScroll={false}
          zoomActivationKeyCode="Control" // Ctrl 키 누르고 휠 돌릴 때만 확대/축소
          className="erdflow-container"
        >
          <Background color="#e5e7eb" gap={16} />
          <Controls />
        </ReactFlow>
        <div className="erd-complete-btn-container">
          <div className="erd-complete-btn">
            저장하기
          </div>
        </div>

      </div>
    </>
  );
}
