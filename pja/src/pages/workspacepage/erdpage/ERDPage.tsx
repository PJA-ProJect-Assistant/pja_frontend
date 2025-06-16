import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { WSHeader } from "../../../components/header/WSHeader";
import ReactFlow, {
  Background,
  Controls,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import "./ERDPage.css";
import { useEffect } from "react";
import { edges, generateNodes, nodeTypes } from "./ERDData";

export default function ERDPage() {
  const dispatch = useDispatch();
  const selectedWS = useSelector(
    (state: RootState) => state.workspace.selectedWS
  );
  const nodes = generateNodes();

  const { fitView } = useReactFlow();

  useEffect(() => {
    const handleResize = () => {
      fitView({ padding: 0.2 });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [fitView]);

  return (
    <>
      <WSHeader title="ERD 생성" />
      <div className="erd-page-container">
        <div className="erd-page-header">
          <h1 className="erd-title">
            ✨아이디어와 명세서를 분석하여 ERD 추천을 해드려요
          </h1>
          <p className="erd-subtitle">
            완료하기 버튼을 누르면 다음 단계로 넘어갈 수 있어요
          </p>
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
      </div>
    </>
  );
}
