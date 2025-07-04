import React, { useState, useEffect } from "react"; // React.Fragment 사용을 위해 React import
import { setSelectedWS } from "../../../store/workspaceSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { useNavigate } from "react-router-dom";
import { getStepIdFromNumber } from "../../../utils/projectSteps";
import Loading from "../../loadingpage/Loading";
import "./ApiPage.css";
import plusIcon from "../../../assets/img/plus.png";
import minusIcon from "../../../assets/img/minus.png";
import pencilIcon from "../../../assets/img/pencil.png";
import { WSHeader } from "../../../components/header/WSHeader";
import type {
  RequestField,
  ResponseSpec,
  BackendApiSpec,
  CreateApiRequest,
} from "../../../types/api";

import {
  createApi,
  updateApi,
  deleteApi,
  getApisByWorkspace,
} from "../../../services/apiApi";
import { postAiList } from "../../../services/listapi/listApi";

import { useEditLock } from "../../../hooks/useEditLock";
import type { LockedUser } from "../../../types/edit";
import { BasicModal } from "../../../components/modal/BasicModal";
import { ErrorPage } from "../../../error/ErrorPage";

// --- (타입 정의 및 변환 함수들은 기존과 동일) ---
type ApiSpecification = {
  id: number;
  isNew?: boolean;
  title: string;
  tag: string;
  path: string;
  http_method: string;
  request: RequestField[];
  response: ResponseSpec[];
};

const mapBackendToFrontend = (data: BackendApiSpec[]): ApiSpecification[] => {
  return data.map((item) => ({
    id: item.apiId,
    title: item.title,
    tag: item.tag,
    path: item.path,
    http_method: item.httpMethod,
    request: item.request,
    response: item.response.map((res) => ({
      status_code: res.statusCode,
      message: res.message,
      data: res.data,
    })),
  }));
};

const mapFrontendToBackend = (
  data: ApiSpecification
): CreateApiRequest & { title: string } => {
  return {
    title: data.title,
    tag: data.tag,
    path: data.path,
    httpMethod: data.http_method, // http_method -> httpMethod
    request: data.request,
    response: data.response.map((res) => ({
      statusCode: res.status_code, // status_code -> statusCode
      message: res.message,
      data: res.data,
    })),
  };
};

