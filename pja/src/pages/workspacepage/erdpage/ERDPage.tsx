import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { WSHeader } from "../../../components/header/WSHeader";
import { ReactFlow, useReactFlow, type Edge } from "reactflow";
import type { Node } from "reactflow";
import { generateEdgesFromData, generateNodesFromData } from "./ERDData";
import { nodeTypes } from "./TableNode";
import { progressworkspace } from "../../../services/workspaceApi";
import { useNavigate } from "react-router-dom";
import { setSelectedWS } from "../../../store/workspaceSlice";
import { getStepIdFromNumber } from "../../../utils/projectSteps";
import { useEffect, useState } from "react";
// import ERDEdit from "./ERDEdit";
import "./ERDPage.css";
import { getAllErd, getErdId, generateApiSpec } from "../../../services/erdApi";

export default function ERDPage() {
  const dispatch = useDispatch();
  const selectedWS = useSelector(
    (state: RootState) => state.workspace.selectedWS
  );

  const [erdId, setErdId] = useState<number>();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  // const nodes = generateNodesFromData(tableData);
  const [erdDone, setErdDone] = useState<boolean>(false);
  const [modifyMode, setModifyMode] = useState<boolean>(false);
  const navigate = useNavigate();

  const geterd = async () => {
    // 여기에 erdId조회api
    try {
      if (selectedWS?.workspaceId) {
        const getid = await getErdId(selectedWS.workspaceId);
        console.log("erdId 성공", getid.data);
        const ERDID = getid.data;
        if (ERDID) {
          setErdId(ERDID);
          try {
            const getallerd = await getAllErd(selectedWS?.workspaceId, ERDID);
            console.log("getallerd 결과", getallerd);

            const relations = getallerd.data?.relations;
            const tables = getallerd.data?.tables;

            if (relations && tables) {
              const generatedNodes = generateNodesFromData(tables);
              const generatedEdges = generateEdgesFromData(relations);

              setNodes(generatedNodes);
              setEdges(generatedEdges);
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
    if (Number(selectedWS?.progressStep) > 3) {
      setErdDone(true);
    }
  }, [selectedWS]);
  const { fitView } = useReactFlow();
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const onInit = (instance: any) => {
    setReactFlowInstance(instance);
  };
  useEffect(() => {
    const handleResize = () => {
      fitView({ padding: 0.2 });
    };

    if (reactFlowInstance) {
      window.addEventListener("resize", handleResize);
    }

    return () => window.removeEventListener("resize", handleResize);
  }, [nodes, fitView]);
  //완료 버튼
  const handleErdComplete = async () => {
    if (selectedWS?.progressStep === "3") {
      try {
        console.log("AI API 명세서 생성을 요청합니다...");
        await generateApiSpec(selectedWS.workspaceId);

        await progressworkspace(selectedWS.workspaceId, "4");
        console.log("API페이지로 이동");
        dispatch(
          setSelectedWS({
            ...selectedWS,
            progressStep: "4",
          })
        );
        setErdDone(true);
        navigate(
          `/ws/${selectedWS?.workspaceId}/step/${getStepIdFromNumber("4")}`
        );
      } catch (err) {
        console.log("api명세서 ai생성 실패", err);
      }
    }
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
            <div
              className="erd-btn"
              onClick={() => setModifyMode((prev) => !prev)}
            >
              {modifyMode ? "완료하기" : "수정하기"}
            </div>
            {modifyMode && <div className="erd-btn">새 테이블 생성하기</div>}
          </div>
        </div>
        {/* <ReactFlow nodes={nodes} edges={initialEdges} nodeTypes={nodeTypes} /> */}
        {modifyMode ? (
          // <ERDEdit />
          <div>수정페이지</div>
        ) : (
          <ReactFlow
            onInit={onInit}
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
            zoomOnScroll={false}
            zoomActivationKeyCode="Control" // Ctrl 키 누르고 휠 돌릴 때만 확대/축소
            className="erdflow-container"
          ></ReactFlow>
        )}

        {!erdDone && !modifyMode && (
          <div className="erd-complete-btn-container">
            <div className="erd-complete-btn" onClick={handleErdComplete}>
              저장하기
            </div>
          </div>
        )}
      </div>
    </>
  );
}
