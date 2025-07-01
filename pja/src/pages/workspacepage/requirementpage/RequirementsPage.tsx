import { WSHeader } from "../../../components/header/WSHeader";
import "./RequirementsPage.css";
import type { setrequire, getrequire } from "../../../types/requirement";
import { useEffect, useState } from "react";
import {
  deleterequirement,
  getrequirement,
  inputrequirement,
  putrequirement,
  Requirementgenerate,
} from "../../../services/requirementApi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { BasicModal } from "../../../components/modal/BasicModal";
import type { workspace } from "../../../types/workspace";
import { setSelectedWS } from "../../../store/workspaceSlice";
import { getStepIdFromNumber } from "../../../utils/projectSteps";
import { postProjectAI } from "../../../services/projectApi";
import Loading from "../../loadingpage/Loading";
import { useEditLock } from "../../../hooks/useEditLock";
import type { LockedUser } from "../../../types/edit";

export default function RequirementsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedWS = useSelector(
    (state: RootState) => state.workspace.selectedWS
  );
  const Role = useSelector((state: RootState) => state.user.userRole);
  const CanEdit: boolean = Role === "OWNER" || Role === "MEMBER";

  const {
    getUserEditingField,
    startPolling,
    stopPolling,
    startEditing,
    stopEditing,
    setAlreadyEdit,
    alreadyEdit,
  } = useEditLock("requirements");

  const [isFailed, setIsFailed] = useState<boolean>(false);

  const [requireDone, setRequireDone] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const [nextPageloading, setNextPageLoading] = useState(false);
  const [requirements, setRequirements] = useState<getrequire[]>([]);
  const [aiRecommend, setAiRecommend] = useState<boolean>(false);
  const [openAIModal, setOpenAIModal] = useState<boolean>(false);
  const [aiRequirements, setAiRequirements] = useState<setrequire[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>("");
  const [noRequire, setNoRequire] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const getRequire = async () => {
    if (selectedWS?.workspaceId) {
      try {
        const response = await getrequirement(selectedWS?.workspaceId);
        if (response.data) {
          const sortedData = [...response.data].sort(
            (a, b) => a.requirementId - b.requirementId
          );
          setRequirements(sortedData);
        }
      } catch (error) {
        setError("페이지를 불러오는 데 실패했습니다");
      }
    }
  };

  useEffect(() => {
    getRequire();
    if (selectedWS?.progressStep === "1") {
      setRequireDone(false);
      startPolling();
    }
  }, [selectedWS]);

  useEffect(() => {
    if (requirements) {
      if (
        requirements.filter((req) => req.requirementType === "FUNCTIONAL")
          .length >= 3 &&
        requirements.filter((req) => req.requirementType === "PERFORMANCE")
          .length >= 3
      ) {
        setAiRecommend(true);
      } else {
        setAiRecommend(false);
      }
    }
  }, [requirements]);

  const handleAddFunction = async (content: string) => {
    try {
      if (selectedWS?.workspaceId) {
        await inputrequirement(selectedWS?.workspaceId, "FUNCTIONAL", content);
        getRequire();
      }
    } catch (err) {
      setIsFailed(true);
    }
  };
  const handleAddPerformance = async (content: string) => {
    try {
      if (selectedWS?.workspaceId) {
        await inputrequirement(selectedWS?.workspaceId, "PERFORMANCE", content);
        getRequire();
      }
    } catch (err) {
      setIsFailed(true);
    }
  };

  // ai 추천받기
  const handleAiRequirements = async () => {
    if (aiRecommend) {
      setLoading(true);
      try {
        if (selectedWS?.workspaceId) {
          const setrequirements: setrequire[] = requirements.map(
            ({ requirementType, content }) => ({
              requirementType,
              content,
            })
          );
          const response = await Requirementgenerate(
            selectedWS.workspaceId,
            setrequirements
          );
          setAiRequirements(response.data ?? []);
        }
      } catch (err) {
        setIsFailed(true);
      } finally {
        setLoading(false);
      }
    } else {
      setOpenAIModal(true);
    }
  };

  // AI 추천 결과 중 하나 완료
  const handleAiAccept = async (ai: setrequire) => {
    if (selectedWS?.workspaceId) {
      try {
        if (ai.requirementType === "FUNCTIONAL") {
          await handleAddFunction(ai.content);
        } else if (ai.requirementType === "PERFORMANCE") {
          await handleAddPerformance(ai.content);
        }
        setAiRequirements((prev) => prev.filter((item) => item !== ai));
      } catch (err) {
        setIsFailed(true);
      }
    }
  };

  // AI 추천 항목 취소
  const handleAiCancel = (ai: setrequire) => {
    setAiRequirements((prev) => prev.filter((item) => item !== ai));
  };

  const handleEditClick = (req: getrequire) => {
    setEditingId(req.requirementId);
    setEditText(req.content);
  };

  const handleEditSubmit = async () => {
    if (editingId !== null && selectedWS?.workspaceId) {
      const original = requirements.find(
        (req) => req.requirementId === editingId
      );

      // 변경 내용이 없으면 종료
      if (!original || original.content === editText.trim()) {
        setEditingId(null);
        setEditText("");
        return;
      }
      await putrequirement(selectedWS?.workspaceId, editingId, editText);
      setRequirements((prev) =>
        prev.map((req) =>
          req.requirementId === editingId ? { ...req, content: editText } : req
        )
      );
      setEditingId(null);
      setEditText("");
    }
  };

  const handleReqDelete = async (requirementId: number) => {
    if (selectedWS?.workspaceId) {
      await deleterequirement(selectedWS?.workspaceId, requirementId);
      setRequirements((prev) =>
        prev.filter((req) => req.requirementId !== requirementId)
      );
    }
  };

  const handleCompleteReq = async () => {
    if (
      requirements.filter((rq) => rq.requirementType === "FUNCTIONAL")
        .length === 0 ||
      requirements.filter((rq) => rq.requirementType === "PERFORMANCE")
        .length === 0
    ) {
      setNoRequire(true);
      return;
    }
    stopPolling();
    if (!selectedWS) return;

    if (selectedWS.progressStep === "1") {
      setNextPageLoading(true);
      try {
        //프로젝트 정보 생성해주는 api
        const setrequirements: setrequire[] = requirements.map(
          ({ requirementType, content }) => ({
            requirementType,
            content,
          })
        );
        await postProjectAI(selectedWS.workspaceId, setrequirements);

        const updatedWorkspace: workspace = {
          ...selectedWS, // 기존 값 유지
          progressStep: "2",
        };

        dispatch(setSelectedWS(updatedWorkspace));
        navigate(`/ws/${selectedWS?.workspaceId}/${getStepIdFromNumber("2")}`);
      } catch (err) {
        setIsFailed(true);
      } finally {
        setNextPageLoading(false);
      }
    }
    setRequireDone(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleEditSubmit();
    }
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

  const renderList = (type: "FUNCTIONAL" | "PERFORMANCE") => {
    return (
      <ul>
        {requirements
          .filter((r) => r.requirementType === type)
          .map((req) => (
            <div
              className="require-list"
              key={req.requirementId}
              onClick={() => {
                {
                  !requireDone && CanEdit && handleEditClick(req);
                }
              }}
              style={{ cursor: "pointer" }}
            >
              <div className="editors-container">
                <div className="editors">
                  {renderEditor(
                    getUserEditingField(type, req.requirementId.toString())
                  )}
                </div>
                <li>
                  {editingId === req.requirementId ? (
                    <input
                      type="text"
                      value={editText}
                      autoFocus
                      onChange={(e) => setEditText(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onFocus={() => {
                        startEditing(type, req.requirementId.toString());
                      }}
                      onBlur={() => {
                        handleEditSubmit();
                        stopEditing(type, req.requirementId.toString());
                      }}
                      onKeyDown={handleKeyDown}
                    />
                  ) : (
                    <>
                      <span className="reqtext">{req.content}</span>
                      {!requireDone && CanEdit && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="20px"
                          viewBox="0 -960 960 960"
                          width="20px"
                          fill="#EA3323"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReqDelete(req.requirementId);
                          }}
                        >
                          <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                        </svg>
                      )}
                    </>
                  )}
                </li>
              </div>
            </div>
          ))}
      </ul>
    );
  };

  const airenderList = (type: "FUNCTIONAL" | "PERFORMANCE") => {
    return (
      <ul>
        {aiRequirements
          .filter((ai) => ai.requirementType === type)
          .map((ai, index) => (
            <div className="airequire-list" key={index}>
              <li>
                <div className="airequire-wrapper">
                  <span className="airequire-text">✨{ai.content}</span>
                  <span className="airequire-actions">
                    <button
                      className="airequire-accept-btn"
                      onClick={() => CanEdit && handleAiAccept(ai)}
                    >
                      완료
                    </button>
                    <button
                      className="airequire-cancel-btn"
                      onClick={() => CanEdit && handleAiCancel(ai)}
                    >
                      취소
                    </button>
                  </span>
                </div>
              </li>
            </div>
          ))}
      </ul>
    );
  };
  return nextPageloading ? (
    <Loading />
  ) : (
    <>
      <WSHeader title="요구사항 명세서" />
      <div className="require-container">
        {selectedWS?.progressStep === "1" &&
          CanEdit &&
          (loading ? (
            <div className="airequire-title wave-text">
              {"✨ AI 추천 중이에요".split("").map((char, idx) => (
                <span key={idx} style={{ animationDelay: `${idx * 0.05}s` }}>
                  {char}
                </span>
              ))}
            </div>
          ) : (
            <div className="require-title">
              <p>✨기능·성능 요구사항 3개 이상 입력하면 AI 추천이 가능해요</p>
              <div className="require-aibtn" onClick={handleAiRequirements}>
                AI 추천받기
              </div>
            </div>
          ))}
        <div className="require-content">
          <div className="require-content-box ">
            <div className="require-content-title">
              <p>기능 요구사항</p>
            </div>
            <div className="require-lists">
              {renderList("FUNCTIONAL")}
              {airenderList("FUNCTIONAL")}
              {!requireDone && CanEdit && (
                <button
                  className="require-add-button"
                  onClick={() => handleAddFunction("")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#FFFFFF"
                  >
                    <path d="M444-444H240v-72h204v-204h72v204h204v72H516v204h-72v-204Z" />
                  </svg>
                  <p>요구사항 추가</p>
                </button>
              )}
            </div>
          </div>
          <div className="require-content-box ">
            <div className="require-content-title">
              <p>성능 요구사항</p>
            </div>
            <div className="require-lists">
              {renderList("PERFORMANCE")}
              {airenderList("PERFORMANCE")}
              {!requireDone && CanEdit && (
                <button
                  className="require-add-button"
                  onClick={() => handleAddPerformance("")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#FFFFFF"
                  >
                    <path d="M444-444H240v-72h204v-204h72v204h204v72H516v204h-72v-204Z" />
                  </svg>
                  <p>요구사항 추가</p>
                </button>
              )}
            </div>
          </div>
        </div>
        {CanEdit && (
          <div className="require-btn">
            {requireDone ? (
              <p
                onClick={() => {
                  setRequireDone(false);
                  startPolling();
                }}
              >
                수정하기
              </p>
            ) : (
              <p onClick={handleCompleteReq}>저장하기</p>
            )}

            {selectedWS?.progressStep === "1" && (
              <div className="require-info-container">
                <div className="require-info">?</div>
                <div className="require-tooltip">
                  저장한 후에는 ai추천받기 기능이 비활성화됩니다
                </div>
              </div>
            )}
          </div>
        )}
        {openAIModal && (
          <BasicModal
            modalTitle="AI추천이 불가능합니다"
            modalDescription="기능·성능 요구사항이 최소 3개는 필요합니다"
            Close={() => setOpenAIModal(false)}
          />
        )}
      </div>
      {alreadyEdit && (
        <BasicModal
          modalTitle="수정이 불가능합니다"
          modalDescription="다른 사용자가 수정 중입니다"
          Close={() => setAlreadyEdit(false)}
        />
      )}
      {isFailed && (
        <BasicModal
          modalTitle="요청을 처리할 수 없습니다"
          modalDescription="요청 중 오류가 발생했습니다 새로고침 후 다시 시도해주세요"
          Close={() => setIsFailed(false)}
        />
      )}
      {noRequire && (
        <BasicModal
          modalTitle="저장할 수 없습니다"
          modalDescription="기능·성능 요구사항이 최소 1개 이상 있어야 합니다"
          Close={() => setNoRequire(false)}
        />
      )}
      {error && (
        <BasicModal
          modalTitle={error}
          modalDescription={
            "일시적인 오류가 발생했습니다 페이지를 새로고침하거나 잠시 후 다시 시도해 주세요"
          }
          Close={() => setError("")}
        ></BasicModal>
      )}
    </>
  );
}
