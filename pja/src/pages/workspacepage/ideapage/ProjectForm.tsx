import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setSelectedWS } from "../../../store/workspaceSlice";
import "./ProjectForm.css";
import type { workspace } from "../../../types/workspace";
import type { RootState } from "../../../store/store";
import { useNavigate } from "react-router-dom";
import { getStepIdFromNumber } from "../../../utils/projectSteps";
import {
  getidea,
  inputtech,
  inputfunc,
  deletetech,
  deletefunc,
  putideaFunction,
  putideaName,
  putideaTarget,
  putideaTech,
  putideaDescription,
} from "../../../services/ideaApi";
import type { IdeaData } from "../../../types/idea";
import { BasicModal } from "../../../components/modal/BasicModal";
import { progressworkspace } from "../../../services/workspaceApi";
import { useEditLock } from "../../../hooks/useEditLock";
import type { LockedUser } from "../../../types/edit";

export default function ProhectForm() {
  const [ideaDone, setIdeaDone] = useState<boolean>(true);
  const [ideaId, setIdeaId] = useState<number>();
  const [wsId, setWsId] = useState<number>();
  const [openStackModal, setOpenStackModal] = useState<boolean>(false);
  const [openFeatureModal, setOpenFeatureModal] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedWS = useSelector(
    (state: RootState) => state.workspace.selectedWS
  );
  const Role = useSelector((state: RootState) => state.user.userRole);
  const CanEdit: boolean = Role === "OWNER" || Role === "MEMBER";

  const [features, setFeatures] = useState<{ id: number; content: string }[]>(
    []
  );
  const [stacks, setStacks] = useState<{ id: number; content: string }[]>([]);
  const [projectName, setProjectName] = useState("");
  const [projectTarget, setProjectTarget] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const {
    getUserEditingField,
    startPolling,
    stopPolling,
    startEditing,
    stopEditing,
    setAlreadyEdit,
    alreadyEdit,
  } = useEditLock("idea-input");

  const addFeature = async () => {
    try {
      if (wsId && ideaId) {
        const response = await inputfunc(wsId, ideaId);
        const newFeature = response.data;
        if (newFeature) {
          setFeatures([
            ...features,
            {
              id: newFeature.mainFunctionId,
              content: newFeature.content,
            },
          ]);
        }
      }
    } catch (error) {
      console.error("기능 추가 실패:", error);
      setError("요청을 처리할 수 없습니다");
    }
  };

  const addStack = async () => {
    try {
      if (wsId && ideaId) {
        const response = await inputtech(wsId, ideaId);
        const newStack = response.data;
        if (newStack) {
          setStacks([
            ...stacks,
            {
              id: newStack.techStackId,
              content: newStack.content,
            },
          ]);
        }
      }
    } catch (error) {
      console.error("기술 스택 추가 실패:", error);
      setError("요청을 처리할 수 없습니다");
    }
  };

  //기능 삭제
  const removeFeature = async (id: number) => {
    if (features.length <= 2) {
      setOpenFeatureModal(true);
    } else {
      //기능 삭제 api
      try {
        await deletefunc(selectedWS?.workspaceId ?? 0, id);
        setFeatures((prev) => prev.filter((f) => f.id !== id));
      } catch (err) {
        console.log("기능 삭제 실패", err);
        setError("요청을 처리할 수 없습니다");
      }
    }
  };

  //기술 삭제
  const removeStack = async (id: number) => {
    if (stacks.length <= 2) {
      setOpenStackModal(true);
    } else {
      //기술삭제 api
      try {
        await deletetech(selectedWS?.workspaceId ?? 0, id);
        setStacks((prev) => prev.filter((s) => s.id !== id));
      } catch (err) {
        console.log("기술 삭제 실패", err);
        setError("요청을 처리할 수 없습니다");
      }
    }
  };

  useEffect(() => {
    if (Number(selectedWS?.progressStep) === 0) {
      setIdeaDone(false);
      startPolling();
    }
    const GetIdea = async () => {
      try {
        if (typeof selectedWS?.workspaceId === "number") {
          setWsId(selectedWS.workspaceId);
          const response = await getidea(selectedWS?.workspaceId);

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
      } catch (error) {
        console.error("아이디어 조회 실패:", error);
        setError("페이지를 불러오는 데 실패했습니다");
      }
    };
    GetIdea();
  }, [selectedWS]);

  //프로젝트명 수정
  const updateProjectName = async () => {
    if (selectedWS?.workspaceId && ideaId) {
      try {
        //프로젝트명 수정
        await putideaName(selectedWS?.workspaceId, ideaId, projectName);
      } catch {
        setError("요청을 처리할 수 없습니다");
      } finally {
        stopEditing("projectName", null);
      }
    }
  };

  //프로젝트 타켓 수정
  const updateProjectTarget = async () => {
    if (selectedWS?.workspaceId && ideaId) {
      try {
        //프로젝트타켓 수정
        await putideaTarget(selectedWS?.workspaceId, ideaId, projectTarget);
      } catch {
        setError("요청을 처리할 수 없습니다");
      } finally {
        stopEditing("projectTarget", null);
      }
    }
  };

  const updateFeature = async (id: number, value: string) => {
    const updated = features.map((f) =>
      f.id === id ? { ...f, content: value } : f
    );
    setFeatures(updated);
  };

  //프로젝트 기능 수정
  const updateFeatureApi = async (id: number) => {
    const content = features.find((f) => f.id === id)?.content;
    if (selectedWS?.workspaceId && ideaId && content) {
      try {
        //프로젝트 기능 수정
        await putideaFunction(selectedWS?.workspaceId, ideaId, id, content);
      } catch {
        setError("요청을 처리할 수 없습니다");
      } finally {
        stopEditing("mainFunction", id.toString());
      }
    }
  };

  const updateStack = (id: number, value: string) => {
    const updated = stacks.map((s) =>
      s.id === id ? { ...s, content: value } : s
    );
    setStacks(updated);
  };

  //프로젝트 기술 수정
  const updateTechApi = async (id: number) => {
    const content = stacks.find((f) => f.id === id)?.content;
    if (selectedWS?.workspaceId && ideaId && content) {
      try {
        //프로젝트 기술 수정
        await putideaTech(selectedWS?.workspaceId, ideaId, id, content);
      } catch {
        setError("요청을 처리할 수 없습니다");
      } finally {
        stopEditing("techStack", id.toString());
      }
    }
  };

  //프로젝트 기술 수정
  const updateDescriptionApi = async () => {
    if (selectedWS?.workspaceId && ideaId) {
      try {
        //프로젝트 기능 수정
        await putideaDescription(
          selectedWS?.workspaceId,
          ideaId,
          projectDescription
        );
      } catch {
        setError("요청을 처리할 수 없습니다");
      } finally {
        stopEditing("projectDescription", null);
      }
    }
  };

  const isFormIncomplete =
    !projectName.trim() ||
    !projectTarget.trim() ||
    !(projectDescription.length >= 200) ||
    stacks.some((s) => !s.content.trim()) ||
    features.some((f) => !f.content.trim());

  const handleSubmit = async () => {
    stopPolling();
    if (!selectedWS || typeof ideaId != "number") return;
    setIdeaDone(true);

    if (selectedWS.progressStep === "0") {
      const response = await progressworkspace(selectedWS.workspaceId, "1");
      console.log("next step : ", response.data);

      const updatedWorkspace: workspace = {
        ...selectedWS, // 기존 값 유지
        progressStep: "1",
      };

      dispatch(setSelectedWS(updatedWorkspace));
      navigate(`/ws/${selectedWS?.workspaceId}/${getStepIdFromNumber("1")}`);
    }
  };

  const handlemodify = () => {
    setIdeaDone(false);
    startPolling();
  };

  const renderEditor = (user: LockedUser | null) => {
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
    <div className="form-container">
      <p>✏️프로젝트 생성을 위한 정보를 입력해주세요</p>
      <div>
        <label className="form-label">
          <p>💻 프로젝트명</p>
        </label>
        <div className="editors-container">
          <div className="editors">
            {renderEditor(getUserEditingField("projectName", null))}
          </div>
          <input
            type="text"
            disabled={ideaDone || !CanEdit}
            className="form-input-field"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onFocus={() => {
              startEditing("projectName", null);
            }} // 편집 시작 호출
            onBlur={() => updateProjectName()}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur(); // blur 이벤트를 강제로 발생시켜 onBlur 실행
              }
            }}
            placeholder="ex. 프로젝트 워크 플로우 관리 웹서비스"
          />
        </div>
      </div>

      <div>
        <label className="form-label">
          <p>😊 프로젝트 대상</p>
        </label>
        <div className="editors-container">
          <div className="editors">
            {renderEditor(getUserEditingField("projectTarget", null))}
          </div>
          <input
            type="text"
            disabled={ideaDone || !CanEdit}
            className="form-input-field"
            value={projectTarget}
            onChange={(e) => setProjectTarget(e.target.value)}
            onFocus={() => {
              startEditing("projectTarget", null);
            }}
            onBlur={() => updateProjectTarget()}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur();
              }
            }}
            placeholder="ex. 프로젝트 경험이 적은 1-3년차 초보 개발자"
          />
        </div>
      </div>

      <div>
        <label className="form-label">
          <p>💡 메인 기능</p>
        </label>
        <div className="form-input">
          {features.map((feature, index) => {
            return (
              <div key={feature.id} className="editors-container">
                <div className="editors">
                  {renderEditor(
                    getUserEditingField("mainFunction", feature.id.toString())
                  )}
                </div>
                <input
                  type="text"
                  disabled={ideaDone || !CanEdit}
                  className="form-input-field"
                  placeholder={`기능 ${index + 1}`}
                  value={feature.content}
                  onChange={(e) => updateFeature(feature.id, e.target.value)}
                  onFocus={() =>
                    startEditing("mainFunction", feature.id.toString())
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.currentTarget.blur();
                    }
                  }}
                  onBlur={() => updateFeatureApi(feature.id)}
                />
                {!ideaDone && CanEdit && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="form-remove-button"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#EA3323"
                    onClick={() => removeFeature(feature.id)}
                  >
                    <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
        {!ideaDone && CanEdit && (
          <button className="form-add-button" onClick={addFeature}>
            + 메인 기능 추가
          </button>
        )}
      </div>

      <div>
        <label className="form-label">
          <p>🧩 기술스택</p>
        </label>
        <div className="form-input">
          {stacks.map((stack, index) => (
            <div key={stack.id} className="editors-container">
              <div className="editors">
                {renderEditor(
                  getUserEditingField("techStack", stack.id.toString())
                )}
              </div>
              <input
                type="text"
                disabled={ideaDone || !CanEdit}
                className="form-input-field"
                placeholder={`스택 ${index + 1}`}
                value={stack.content}
                onChange={(e) => updateStack(stack.id, e.target.value)}
                onFocus={() => startEditing("techStack", stack.id.toString())}
                onBlur={() => updateTechApi(stack.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.currentTarget.blur();
                  }
                }}
              />
              {!ideaDone && CanEdit && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="form-remove-button"
                  height="20px"
                  viewBox="0 -960 960 960"
                  width="20px"
                  fill="#EA3323"
                  onClick={() => removeStack(stack.id)}
                >
                  <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
                </svg>
              )}
            </div>
          ))}
        </div>
        {!ideaDone && CanEdit && (
          <button className="form-add-button" onClick={addStack}>
            + 기술 스택 추가
          </button>
        )}
      </div>

      <div>
        <label className="form-label">
          <p>🗨️ 프로젝트 설명 (200자 이상)</p>
          {projectDescription.length > 0 && (
            <p className="textarea-length">
              {" "}
              현재 : {projectDescription.length}자
            </p>
          )}
        </label>
        <div className="editors-container">
          <div className="editors">
            {renderEditor(getUserEditingField("projectDescription", null))}
          </div>
          <textarea
            className="form-input-field"
            disabled={ideaDone || !CanEdit}
            rows={10}
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            onFocus={() => {
              startEditing("projectDescription", null);
            }}
            onBlur={() => updateDescriptionApi()}
            placeholder="ex. 사용자가 프로젝트에 대한 설명을 입력하면 요약 및 정리를 한다. 요약/정리 내용을 바탕으로 ERD와 API 명세서를 AI로 작성한다. ERD와 API 명세서 작성이 완료되면 프로젝트 관리를 위한 워크 스페이스를 생성한다. 워크 스페이스의 작업 단계는 AI 기반으로 초안을 생성해준다...."
          />
        </div>
      </div>
      <div className="form-submit-wrapper">
        {CanEdit &&
          (ideaDone ? (
            <button
              className="form-submit-button"
              onClick={() => {
                handlemodify();
              }}
            >
              수정하기
            </button>
          ) : (
            <button
              disabled={isFormIncomplete}
              className="form-submit-button"
              onClick={() => {
                handleSubmit();
              }}
            >
              저장하기
            </button>
          ))}
      </div>
      {openFeatureModal && (
        <BasicModal
          modalTitle="삭제가 불가능합니다"
          modalDescription="메인 기능이 최소 2개는 필요합니다"
          Close={() => setOpenFeatureModal(false)}
        />
      )}
      {openStackModal && (
        <BasicModal
          modalTitle="삭제가 불가능합니다"
          modalDescription="기술 스택이 최소 2개는 필요합니다"
          Close={() => setOpenStackModal(false)}
        />
      )}
      {alreadyEdit && (
        <BasicModal
          modalTitle="수정이 불가능합니다"
          modalDescription="다른 사용자가 수정 중입니다"
          Close={() => setAlreadyEdit(false)}
        />
      )}
      {error && (
        <BasicModal
          modalTitle={error}
          modalDescription="일시적인 오류가 발생했습니다 페이지를 새로고침하거나 잠시 후 다시 시도해 주세요"
          Close={() => setError("")}
        />
      )}
    </div>
  );
}
