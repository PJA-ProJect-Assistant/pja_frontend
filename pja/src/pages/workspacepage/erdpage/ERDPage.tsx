import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { WSHeader } from "../../../components/header/WSHeader";
import { Controls, ReactFlow, useReactFlow, type Edge } from "reactflow";
import type { Node } from "reactflow";
import {
  generateEdgesFromData,
  generateNodesFromData,
} from "../../../utils/erdUtils";
import { nodeTypes } from "./TableNode";
import { useNavigate } from "react-router-dom";
import { setSelectedWS } from "../../../store/workspaceSlice";
import { getStepIdFromNumber } from "../../../utils/projectSteps";
import { useEffect, useState } from "react";
import "./ERDPage.css";
import "reactflow/dist/style.css";
import { getAllErd, getErdId, generateApiSpec } from "../../../services/erdApi";
import ERDEdit from "./ERDEdit";
import { setErdID } from "../../../store/erdSlice";
import Loading from "../../loadingpage/Loading";
import { BasicModal } from "../../../components/modal/BasicModal";

export default function ERDPage() {
  const dispatch = useDispatch();
  const selectedWS = useSelector(
    (state: RootState) => state.workspace.selectedWS
  );
  const Role = useSelector((state: RootState) => state.user.userRole);
  const CanEdit: boolean = Role === "OWNER" || Role === "MEMBER";

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  // const nodes = generateNodesFromData(tableData);
  const [erdDone, setErdDone] = useState<boolean>(true);
  const [modifyMode, setModifyMode] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isFailed, setIsFailed] = useState<boolean>(false);
  const navigate = useNavigate();

  const geterd = async () => {
    // erdId조회api
    try {
      if (selectedWS?.workspaceId) {
        const getid = await getErdId(selectedWS.workspaceId);
        const ERDID = getid.data?.erdId;

        if (ERDID) {
          //redux에 저장
          dispatch(setErdID(ERDID));
          try {
            const getallerd = await getAllErd(selectedWS?.workspaceId, ERDID);

            const relations = getallerd.data?.relations;
            const tables = getallerd.data?.tables;

            if (relations && tables) {
              const generatedNodes = generateNodesFromData(tables);
              const generatedEdges = generateEdgesFromData(relations);

              setNodes(generatedNodes);
              setEdges(generatedEdges);
            }
          } catch (err) {
            setIsFailed(true);
          }
        }
      }
    } catch (err) {
      setIsFailed(true);
    }
  };

  useEffect(() => {
    geterd();
    if (Number(selectedWS?.progressStep) === 3) {
      setErdDone(false);
    }
  }, [selectedWS, modifyMode === false]);

  const { fitView } = useReactFlow();

  useEffect(() => {
    const handleResize = () => {
      fitView({ padding: 0.2 });
    };

    return () => window.removeEventListener("resize", handleResize);
  }, [nodes, fitView]);

  useEffect(() => {
    nodes.forEach((node, index) => {
      console.log(`Node ${index}:`, {
        id: node.id,
        position: node.position,
        tableName: node.data?.tableName,
      });
    });
  }, [nodes]);
  //완료 버튼
  const handleErdComplete = async () => {
    //API 호출이 이미 진행 중이면 함수를 즉시 종료
    if (isGenerating) {
      return;
    }
    if (selectedWS?.progressStep === "3") {
      setIsGenerating(true);
      try {
        //여기에 API명세서 호출 api
        await generateApiSpec(selectedWS.workspaceId);
        dispatch(
          setSelectedWS({
            ...selectedWS,
            progressStep: "4",
          })
        );
        setIsGenerating(false);
        navigate(`/ws/${selectedWS?.workspaceId}/${getStepIdFromNumber("4")}`);
      } catch (err) {
        console.log("api명세서 ai생성 실패", err);
        setIsGenerating(false);
        setIsFailed(true);
      }
    }
  };

  if (isGenerating) {
    return <Loading />;
  }

  return (
    <>
      <WSHeader title="ERD 생성" />
      <div className="erd-page-container">
        {modifyMode ? (
          <ERDEdit onClose={() => setModifyMode(false)} />
        ) : (
          <>
            <div className="erd-page-header">
              <p className="erd-title">
                ✨아이디어와 명세서를 분석하여 ERD 추천을 해드려요
              </p>
              {CanEdit && (
                <div className="erd-btn-group">
                  <div className="erd-btn" onClick={() => setModifyMode(true)}>
                    수정하기
                  </div>
                  {!erdDone && (
                    <div
                      className={`erd-complete-btn ${
                        isGenerating ? "disabled" : ""
                      }`}
                      onClick={handleErdComplete}
                    >
                      저장하기
                    </div>
                  )}
                </div>
              )}
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
              <Controls />
            </ReactFlow>
          </>
        )}
      </div>
      {isFailed && (
        <BasicModal
          modalTitle="페이지를 불러오는 데 실패하였습니다"
          modalDescription="일시적인 오류가 발생했습니다 페이지를 새로고침하거나 잠시 후 다시 시도해 주세요"
          Close={() => setIsFailed(false)}
        />
      )}
    </>
  );
}
