import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setSelectedWS } from "../../../store/workspaceSlice";
import "./ProjectForm.css";
import type { workspace } from "../../../types/workspace";
import type { RootState } from "../../../store/store";
import { useNavigate } from "react-router-dom";
import { getStepIdFromNumber } from "../../../utils/projectSteps";
import { getidea, inputtech, inputfunc, putidea } from "../../../services/ideaApi";
import type { IdeaData } from "../../../types/idea";
import { StackDeleteModal, FeatureDeleteModal } from "../../../components/modal/WsmenuModal";
import { progressworkspace } from "../../../services/workspaceApi";

export default function ProhectForm() {
  const [ideaDone, setIdeaDone] = useState<boolean>(false);
  const [ideaId, setIdeaId] = useState<number>();
  const [wsId, setWsId] = useState<number>();
  const [openStackModal, setOpenStackModal] = useState<boolean>(false);
  const [openFeatureModal, setOpenFeatureModal] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedWS = useSelector(
    (state: RootState) => state.workspace.selectedWS
  );

  const [features, setFeatures] = useState<{ id: number; content: string }[]>([]);
  const [stacks, setStacks] = useState<{ id: number; content: string }[]>([]);
  const [projectName, setProjectName] = useState("");
  const [projectTarget, setProjectTarget] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const addFeature = async () => {
    try {
      if (wsId && ideaId) {
        const response = await inputfunc(wsId, ideaId);
        const newFeature = response.data;
        if (newFeature) {
          setFeatures([...features, {
            id: newFeature.mainFunctionId,
            content: newFeature.content,
          }]);
        }
      }
    } catch (error) {
      console.error("기능 추가 실패:", error);
    }
  };

  const addStack = async () => {
    try {
      if (wsId && ideaId) {
        const response = await inputtech(wsId, ideaId);
        const newStack = response.data;
        if (newStack) {
          setStacks([...stacks, {
            id: newStack.techStackId,
            content: newStack.content,
          }]);
        }
      }
    } catch (error) {
      console.error("기술 스택 추가 실패:", error);
    }
  };

  //기능 삭제
  const removeFeature = (id: number) => {
    if (features.length <= 2) {
      setOpenFeatureModal(true);
    }
    else {
      setFeatures((prev) => prev.filter((f) => f.id !== id));
    }
  };

  //기술 삭제
  const removeStack = (id: number) => {
    if (stacks.length <= 2) {
      setOpenStackModal(true);
    }
    setStacks((prev) => prev.filter((s) => s.id !== id));
  };

  useEffect(() => {
    if (Number(selectedWS?.progressStep) > 0) {
      setIdeaDone(true);
    }
    const GetIdea = async () => {
      try {
        if (typeof selectedWS?.workspaceId === "number") {
          setWsId(selectedWS.workspaceId);
          const response = await getidea(selectedWS?.workspaceId);
          console.log("아이디어 조회 :", response);
          if (response.data) {
            const data: IdeaData = response.data;

            setIdeaId(data.ideaInputId);

            // 상태값 업데이트
            setProjectName(data.projectName ?? "");
            setProjectTarget(data.projectTarget ?? "");
            setProjectDescription(data.projectDescription ?? "");

            // mainFunction -> features
            const mainFunctions = (data.mainFunction ?? []).map((f: any) => ({
              id: f.mainFunctionId,
              content: f.content ?? "",
            }));
            setFeatures(mainFunctions.length ? mainFunctions : []);

            // techStack -> stacks
            const techStacks = (data.techStack ?? []).map((t: any) => ({
              id: t.techStackId,
              content: t.content ?? "",
            }));
            setStacks(techStacks.length ? techStacks : []);
          }
        }
        else {
          console.log(
            "워크스페이스 아이디 없음"
          );

        }
      } catch (error) {
        console.error("아이디어 조회 실패:", error);
      }
    }
    GetIdea();
  }, [selectedWS]);

  const updateFeature = (id: number, value: string) => {
    const updated = features.map((f) =>
      f.id === id ? { ...f, content: value } : f
    );
    setFeatures(updated);
  };

  const updateStack = (id: number, value: string) => {
    const updated = stacks.map((s) =>
      s.id === id ? { ...s, content: value } : s
    );
    setStacks(updated);
  };

  const isFormIncomplete =
    !projectName.trim() ||
    !projectTarget.trim() ||
    !projectDescription.trim() ||
    stacks.some((s) => !s.content.trim()) ||
    features.some((f) => !f.content.trim());

  const handleSubmit = async () => {
    if (!selectedWS || typeof ideaId != "number") return;
    try {
      const ideaData: IdeaData = {
        ideaInputId: ideaId,
        projectName,
        projectTarget,
        mainFunction: features.map(f => ({
          mainFunctionId: f.id,
          content: f.content,
        })),
        techStack: stacks.map(s => ({
          techStackId: s.id,
          content: s.content,
        })),
        projectDescription,
      };

      await putidea(selectedWS.workspaceId, ideaData);
      setIdeaDone(true);

      if (selectedWS.progressStep === "0") {
        const response = await progressworkspace(selectedWS.workspaceId, "1");
        console.log("next step : ", response.data);

        const updatedWorkspace: workspace = {
          ...selectedWS, // 기존 값 유지
          progressStep: "1",
        };

        dispatch(setSelectedWS(updatedWorkspace));
        navigate(
          `/ws/${selectedWS?.workspaceId}/step/${getStepIdFromNumber(
            "1")}`
        );
      }
    }
    catch (err) {
      console.log("아이디어 수정 실패 : ", err);
    }
  };

  const handlemodify = () => {
    setIdeaDone(false);
  }

  return (
    <div className="form-container">
      <div>
        <label className="form-label">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#000000"
          >
            <path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
          </svg>
          <p>프로젝트명</p>
        </label>
        <input
          type="text"
          disabled={ideaDone}
          className="form-input-field"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="ex. 프로젝트 워크 플로우 관리 웹서비스"
        />
      </div>

      <div>
        <label className="form-label">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#000000"
          >
            <path d="M620-520q25 0 42.5-17.5T680-580q0-25-17.5-42.5T620-640q-25 0-42.5 17.5T560-580q0 25 17.5 42.5T620-520Zm-280 0q25 0 42.5-17.5T400-580q0-25-17.5-42.5T340-640q-25 0-42.5 17.5T280-580q0 25 17.5 42.5T340-520Zm140 260q68 0 123.5-38.5T684-400H276q25 63 80.5 101.5T480-260Zm0 180q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Z" />
          </svg>
          <p>프로젝트 대상</p>
        </label>
        <input
          type="text"
          disabled={ideaDone}
          className="form-input-field"
          value={projectTarget}
          onChange={(e) => setProjectTarget(e.target.value)}
          placeholder="ex. 프로젝트 경험이 적은 1-3년차 초보 개발자"
        />
      </div>

      <div>
        <label className="form-label">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#000000"
          >
            <path d="M480-80q-26 0-47-12.5T400-126q-33 0-56.5-23.5T320-206v-142q-59-39-94.5-103T190-590q0-121 84.5-205.5T480-880q121 0 205.5 84.5T770-590q0 77-35.5 140T640-348v142q0 33-23.5 56.5T560-126q-12 21-33 33.5T480-80Zm-80-126h160v-36H400v36Zm0-76h160v-38H400v38Zm-8-118h58v-108l-88-88 42-42 76 76 76-76 42 42-88 88v108h58q54-26 88-76.5T690-590q0-88-61-149t-149-61q-88 0-149 61t-61 149q0 63 34 113.5t88 76.5Zm88-162Zm0-38Z" />
          </svg>
          <p>메인 기능</p>
        </label>
        {features.map((feature, index) => (
          <div key={feature.id} className="form-input-row">
            <input
              type="text"
              disabled={ideaDone}
              className="form-input-field"
              placeholder={`기능 ${index + 1}`}
              value={feature.content}
              onChange={(e) => updateFeature(feature.id, e.target.value)}
            />
            {!ideaDone && <svg xmlns="http://www.w3.org/2000/svg"
              className="form-remove-button"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px" fill="#EA3323"
              onClick={() => removeFeature(feature.id)}>
              <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
            </svg>
            }
          </div>
        ))}
        {!ideaDone && <button className="form-add-button" onClick={addFeature}>
          + 메인 기능 추가
        </button>
        }
      </div>

      <div>
        <label className="form-label">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#000000"
          >
            <path d="M352-120H200q-33 0-56.5-23.5T120-200v-152q48 0 84-30.5t36-77.5q0-47-36-77.5T120-568v-152q0-33 23.5-56.5T200-800h160q0-42 29-71t71-29q42 0 71 29t29 71h160q33 0 56.5 23.5T800-720v160q42 0 71 29t29 71q0 42-29 71t-71 29v160q0 33-23.5 56.5T720-120H568q0-50-31.5-85T460-240q-45 0-76.5 35T352-120Zm-152-80h85q24-66 77-93t98-27q45 0 98 27t77 93h85v-240h80q8 0 14-6t6-14q0-8-6-14t-14-6h-80v-240H480v-80q0-8-6-14t-14-6q-8 0-14 6t-6 14v80H200v88q54 20 87 67t33 105q0 57-33 104t-87 68v88Zm260-260Z" />
          </svg>
          <p>기술스택</p>
        </label>
        {stacks.map((stack, index) => (
          <div key={stack.id} className="form-input-row">
            <input
              type="text"
              disabled={ideaDone}
              className="form-input-field"
              placeholder={`스택 ${index + 1}`}
              value={stack.content}
              onChange={(e) => updateStack(stack.id, e.target.value)}
            />
            {!ideaDone && <svg xmlns="http://www.w3.org/2000/svg"
              className="form-remove-button"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px" fill="#EA3323"
              onClick={() => removeStack(stack.id)}>
              <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
            </svg>
            }
          </div>
        ))}
        {!ideaDone && <button className="form-add-button" onClick={addStack}>
          + 기술 스택 추가
        </button>}
      </div>

      <div>
        <label className="form-label">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#000000"
          >
            <path d="M240-400h320v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z" />
          </svg>
          <p>프로젝트 설명 (200자 이상)</p>
        </label>
        <textarea
          className="form-input-field"
          disabled={ideaDone}
          rows={10}
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          placeholder="ex. 사용자가 프로젝트에 대한 설명을 입력하면 요약 및 정리를 한다. 요약/정리 내용을 바탕으로 ERD와 API 명세서를 AI로 작성한다. ERD와 API 명세서 작성이 완료되면 프로젝트 관리를 위한 워크 스페이스를 생성한다. 워크 스페이스의 작업 단계는 AI 기반으로 초안을 생성해준다...."
        />
      </div>

      <div className="form-submit-wrapper">
        {ideaDone ? <button
          className="form-submit-button"
          onClick={handlemodify}
        >
          수정하기
        </button> : <button
          disabled={isFormIncomplete}
          className="form-submit-button"
          onClick={handleSubmit}
        >
          저장하기
        </button>}
      </div>
      {openFeatureModal && <FeatureDeleteModal onClose={() => setOpenFeatureModal(false)} />}
      {openStackModal && <StackDeleteModal onClose={() => setOpenStackModal(false)} />}
    </div>
  );
}
