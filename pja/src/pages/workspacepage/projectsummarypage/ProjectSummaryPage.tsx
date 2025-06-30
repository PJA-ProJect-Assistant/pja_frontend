import { useDispatch, useSelector } from "react-redux";
import "./ProjectSummaryPage.css";
import type { RootState } from "../../../store/store";
import { setSelectedWS } from "../../../store/workspaceSlice";
import { useNavigate } from "react-router-dom";
import { getStepIdFromNumber } from "../../../utils/projectSteps";
import { useEffect, useState } from "react";
import type { getproject, setproject } from "../../../types/project";
import { getProject, putProject } from "../../../services/projectApi";
import { WSHeader } from "../../../components/header/WSHeader";
import { postErd, postErdAI } from "../../../services/erdApi";
import Loading from "../../loadingpage/Loading";
import { useEditLock } from "../../../hooks/useEditLock";
import type { LockedUser } from "../../../types/edit";
import { BasicModal } from "../../../components/modal/BasicModal";

export default function ProjectSummaryPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedWS = useSelector(
    (state: RootState) => state.workspace.selectedWS
  );
  const Role = useSelector((state: RootState) => state.user.userRole);
  const CanEdit: boolean = Role === "OWNER" || Role === "MEMBER";

  const [summaryDone, setSummaryDone] = useState<boolean>(true);
  const [projectInfo, setProjectInfo] = useState<getproject>();
  const [title, setTitle] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [targetUsers, setTargetUsers] = useState<string[]>([]);
  const [coreFeatures, setCoreFeatures] = useState<string[]>([]);
  const [technologyStack, setTechnologyStack] = useState<string[]>([]);
  const [currentProblem, setCurrentProblem] = useState<string>("");
  const [solutionIdea, setSolutionIdea] = useState<string>("");
  const [expectedBenefits, setExpectedBenefits] = useState<string[]>([]);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFailed, setIsFailed] = useState<boolean>(false);
  const {
    getUserEditingField,
    startPolling,
    stopPolling,
    startEditing,
    stopEditing,
    setAlreadyEdit,
    alreadyEdit,
  } = useEditLock("project-info");

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    onSave: () => void
  ) => {
    if (e.key === "Enter") {
      onSave();
    }
  };

  useEffect(() => {
    startPolling();
    const getproject = async () => {
      try {
        if (selectedWS?.workspaceId) {
          const project = await getProject(selectedWS?.workspaceId);

          const data = project.data;
          if (data) {
            setProjectInfo(data);
            setTitle(data.title || "");
            setCategory(data.category || "");
            setTargetUsers(data.targetUsers || []);
            setCoreFeatures(data.coreFeatures || []);
            setTechnologyStack(data.technologyStack || []);
            setCurrentProblem(data.problemSolving.currentProblem || "");
            setSolutionIdea(data.problemSolving.solutionIdea || "");
            setExpectedBenefits(data.problemSolving.expectedBenefits || []);
          }
        }
      } catch (err) {
        console.log("프로젝트 가져오기 실패 : ", err);
        setIsFailed(true);
      }
    };
    if (selectedWS?.progressStep === "2") {
      setSummaryDone(false);
      startEditing(null, "1");
    }
    getproject();

    // 페이지를 벗어나면 stopPolling 호출
    return () => {
      stopPolling();
    };
  }, [selectedWS]);
  const handleSummaryComplete = async () => {
    stopEditing(null, "1");
    if (selectedWS?.workspaceId && projectInfo?.projectInfoId) {
      try {
        const setpj: setproject = {
          title,
          category,
          targetUsers,
          coreFeatures,
          technologyStack,
          problemSolving: {
            currentProblem,
            solutionIdea,
            expectedBenefits,
          },
        };
        //프로젝트 수정 api
        await putProject(
          selectedWS.workspaceId,
          projectInfo?.projectInfoId,
          setpj
        );
        if (selectedWS?.progressStep === "2") {
          try {
            setIsLoading(true);
            //ERDAI 생성 api 호출
            await postErdAI(selectedWS?.workspaceId);

            dispatch(
              setSelectedWS({
                ...selectedWS,
                progressStep: "3",
              })
            );
            navigate(
              `/ws/${selectedWS?.workspaceId}/${getStepIdFromNumber("3")}`
            );
          } catch (err) {
            console.log("ERD ai생성 실패 ", err);
            setIsFailed(true);
          } finally {
            setIsLoading(false);
          }
        } else {
          setSummaryDone(true);
        }
      } catch (err) {
        console.log("프로젝트 수정 실패 ", err);
        setIsFailed(true);
      }
    }
  };
  const renderEditor = (user: LockedUser | null) => {
    //확인 용
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

  return isLoading ? (
    <Loading />
  ) : (
    <>
      <WSHeader title="프로젝트 정보" />
      <div className="projectsummary-container">
        {selectedWS?.progressStep === "2" && (
          <h2>✨입력하신 프로젝트를 정리하였어요</h2>
        )}
        <div className="summary-editors">
          {renderEditor(getUserEditingField("null", "1"))}
        </div>
        <div className="projectsummary-box">
          <div className="projectsummary-content">
            <div>
              프로젝트명 :
              {editingField === "title" ? (
                <input
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => setEditingField(null)}
                  onKeyDown={(e) =>
                    handleKeyDown(e, () => setEditingField(null))
                  }
                />
              ) : (
                <span
                  onClick={() => {
                    !summaryDone && setEditingField("title");
                  }}
                >
                  {title || ""}
                </span>
              )}
            </div>

            <div>
              카테고리 :
              {editingField === "category" ? (
                <input
                  autoFocus
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  onBlur={() => setEditingField(null)}
                  onKeyDown={(e) =>
                    handleKeyDown(e, () => setEditingField(null))
                  }
                />
              ) : (
                <span
                  onClick={() => {
                    !summaryDone && setEditingField("category");
                  }}
                >
                  {" "}
                  {category || ""}
                </span>
              )}
            </div>

            <div>
              서비스 대상 :
              <ul>
                {targetUsers.map((target, index) =>
                  editingField === `target-${index}` ? (
                    <li key={index}>
                      <input
                        autoFocus
                        value={target}
                        onChange={(e) => {
                          const updated = [...targetUsers];
                          updated[index] = e.target.value;
                          setTargetUsers(updated);
                        }}
                        onBlur={() => {
                          !summaryDone && setEditingField(null);
                        }}
                        onKeyDown={(e) =>
                          handleKeyDown(e, () => setEditingField(null))
                        }
                      />
                    </li>
                  ) : (
                    <div className="summary-contentlist">
                      <li
                        key={index}
                        onClick={() => {
                          !summaryDone && setEditingField(`target-${index}`);
                        }}
                      >
                        {target}
                        {!summaryDone && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="summary-remove-button"
                            height="20px"
                            viewBox="0 -960 960 960"
                            width="20px"
                            fill="#EA3323"
                            onClick={() => {
                              const updated = [...targetUsers];
                              updated.splice(index, 1);
                              setTargetUsers(updated);
                              setEditingField(null); // 삭제 후 편집 모드 해제
                            }}
                          >
                            <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
                          </svg>
                        )}
                      </li>
                    </div>
                  )
                )}
              </ul>
              {!summaryDone && (
                <button
                  className="summary-add-button"
                  onClick={() => setTargetUsers([...targetUsers, ""])}
                >
                  + 항목 추가
                </button>
              )}
            </div>

            <div>
              확정된 기술 스택 :
              <ul>
                {technologyStack.map((tech, index) =>
                  editingField === `tech-${index}` ? (
                    <li key={index}>
                      <input
                        autoFocus
                        value={tech}
                        onChange={(e) => {
                          const updated = [...technologyStack];
                          updated[index] = e.target.value;
                          setTechnologyStack(updated);
                        }}
                        onBlur={() => setEditingField(null)}
                        onKeyDown={(e) =>
                          handleKeyDown(e, () => setEditingField(null))
                        }
                      />
                    </li>
                  ) : (
                    <div className="summary-contentlist">
                      <li
                        key={index}
                        onClick={() => {
                          !summaryDone && setEditingField(`tech-${index}`);
                        }}
                      >
                        {tech}
                        {!summaryDone && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="summary-remove-button"
                            height="20px"
                            viewBox="0 -960 960 960"
                            width="20px"
                            fill="#EA3323"
                            onClick={() => {
                              const updated = [...technologyStack];
                              updated.splice(index, 1);
                              setTechnologyStack(updated);
                              setEditingField(null); // 삭제 후 편집 모드 해제
                            }}
                          >
                            <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
                          </svg>
                        )}
                      </li>
                    </div>
                  )
                )}
              </ul>
              {!summaryDone && (
                <button
                  className="summary-add-button"
                  onClick={() => setTechnologyStack([...technologyStack, ""])}
                >
                  + 항목 추가
                </button>
              )}
            </div>

            <div>
              메인 기능 :
              <ul>
                {coreFeatures.map((feature, index) =>
                  editingField === `feature-${index}` ? (
                    <li key={index}>
                      <input
                        autoFocus
                        value={feature}
                        onChange={(e) => {
                          const updated = [...coreFeatures];
                          updated[index] = e.target.value;
                          setCoreFeatures(updated);
                        }}
                        onBlur={() => setEditingField(null)}
                        onKeyDown={(e) =>
                          handleKeyDown(e, () => setEditingField(null))
                        }
                      />
                    </li>
                  ) : (
                    <div className="summary-contentlist">
                      <li
                        key={index}
                        onClick={() => {
                          !summaryDone && setEditingField(`feature-${index}`);
                        }}
                      >
                        {feature}
                        {!summaryDone && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="summary-remove-button"
                            height="20px"
                            viewBox="0 -960 960 960"
                            width="20px"
                            fill="#EA3323"
                            onClick={() => {
                              const updated = [...coreFeatures];
                              updated.splice(index, 1);
                              setCoreFeatures(updated);
                              setEditingField(null); // 삭제 후 편집 모드 해제
                            }}
                          >
                            <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
                          </svg>
                        )}
                      </li>
                    </div>
                  )
                )}
              </ul>
              {!summaryDone && (
                <button
                  className="summary-add-button"
                  onClick={() => setCoreFeatures([...coreFeatures, ""])}
                >
                  + 항목 추가
                </button>
              )}
            </div>

            <div>
              현재 문제 :
              {editingField === "problem" ? (
                <textarea
                  autoFocus
                  value={currentProblem}
                  onChange={(e) => setCurrentProblem(e.target.value)}
                  onBlur={() => setEditingField(null)}
                />
              ) : (
                <span
                  onClick={() => {
                    !summaryDone && setEditingField("problem");
                  }}
                >
                  {currentProblem || ""}
                </span>
              )}
            </div>

            <div>
              해결 아이디어 :
              {editingField === "solution" ? (
                <textarea
                  autoFocus
                  value={solutionIdea}
                  className="solutionidea-textarea"
                  onChange={(e) => setSolutionIdea(e.target.value)}
                  onBlur={() => setEditingField(null)}
                />
              ) : (
                <span
                  onClick={() => {
                    !summaryDone && setEditingField("solution");
                  }}
                >
                  {solutionIdea || ""}
                </span>
              )}
            </div>

            <div>
              기대 효과 :
              <ul>
                {expectedBenefits.map((benefit, index) =>
                  editingField === `benefit-${index}` ? (
                    <li key={index}>
                      <input
                        autoFocus
                        value={benefit}
                        onChange={(e) => {
                          const updated = [...expectedBenefits];
                          updated[index] = e.target.value;
                          setExpectedBenefits(updated);
                        }}
                        onBlur={() => setEditingField(null)}
                        onKeyDown={(e) =>
                          handleKeyDown(e, () => setEditingField(null))
                        }
                      />
                    </li>
                  ) : (
                    <div className="summary-contentlist">
                      <li
                        key={index}
                        onClick={() => {
                          !summaryDone && setEditingField(`benefit-${index}`);
                        }}
                      >
                        {benefit}
                        {!summaryDone && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="summary-remove-button"
                            height="20px"
                            viewBox="0 -960 960 960"
                            width="20px"
                            fill="#EA3323"
                            onClick={() => {
                              const updated = [...expectedBenefits];
                              updated.splice(index, 1);
                              setExpectedBenefits(updated);
                              setEditingField(null); // 삭제 후 편집 모드 해제
                            }}
                          >
                            <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
                          </svg>
                        )}
                      </li>
                    </div>
                  )
                )}
              </ul>
              {!summaryDone && (
                <button
                  className="summary-add-button"
                  onClick={() => setExpectedBenefits([...expectedBenefits, ""])}
                >
                  + 항목 추가
                </button>
              )}
            </div>
          </div>
          {CanEdit && (
            <div className="projectsummary-btn">
              {summaryDone ? (
                <button
                  onClick={() => {
                    setSummaryDone(false);
                    startEditing(null, "1");
                  }}
                >
                  수정하기
                </button>
              ) : (
                <button onClick={handleSummaryComplete}>완료하기</button>
              )}
            </div>
          )}
        </div>
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
