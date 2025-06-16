import { useDispatch, useSelector } from "react-redux";
import "./ProjectSummaryPage.css";
import type { RootState } from "../../../store/store";
import { setSelectedWS } from "../../../store/workspaceSlice";
import { useNavigate } from "react-router-dom";
import { getStepIdFromNumber } from "../../../utils/projectSteps";
import { useEffect, useState } from "react";
import { progressworkspace } from "../../../services/workspaceApi";
import type { getproject } from "../../../types/project";
import { getProject } from "../../../services/projectApi";
import { WSHeader } from "../../../components/header/WSHeader";

export default function ProjectSummaryPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedWS = useSelector(
    (state: RootState) => state.workspace.selectedWS
  );
  const [summaryDone, setSummaryDone] = useState<boolean>();
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

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    onSave: () => void
  ) => {
    if (e.key === "Enter") {
      onSave();
    }
  };

  useEffect(() => {
    const getproject = async () => {
      try {
        if (selectedWS?.workspaceId) {
          const project = await getProject(selectedWS?.workspaceId);
          console.log("프로젝트 조회 결과 : ", project);
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
      }
    };
    if (Number(selectedWS?.progressStep) > 2) {
      setSummaryDone(true);
    }
    getproject();
  }, [selectedWS]);
  const handleSummaryComplete = async () => {
    if (selectedWS?.workspaceId) {
      try {
        //프로젝트 수정 api

        if (selectedWS?.progressStep === "2") {
          await progressworkspace(selectedWS.workspaceId, "3");
          console.log("ERD페이지로 이동");
          dispatch(
            setSelectedWS({
              ...selectedWS,
              progressStep: "3",
            })
          );
          setSummaryDone(true);
          navigate(
            `/ws/${selectedWS?.workspaceId}/step/${getStepIdFromNumber("3")}`
          );
        } else {
          setSummaryDone(true);
        }
      } catch (err) {}
    }
  };
  return (
    <>
      <WSHeader title="프로젝트 정보" />
      <div className="ideasummary-container">
        {selectedWS?.progressStep === "2" && (
          <h2>✨입력하신 프로젝트를 요약하였어요</h2>
        )}
        <div className="ideasummary-box">
          <div className="ideasummary-content">
            <p>
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
                <span onClick={() => setEditingField("title")}>
                  {title || ""}
                </span>
              )}
            </p>

            <p>
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
                <span onClick={() => setEditingField("category")}>
                  {" "}
                  {category || ""}
                </span>
              )}
            </p>

            <p>
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
                        onBlur={() => setEditingField(null)}
                        onKeyDown={(e) =>
                          handleKeyDown(e, () => setEditingField(null))
                        }
                      />
                    </li>
                  ) : (
                    <li
                      key={index}
                      onClick={() => setEditingField(`target-${index}`)}
                    >
                      {target}
                    </li>
                  )
                )}
              </ul>
            </p>

            <p>
              확정된 기술 스택:
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
                    <li
                      key={index}
                      onClick={() => setEditingField(`tech-${index}`)}
                    >
                      {tech}
                    </li>
                  )
                )}
              </ul>
            </p>

            <p>
              메인 기능:
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
                    <li
                      key={index}
                      onClick={() => setEditingField(`feature-${index}`)}
                    >
                      {feature}
                    </li>
                  )
                )}
              </ul>
            </p>

            <p>
              현재 문제 :
              {editingField === "problem" ? (
                <input
                  autoFocus
                  value={currentProblem}
                  onChange={(e) => setCurrentProblem(e.target.value)}
                  onBlur={() => setEditingField(null)}
                  onKeyDown={(e) =>
                    handleKeyDown(e, () => setEditingField(null))
                  }
                />
              ) : (
                <span onClick={() => setEditingField("problem")}>
                  {currentProblem || ""}
                </span>
              )}
            </p>

            <p>
              해결 아이디어 :
              {editingField === "solution" ? (
                <input
                  autoFocus
                  value={currentProblem}
                  onChange={(e) => setSolutionIdea(e.target.value)}
                  onBlur={() => setEditingField(null)}
                  onKeyDown={(e) =>
                    handleKeyDown(e, () => setEditingField(null))
                  }
                />
              ) : (
                <span onClick={() => setEditingField("solution")}>
                  {solutionIdea || ""}
                </span>
              )}
            </p>

            <p>
              기대 효과:
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
                    <li
                      key={index}
                      onClick={() => setEditingField(`benefit-${index}`)}
                    >
                      {benefit}
                    </li>
                  )
                )}
              </ul>
            </p>
          </div>
          <div className="ideasummary-btn">
            {summaryDone ? (
              <button>수정하기</button>
            ) : (
              <button onClick={handleSummaryComplete}>완료하기</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