const ApiPage = () => {
  //const [isEditMode, setIsEditMode] = useState(false);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [openRowId, setOpenRowId] = useState<number | null>(null);
  const [apiDone, setApiDone] = useState<boolean>(true);

  const [rows, setRows] = useState<ApiSpecification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedWS = useSelector(
    (state: RootState) => state.workspace.selectedWS
  );
  const Role = useSelector((state: RootState) => state.user.userRole);
  const CanEdit: boolean = Role === "OWNER" || Role === "MEMBER";

  const wsid = selectedWS?.workspaceId;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isFailed, setIsFailed] = useState<boolean>(false);

  const {
    getUserEditingField,
    startPolling,
    stopPolling,
    startEditing,
    stopEditing,
    setAlreadyEdit,
    alreadyEdit,
  } = useEditLock("apis");

  // 기본 필드 변경 핸들러
  const handleChange = (
    id: number,
    field: keyof ApiSpecification,
    value: string
  ) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  // Request 필드 변경 핸들러
  const handleRequestChange = (
    id: number,
    index: number,
    field: keyof RequestField,
    value: string
  ) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id
          ? {
              ...row,
              request: row.request.map((req, i) =>
                i === index ? { ...req, [field]: value } : req
              ),
            }
          : row
      )
    );
  };

  // Response 필드 변경 핸들러
  const handleResponseChange = (
    id: number,
    index: number,
    field: keyof ResponseSpec,
    value: string | any[]
  ) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id
          ? {
              ...row,
              response: row.response.map((res, i) =>
                i === index ? { ...res, [field]: value } : res
              ),
            }
          : row
      )
    );
  };

  // Request 항목 추가
  const addRequestField = (id: number) => {
    console.log("addRequestField 호출됨, id:", id); // 디버깅용

    setRows((prevRows) => {
      console.log("현재 rows:", prevRows); // 디버깅용

      const updatedRows = prevRows.map((row) => {
        if (row.id === id) {
          const newRequest: RequestField = {
            field: "",
            type: "",
            example: "",
          };

          return {
            ...row,
            request: [...row.request, newRequest],
          };
        }
        return row;
      });

      return updatedRows;
    });
  };

  // Request 항목 삭제
  const removeRequestField = (id: number, index: number) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id
          ? {
              ...row,
              request: row.request.filter((_, i) => i !== index),
            }
          : row
      )
    );
  };

  // Response 항목 추가
  const addResponseField = (id: number) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id
          ? {
              ...row,
              response: [
                ...row.response,
                { status_code: "200", message: "", data: [] },
              ],
            }
          : row
      )
    );
  };

  // Response 항목 삭제
  const removeResponseField = (id: number, index: number) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id
          ? {
              ...row,
              response: row.response.filter((_, i) => i !== index),
            }
          : row
      )
    );
  };

  // Data 필드 변경 핸들러 (JSON 형태)
  const handleDataChange = (
    id: number,
    responseIndex: number,
    value: string
  ) => {
    try {
      const parsedData = JSON.parse(value);
      handleResponseChange(id, responseIndex, "data", parsedData);
    } catch (error) {
      // JSON이 유효하지 않으면 그대로 문자열로 저장
      handleResponseChange(id, responseIndex, "data", value);
    }
  };

  //페이지 로드 시 API 목록을 불러오는 함수
  useEffect(() => {
    if (selectedWS?.progressStep === "4") {
      setApiDone(false);
      startPolling();
    }
    // API를 불러오는 비동기 함수 정의
    const fetchApis = async (workspaceId: number) => {
      // workspaceId가 없으면 API를 호출하지 않음
      if (!workspaceId) {
        setIsLoading(false);
        setError("404");
        return;
      }
      try {
        setIsLoading(true);
        setError(null);

        const backendData = await getApisByWorkspace(workspaceId);

        // 백엔드 데이터를 프론트엔드 형식으로 변환
        const frontendData = mapBackendToFrontend(backendData);

        // 상태 업데이트
        setRows(frontendData);
      } catch (err) {
        setIsFailed(true);
        setError("페이지를 불러오는 데 실패했습니다");
        // 실패 시 빈 배열로 설정하여 테이블이 비도록 함
        setRows([]);
      } finally {
        // 로딩 상태 종료
        setIsLoading(false);
      }
    };

    fetchApis(wsid ?? 0);
  }, [wsid]); // workspaceId가 변경될 때마다 다시 호출

  if (isLoading) {
    return (
      <div>
        <WSHeader title="API 명세서" />
        <div className="api-main">
          <p>API 목록을 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  if (error === "404") {
    return <ErrorPage code={404} message="페이지를 찾을 수 없습니다" />;
  }

  // + 버튼 클릭 시 호출되는 함수
  const handleAddRow = async (workspaceId: number) => {
    if (!workspaceId) {
      return;
    }

    const defaultApiData: CreateApiRequest = {
      tag: "새 태그",
      path: "/new-path",
      httpMethod: "GET",
      request: [],
      response: [
        {
          statusCode: "200",
          message: "성공했습니다.",
          data: [],
        },
      ],
    };

    try {
      const createdApi = await createApi(workspaceId, defaultApiData);

      // 백엔드 응답에 title이 없을 경우를 대비해 기본값을 설정
      const fullBackendSpec: BackendApiSpec = {
        ...createdApi,
        title: createdApi.title || "새로운 API", // 응답에 title이 있으면 사용, 없으면 기본값
      };

      //4.성공 응답을 프론트엔드 상태 형식으로 변환
      const newApiRow = mapBackendToFrontend([fullBackendSpec])[0];

      // 5.상태를 업데이트하여 화면에 새로운 행을 추가
      setRows((prevRows) => [...prevRows, newApiRow]);

      //6.
      setOpenRowId(newApiRow.id);
    } catch (error) {
      console.error("API 생성 실패:", error);
      setIsFailed(true);
    }
  };

  // ... 기타 핸들러 함수들
  const handleDeleteRow = async (workspaceId: number, apiId: number) => {
    // 워크스페이스 ID 확인
    if (!workspaceId) {
      return;
    }

    try {
      // 서버에 삭제 요청 보내기
      await deleteApi(workspaceId, apiId);

      // 요청 성공 시, 프론트엔드 상태에서도 해당 행 제거
      setRows((prevRows) => prevRows.filter((row) => row.id !== apiId));
    } catch (error) {
      console.error("API 삭제 실패:", error);
      setIsFailed(true);
    }
  };

  //개별 행 수정 핸들러
  const handleEdit = (row: ApiSpecification) => {
    setOpenRowId(row.id); // 수정 시작 시 아코디언 열기 (request/response 편집을 위해)
    setEditingRowId(row.id);
    //setOriginalRow({ ...row });
  };

  const handleSave = async (workspaceId: number, apiId: number) => {
    console.log("handleSave - apiId:", apiId);
    console.log(
      "handleSave - workspaceId (before check):",
      workspaceId,
      "Type:",
      typeof workspaceId
    );
    if (!workspaceId) return;

    const rowToSave = rows.find((row) => row.id === apiId);
    if (!rowToSave) {
      console.error(`저장할 행을 찾지 못했습니다. apiId: ${apiId}`);
      return;
    }

    // 프론트엔드 상태를 백엔드 요청 형식으로 변환
    const requestBody = mapFrontendToBackend(rowToSave);

    try {
      // API 서비스를 호출하여 데이터 수정
      const updatedApiFromBackend = await updateApi(
        workspaceId,
        apiId,
        requestBody
      );

      // 서버로부터 받은 최신 데이터로 프론트 상태를 업데이트
      const updatedRow = mapBackendToFrontend([updatedApiFromBackend])[0];
      setRows((prevRows) =>
        prevRows.map((row) => (row.id === apiId ? updatedRow : row))
      );

      setEditingRowId(null); // 수정 모드 종료
      setOpenRowId(null); // 아코디언 닫기
    } catch (error) {
      console.error("API 수정 실패:", error);
      setIsFailed(true);
    }
  };

  const toggleAccordion = (id: number) => {
    setOpenRowId(openRowId === id ? null : id);
  };

  const handleApiComplete = async () => {
    stopPolling();
    if (selectedWS?.progressStep === "4") {
      try {
        setIsAiLoading(true);
        const response = await postAiList(selectedWS.workspaceId);
        console.log("프로젝트 진행 ai추천 성공", response.data);

        dispatch(
          setSelectedWS({
            ...selectedWS,
            progressStep: "5",
          })
        );
        navigate(`/ws/${selectedWS?.workspaceId}/${getStepIdFromNumber("5")}`);
      } catch {
        setIsFailed(true);
      } finally {
        setIsAiLoading(false);
      }
    }
    setApiDone(true);
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

  return !isAiLoading ? (
    <div>
      <WSHeader title="API 명세서" />
      <div className="api-main">
        <div className="api-header">
          <div className="api-alert">
            ✨아이디어와 명세서를 분석하여 API 추천을 해드려요
          </div>
        </div>

        <div className="api-content">
          <table className="api-table">
            <thead>
              <tr>
                <th className="api-table-title no-border"></th>
                <th className="api-table-title">API명</th>
                <th className="api-table-title">태그</th>
                <th className="api-table-title">http 매서드</th>
                <th className="api-table-title">api 경로</th>
                <th className="api-table-title no-border"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                // +++ 현재 행이 수정 중인지 확인하는 변수 +++
                const isEditing = editingRowId === row.id;

                return (
                  <React.Fragment key={row.id}>
                    <tr
                      onClick={() => toggleAccordion(row.id)}
                      className="api-table-row"
                    >
                      {/* +++ '작업' 열의 셀 추가 +++ */}
                      <td className="api-table-content no-border">
                        {isEditing ? (
                          <div className="edit-controls">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                stopEditing(null, row.id.toString());
                                if (selectedWS && selectedWS.workspaceId) {
                                  handleSave(selectedWS.workspaceId, row.id);
                                } else {
                                  console.error(
                                    "저장 시 workspaceId를 찾을 수 없습니다."
                                  );
                                }
                              }}
                              className="finish-button"
                            >
                              저장
                            </button>
                          </div>
                        ) : (
                          !apiDone &&
                          CanEdit && (
                            <>
                              <div className="api-editors">
                                {renderEditor(
                                  getUserEditingField("projectName", null)
                                )}
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(row);
                                  startEditing(null, row.id.toString());
                                }}
                                className="edit-button"
                              >
                                <img
                                  src={pencilIcon}
                                  alt="수정"
                                  className="edit-image"
                                />
                              </button>
                            </>
                          )
                        )}
                      </td>

                      {(["title", "tag", "http_method", "path"] as const).map(
                        (field) => (
                          <td
                            className={`api-table-content ${
                              field === "path" ? "api-path-cell" : ""
                            }`}
                            key={field}
                          >
                            {/* --- isEditMode를 isEditing으로 변경 --- */}
                            {isEditing ? (
                              <input
                                type="text"
                                value={row[field]}
                                onChange={(e) =>
                                  handleChange(row.id, field, e.target.value)
                                }
                                // 행 클릭(아코디언 토글) 이벤트가 발생하지 않도록 전파 중지
                                onClick={(e) => e.stopPropagation()}
                                className="api-edit-input"
                              />
                            ) : (
                              row[field]
                            )}
                          </td>
                        )
                      )}
                      <td className="api-table-content no-border">
                        {/* --- 삭제 버튼도 수정 중에만 보이도록 isEditing으로 변경 --- */}
                        {isEditing && (
                          <button
                            className="api-delete-row-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              // handleSave와 동일한 패턴으로 수정
                              if (selectedWS && selectedWS.workspaceId) {
                                handleDeleteRow(selectedWS.workspaceId, row.id);
                              } else {
                                console.error(
                                  "삭제 시 workspaceId를 찾을 수 없습니다."
                                );
                                alert(
                                  "워크스페이스 정보가 없어 삭제할 수 없습니다. 페이지를 새로고침 해주세요."
                                );
                              }
                            }}
                          >
                            <img src={minusIcon} alt="삭제" />
                          </button>
                        )}
                      </td>
                    </tr>
                    {/* --- 아코디언 내용 표시 --- */}
                    {openRowId === row.id && (
                      <tr className="accordion-content">
                        <td className="api-table-content no-border"></td>
                        <td colSpan={4} className="api-accordion-cell">
                          <td className="api-table-content no-border"></td>
                          <div className="accordion-box-wrapper">
                            {/* Request 섹션 */}
                            <div className="accordion-box">
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  marginBottom: "10px",
                                }}
                              >
                                <strong>Request</strong>
                                {isEditing && (
                                  <button
                                    onClick={() => addRequestField(row.id)}
                                    className="add-field-button"
                                    style={{
                                      background: "#4CAF50",
                                      color: "white",
                                      border: "none",
                                      padding: "5px 10px",
                                      borderRadius: "3px",
                                      cursor: "pointer",
                                      fontSize: "12px",
                                    }}
                                  >
                                    + 필드 추가
                                  </button>
                                )}
                              </div>

                              {isEditing ? (
                                <div>
                                  {row.request.map((req, index) => (
                                    <div
                                      key={index}
                                      style={{
                                        marginBottom: "10px",
                                        padding: "10px",
                                        border: "none", //테두리 제거
                                        borderRadius: "4px",
                                      }}
                                    >
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          alignItems: "center",
                                          marginBottom: "5px",
                                        }}
                                      >
                                        <span
                                          style={{
                                            fontWeight: "bold",
                                            fontSize: "14px",
                                          }}
                                        ></span>
                                        <button
                                          onClick={() =>
                                            removeRequestField(row.id, index)
                                          }
                                          style={{
                                            background: "#f44336",
                                            color: "white",
                                            border: "none",
                                            padding: "2px 6px",
                                            borderRadius: "3px",
                                            cursor: "pointer",
                                            fontSize: "12px",
                                          }}
                                        >
                                          삭제
                                        </button>
                                      </div>
                                      <div
                                        style={{
                                          display: "grid",
                                          gridTemplateColumns: "1fr 1fr 2fr",
                                          gap: "10px",
                                        }}
                                      >
                                        <div>
                                          <label
                                            style={{
                                              display: "block",
                                              fontSize: "12px",
                                              marginBottom: "3px",
                                            }}
                                          >
                                            field:
                                          </label>
                                          <input
                                            type="text"
                                            value={req.field || ""}
                                            onChange={(e) =>
                                              handleRequestChange(
                                                row.id,
                                                index,
                                                "field",
                                                e.target.value
                                              )
                                            }
                                            style={{
                                              width: "100%",
                                              padding: "4px",
                                              fontSize: "15px",
                                              border: "1px solid #ccc",
                                              borderRadius: "3px",
                                            }}
                                          />
                                        </div>
                                        <div>
                                          <label
                                            style={{
                                              display: "block",
                                              fontSize: "12px",
                                              marginBottom: "3px",
                                            }}
                                          >
                                            type:
                                          </label>
                                          <input
                                            type="text"
                                            value={req.type || ""}
                                            onChange={(e) =>
                                              handleRequestChange(
                                                row.id,
                                                index,
                                                "type",
                                                e.target.value
                                              )
                                            }
                                            style={{
                                              width: "100%",
                                              padding: "4px",
                                              fontSize: "15px",
                                              border: "1px solid #ccc",
                                              borderRadius: "3px",
                                            }}
                                          />
                                        </div>
                                        <div>
                                          <label
                                            style={{
                                              display: "block",
                                              fontSize: "12px",
                                              marginBottom: "3px",
                                            }}
                                          >
                                            example:
                                          </label>
                                          <input
                                            type="text"
                                            value={req.example || ""}
                                            onChange={(e) =>
                                              handleRequestChange(
                                                row.id,
                                                index,
                                                "example",
                                                e.target.value
                                              )
                                            }
                                            style={{
                                              width: "100%",
                                              padding: "4px",
                                              fontSize: "15px",
                                              border: "1px solid #ccc",
                                              borderRadius: "3px",
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <pre
                                  style={{
                                    whiteSpace: "pre-wrap",
                                    wordBreak: "break-all",
                                    fontSize: "18px",
                                    maxHeight: "200px",
                                    overflow: "auto",
                                    minWidth: "100px",
                                  }}
                                >
                                  {JSON.stringify(row.request, null)}
                                </pre>
                              )}
                            </div>

                            {/* Response 섹션 */}
                            <div className="accordion-box accordion-two-box">
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  marginBottom: "10px",
                                }}
                              >
                                <strong>Response</strong>
                                {isEditing && (
                                  <button
                                    onClick={() => addResponseField(row.id)}
                                    className="add-field-button"
                                    style={{
                                      background: "#4CAF50",
                                      color: "white",
                                      border: "none",
                                      padding: "5px 10px",
                                      borderRadius: "3px",
                                      cursor: "pointer",
                                      fontSize: "12px",
                                    }}
                                  >
                                    + 필드 추가
                                  </button>
                                )}
                              </div>

                              {isEditing ? (
                                <div>
                                  {row.response.map((res, index) => (
                                    <div
                                      key={index}
                                      style={{
                                        marginBottom: "10px",
                                        padding: "10px",
                                        border: "none",
                                        borderRadius: "4px",
                                      }}
                                    >
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          alignItems: "center",
                                          marginBottom: "5px",
                                        }}
                                      >
                                        <span
                                          style={{
                                            fontWeight: "bold",
                                            fontSize: "14px",
                                          }}
                                        ></span>
                                        <button
                                          onClick={() =>
                                            removeResponseField(row.id, index)
                                          }
                                          style={{
                                            background: "#f44336",
                                            color: "white",
                                            border: "none",
                                            padding: "2px 6px",
                                            borderRadius: "3px",
                                            cursor: "pointer",
                                            fontSize: "12px",
                                          }}
                                        >
                                          삭제
                                        </button>
                                      </div>
                                      <div
                                        className="response-grid"
                                        style={{
                                          display: "grid",
                                          gridTemplateColumns: "1fr 1fr",
                                          gap: "10px",
                                          marginBottom: "10px",
                                          width: "100%",
                                          boxSizing: "border-box",
                                        }}
                                      >
                                        <div>
                                          <label
                                            style={{
                                              display: "block",
                                              fontSize: "12px",
                                              marginBottom: "5px",
                                            }}
                                          >
                                            Status Code:
                                          </label>
                                          <input
                                            type="text"
                                            value={res.status_code || ""}
                                            onChange={(e) =>
                                              handleResponseChange(
                                                row.id,
                                                index,
                                                "status_code",
                                                e.target.value
                                              )
                                            }
                                            style={{
                                              width: "100%",
                                              padding: "4.5px",
                                              margin: "0px",
                                              fontSize: "15px",
                                              border: "1px solid #ccc",
                                              borderRadius: "3px",
                                              boxSizing: "border-box",
                                            }}
                                          />
                                        </div>
                                        <div>
                                          <label
                                            style={{
                                              display: "block",
                                              fontSize: "12px",
                                              marginBottom: "5px",
                                            }}
                                          >
                                            Message:
                                          </label>
                                          <input
                                            type="text"
                                            value={res.message || ""}
                                            onChange={(e) =>
                                              handleResponseChange(
                                                row.id,
                                                index,
                                                "message",
                                                e.target.value
                                              )
                                            }
                                            style={{
                                              width: "100%",
                                              padding: "5px",
                                              margin: "0px",
                                              fontSize: "15px",
                                              border: "1px solid #ccc",
                                              borderRadius: "3px",
                                              boxSizing: "border-box",
                                            }}
                                          />
                                        </div>
                                      </div>
                                      <div>
                                        <label
                                          style={{
                                            display: "block",
                                            fontSize: "12px",
                                            marginBottom: "3px",
                                          }}
                                        >
                                          Data (JSON):
                                        </label>
                                        <textarea
                                          className="api-json-input"
                                          value={
                                            typeof res.data === "string"
                                              ? res.data
                                              : JSON.stringify(
                                                  res.data,
                                                  null,
                                                  2
                                                )
                                          }
                                          onChange={(e) =>
                                            handleDataChange(
                                              row.id,
                                              index,
                                              e.target.value
                                            )
                                          }
                                          placeholder="JSON 형식으로 입력하세요"
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <pre className="api-response-pre">
                                  {JSON.stringify(row.response, null)}
                                </pre>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>

          <div className="api-button-group">
            <button
              className="api-add-button"
              onClick={() => handleAddRow(selectedWS?.workspaceId ?? 0)}
            >
              <img src={plusIcon} alt="plusIcon" />
            </button>
          </div>

          {CanEdit && apiDone ? (
            <div className="api-complete-button">
              <button
                className="api-complete-btn"
                onClick={() => {
                  setApiDone(false);
                  startPolling();
                }}
                disabled={!selectedWS}
              >
                수정하기
              </button>
            </div>
          ) : (
            <div className="api-complete-button">
              <button
                className="api-complete-btn"
                onClick={() => handleApiComplete()}
                disabled={!selectedWS}
              >
                완료하기
              </button>
            </div>
          )}
        </div>
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
      {error && (
        <BasicModal
          modalTitle={error}
          modalDescription={
            "일시적인 오류가 발생했습니다 페이지를 새로고침하거나 잠시 후 다시 시도해 주세요"
          }
          Close={() => setError("")}
        ></BasicModal>
      )}
    </div>
  ) : (
    // 나중에 여기에 로딩가이드페이지 추가하면 됨
    <Loading />
  );
};

export default ApiPage;
