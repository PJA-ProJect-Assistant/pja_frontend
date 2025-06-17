// import { useDispatch, useSelector } from "react-redux";
// import type { RootState } from "../../../store/store";
// import { WSHeader } from "../../../components/header/WSHeader";
// import { ReactFlow } from "reactflow";
// import {
//   generateNodesFromData,
//   initialEdges,
//   tableData,
// } from "..../../data/erdData";
// import { nodeTypes } from "./TableNode";
// import { progressworkspace } from "../../../services/workspaceApi";
// import { useNavigate } from "react-router-dom";
// import { setSelectedWS } from "../../../store/workspaceSlice";
// import { getStepIdFromNumber } from "../../../utils/projectSteps";
// import { useEffect, useState } from "react";

// export default function ERDPage() {
//   const dispatch = useDispatch();
//   const selectedWS = useSelector(
//     (state: RootState) => state.workspace.selectedWS
//   );
//   const nodes = generateNodesFromData(tableData);
//   const [erdDone, setErdDone] = useState<boolean>(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (Number(selectedWS?.progressStep) > 3) {
//       setErdDone(true);
//     }
//   }, [selectedWS]);

//   //완료 버튼
//   const handleErdComplete = async () => {
//     if (selectedWS?.progressStep === "3") {
//       try {
//         //여기에 API명세서 호출 api 선언하면 됨

//         // API생성 후 data 있어야 넘어가게
//         // if (!apidata || !apidata.data)
//         //   throw new Error("프로젝트 정보 생성 실패");
//         // else {
//         //   console.log("프로젝트 정보 : ", apidata);
//         // }

//         await progressworkspace(selectedWS.workspaceId, "4");
//         console.log("API페이지로 이동");
//         dispatch(
//           setSelectedWS({
//             ...selectedWS,
//             progressStep: "4",
//           })
//         );
//         setErdDone(true);
//         navigate(
//           `/ws/${selectedWS?.workspaceId}/step/${getStepIdFromNumber("4")}`
//         );
//       } catch (err) {
//         console.log("api명세서 ai생성 실패", err);
//       }
//     }
//   };

//   return (
//     <>
//       <WSHeader title="ERD 생성" />
//       <div className="erd-page-container">
//         <div className="erd-page-header">
//           <p className="erd-title">
//             ✨아이디어와 명세서를 분석하여 ERD 추천을 해드려요
//           </p>
//           <div className="erd-btn-group">
//             <div className="erd-btn">수정하기</div>
//             <div className="erd-btn">새 테이블 생성하기</div>
//           </div>
//         </div>
//         <ReactFlow nodes={nodes} edges={initialEdges} nodeTypes={nodeTypes} />

//         {!erdDone && (
//           <div className="erd-complete-btn-container">
//             <div className="erd-complete-btn" onClick={handleErdComplete}>
//               저장하기
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }
