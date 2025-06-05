import "./ListTable.css";
import {
  featureCategories,
  features,
  actions,
} from "../../../../constants/listconstant";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import { useEffect, useMemo, useState } from "react";
import type { feature_category, feature, action } from "../../../../types/list";
import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import DateSelectCell from "../../../../components/cells/DateSelectCell";
import { ActionStatusCell } from "../../../../components/cells/ActionStatusCell";
import { FeatureProgressCell } from "../../../../components/cells/FeatureProgessCell";
import { ImportanceCell } from "../../../../components/cells/ImportantCell";
import { ParticipantsCell } from "../../../../components/cells/ParticipantsCell";
import { useNavigate } from "react-router-dom";

export default function ListTable() {
  const [categoryList, setCategoryList] = useState<feature_category[]>([]);
  const [clickCg, setClickCg] = useState<{ [key: number]: boolean }>({});
  const [clickFt, setClickFt] = useState<{ [key: number]: boolean }>({});
  const [name, setName] = useState<string>("");
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null
  );
  const [editingFeatureId, setEditingFeatureId] = useState<number | null>(null);
  const [editingActionId, setEditingActionId] = useState<number | null>(null);
  const [featuresByCategoryId, setFeaturesByCategoryId] = useState<
    Map<number, feature[]>
  >(new Map());
  const [actionsByFeatureId, setActionsByFeatureId] = useState<
    Map<number, action[]>
  >(new Map());
  const [startDates, setStartDates] = useState<{ [key: number]: Date | null }>(
    {}
  );
  const [endDates, setEndDates] = useState<{ [key: number]: Date | null }>({});
  const [testCheckCg, setTestCheckCg] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [testCheckFt, setTestCheckFt] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [testCheckAc, setTestCheckAc] = useState<{ [key: number]: boolean }>(
    {}
  );

  const selectedWS = useSelector(
    (state: RootState) => state.workspace.selectedWS
  );

  useEffect(() => {
    const category = featureCategories
      .filter((cg) => cg.workspace_id === selectedWS?.workspace_id)
      .sort((a, b) => Number(a.state) - Number(b.state));

    const cgCheck: { [key: number]: boolean } = {};
    category.forEach((cg) => {
      cgCheck[cg.feature_category_id] = cg.has_test;
    });
    setTestCheckCg(cgCheck);

    setCategoryList(category);
    setClickCg({});
    setClickFt({});
  }, [selectedWS]);

  useEffect(() => {
    if (categoryList.length === 0) return;

    const featureMap = new Map<number, feature[]>();

    features
      .filter((ft) =>
        categoryList.some((cg) => cg.feature_category_id === ft.category_id)
      )
      .forEach((ft) => {
        if (!featureMap.has(ft.category_id)) {
          featureMap.set(ft.category_id, []);
        }
        featureMap.get(ft.category_id)!.push(ft);
      });

    setFeaturesByCategoryId(featureMap);
  }, [categoryList]);

  useEffect(() => {
    const allFeatures = Array.from(featuresByCategoryId.values()).flat();
    if (allFeatures.length === 0) return;

    const actionMap = new Map<number, action[]>();
    const startDateMap: { [key: number]: Date | null } = {};
    const endDateMap: { [key: number]: Date | null } = {};

    actions
      .filter((ac) => allFeatures.some((ft) => ft.feature_id === ac.feature_id))
      .forEach((ac) => {
        if (!actionMap.has(ac.feature_id)) {
          actionMap.set(ac.feature_id, []);
        }
        actionMap.get(ac.feature_id)!.push(ac);

        // ✅ 액션 내 포함된 날짜값을 그대로 초기값으로 설정
        startDateMap[ac.action_id] = ac.start_date
          ? new Date(ac.start_date)
          : null;
        endDateMap[ac.action_id] = ac.end_date ? new Date(ac.end_date) : null;
      });

    setActionsByFeatureId(actionMap);
    setStartDates(startDateMap);
    setEndDates(endDateMap);
  }, [featuresByCategoryId]);

  //has_test 초기화
  useEffect(() => {
    const cgCheck: { [key: number]: boolean } = {};
    categoryList.forEach((cg) => {
      cgCheck[cg.feature_category_id] = cg.has_test;
    });
    setTestCheckCg(cgCheck);
  }, [categoryList]);

  useEffect(() => {
    const ftCheck: { [key: number]: boolean } = {};
    features.forEach((ft) => {
      ftCheck[ft.feature_id] = ft.has_test;
    });
    setTestCheckFt(ftCheck);
  }, [features]);

  useEffect(() => {
    const acCheck: { [key: number]: boolean } = {};
    actions.forEach((ac) => {
      acCheck[ac.action_id] = ac.has_test;
    });
    setTestCheckAc(acCheck);
  }, [actions]);

  const categoryCompletableMap = useMemo(() => {
    const result: { [key: number]: boolean } = {};
    for (const cg of categoryList) {
      const children = featuresByCategoryId.get(cg.feature_category_id) || [];
      result[cg.feature_category_id] = children.every(
        (ft) => ft.state === true
      );
    }
    return result;
  }, [featuresByCategoryId, categoryList]);

  const handleCompleteClick = (categoryId: number) => {
    const updatedList = categoryList.map((cg) =>
      cg.feature_category_id === categoryId ? { ...cg, state: !cg.state } : cg
    );
    const index = categoryList.findIndex(
      (cg) => cg.feature_category_id === categoryId
    );
    if (index !== -1) {
      //조건에 맞는 요소가 존재할 때
      cgToggleClick(index, true);
    }
    updatedList.sort((a, b) => Number(a.state) - Number(b.state));
    setCategoryList(updatedList);
  };

  const cgToggleClick = (index: number, close?: boolean) => {
    setClickCg((prev) => {
      // 클로즈일땐 강제로 false
      const next = close ? false : !prev[index];
      // 닫힐 때 하위 feature 전부 닫기
      if (!next) {
        const categoryId = categoryList[index].feature_category_id;
        const featuresInCategory = featuresByCategoryId.get(categoryId) || [];
        setClickFt((prevFt) => {
          const updatedFt = { ...prevFt };
          featuresInCategory.forEach((ft) => {
            updatedFt[ft.feature_id] = false;
          });
          return updatedFt;
        });
      }
      const updated = { ...prev, [index]: next };
      return updated;
    });
  };

  const ftToggleClick = (id: number) => {
    setClickFt((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  //카테고리 이름 업데이트
  const updateCategoryName = (categoryId: number) => {
    if (name.trim() === "") {
      // 이름이 비어있으면 아무 것도 안 함
      setEditingCategoryId(null);
      return;
    }

    setCategoryList((prev) =>
      prev.map((item) =>
        item.feature_category_id === categoryId
          ? { ...item, name }
          : item
      )
    );
    setEditingCategoryId(null); // 수정 모드 종료
    setName("");
  };

  // 기능 추가
  const handleAddFeature = (categoryId: number) => {
    setFeaturesByCategoryId((prev) => {
      const features = prev.get(categoryId) || [];
      const newFeature: feature = {
        feature_id: 0, // 임시 ID
        name: "",
        category_id: categoryId,
        state: false,
        has_test: false,
        order: 0,
      };
      const updated = [...features, newFeature];
      const newMap = new Map(prev);
      newMap.set(categoryId, updated);
      return newMap;
    });
  };


  // 기능 이름 업데이트
  const updateFeatureName = (
    categoryId: number,
    featureId: number,
    isNew?: boolean
  ) => {
    setFeaturesByCategoryId((prev) => {
      const features = prev.get(categoryId);
      if (!features) return prev;

      const trimmedName = name.trim();
      if (trimmedName === "") {
        // 이름이 비어 있을 경우
        if (isNew) {
          const updated = features.filter((item) => item.feature_id !== featureId);
          const newMap = new Map(prev);
          newMap.set(categoryId, updated);
          return newMap;
        } else {
          return prev; // 기존이면 아무 것도 안 함
        }
      }

      // 이름 수정
      const updated = features.map((item) =>
        item.feature_id === featureId ? { ...item, name: trimmedName } : item
      );
      const newMap = new Map(prev);
      newMap.set(categoryId, updated);
      return newMap;
    });
    setEditingFeatureId(null); // 수정 모드 종료
    setName("");
  };

  // 액션 추가
  const handleAddAction = (featureId: number) => {
    setActionsByFeatureId((prev) => {
      const actions = prev.get(featureId) || [];
      const newAction: action = {
        action_id: 0, // 임시 ID
        name: "",
        status: "NOT_STARTED",
        importance: 0,
        has_test: false,
        order: 0,
        feature_id: featureId,
      };
      const updated = [...actions, newAction];
      const newMap = new Map(prev);
      newMap.set(featureId, updated);
      return newMap;
    });
  };

  // 액션이름 업데이트
  const updateActionName = (
    featureId: number,
    actionId: number,
    isNew?: boolean
  ) => {
    setActionsByFeatureId((prev) => {
      const actions = prev.get(featureId);
      if (!actions) return prev;

      const trimmedName = name.trim();
      if (trimmedName === "") {
        // 이름이 비어 있을 경우
        if (isNew) {
          const updated = actions.filter((item) => item.action_id !== actionId);
          const newMap = new Map(prev);
          newMap.set(featureId, updated);
          return newMap;
        } else {
          return prev; // 기존이면 아무 것도 안 함
        }
      }
      // 아니면 이름만 수정
      const updated = actions.map((item) =>
        item.action_id === actionId ? { ...item, name: name } : item
      );
      const newMap = new Map(prev);
      newMap.set(featureId, updated);
      return newMap;
    });
    setEditingActionId(null); // 수정 모드 종료
    setName("");
  };

  //category 삭제
  const handleDeleteCategory = (categoryId: number) => {
    setCategoryList((prevCategories) => {
      const updated = prevCategories.filter(
        (item) => item.feature_category_id !== categoryId
      );
      return updated;
    });
  };

  //feature 삭제
  const handleDeleteFeature = (categoryId: number, featureId: number) => {
    setFeaturesByCategoryId((prev) => {
      const updated = new Map(prev);
      const features = updated.get(categoryId);
      if (!features) return prev;

      const newFeatures = features.filter((f) => f.feature_id !== featureId);
      updated.set(categoryId, newFeatures);
      return updated;
    });
  };

  //action 삭제
  const handleDeleteAction = (featureId: number, actionId: number) => {
    setActionsByFeatureId((prev) => {
      const updated = new Map(prev);
      const action = updated.get(featureId);
      if (!action) return prev;

      const newActions = action.filter((a) => a.action_id !== actionId);
      updated.set(featureId, newActions);
      return updated;
    });
  };

  const navigate = useNavigate();

  return (
    <div>
      <table className="feature-table">
        <thead>
          <tr>
            <th>이름</th>
            <th>시작일</th>
            <th>마감일</th>
            <th>참여자</th>
            <th>상태</th>
            <th>중요도</th>
            <th>테스트 여부</th>
          </tr>
        </thead>
        <tbody>
          {categoryList.map((cg, index) => {
            const isCompleted = cg.state;

            const categoryFeatures =
              featuresByCategoryId.get(cg.feature_category_id) || [];

            return (
              <React.Fragment key={cg.feature_category_id}>
                {/* 카테고리 행 */}
                <tr className={`cg-row ${isCompleted ? "completed" : ""}`}>
                  <td className="list-name">
                    <div className="cglist-name">
                      {editingCategoryId === cg.feature_category_id ? (
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              (e.target as HTMLInputElement).blur(); // 엔터치면 blur로 확정
                            }
                          }}
                          onBlur={() => updateCategoryName(cg.feature_category_id)}
                          autoFocus
                        />
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="20px"
                            viewBox="0 -960 960 960"
                            width="20px"
                            fill="#000"
                            onClick={() => cgToggleClick(index)}
                            style={{ cursor: "pointer" }}
                          >
                            <path
                              d={
                                clickCg[index]
                                  ? "M480-333 240-573l51-51 189 189 189-189 51 51-240 240Z" // ▼
                                  : "M522-480 333-669l51-51 240 240-240 240-51-51 189-189Z" // ▶
                              }
                            />
                          </svg>
                          <svg
                            className="cglist-icon"
                            xmlns="http://www.w3.org/2000/svg"
                            height="20px"
                            viewBox="0 -960 960 960"
                            width="20px"
                            fill="#FFFFFF"
                          >
                            <path d="M48-144v-72h864v72H48Zm120-120q-29.7 0-50.85-21.15Q96-306.3 96-336v-408q0-29.7 21.15-50.85Q138.3-816 168-816h624q29.7 0 50.85 21.15Q864-773.7 864-744v408q0 29.7-21.15 50.85Q821.7-264 792-264H168Zm0-72h624v-408H168v408Zm0 0v-408 408Z" />
                          </svg>
                          <span title={cg.name}>{cg.name}</span>
                          <button className="list-modifybtn"
                            onClick={() => {
                              setName(cg.name);
                              setEditingCategoryId(cg.feature_category_id);
                            }}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="20px"
                              viewBox="0 -960 960 960"
                              width="20px"
                              fill="#FFFFFF"
                            >
                              <path d="M216-216h51l375-375-51-51-375 375v51Zm-72 72v-153l498-498q11-11 23.84-16 12.83-5 27-5 14.16 0 27.16 5t24 16l51 51q11 11 16 24t5 26.54q0 14.45-5.02 27.54T795-642L297-144H144Zm600-549-51-51 51 51Zm-127.95 76.95L591-642l51 51-25.95-25.05Z" />
                            </svg>
                          </button>
                          <div>
                            <button
                              onClick={() =>
                                handleAddFeature(cg.feature_category_id)
                              }
                              className="list-addbtn"
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
                            </button>
                            <button
                              className="list-deletebtn"
                              onClick={() =>
                                handleDeleteCategory(cg.feature_category_id)
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="20px"
                                viewBox="0 -960 960 960"
                                width="20px"
                                fill="#FFFFFF"
                              >
                                <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
                              </svg>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                  <td />
                  <td />
                  <td />
                  <td>
                    <button
                      className={`list-completebtn ${isCompleted ? "completed" : ""
                        }`}
                      disabled={!categoryCompletableMap[cg.feature_category_id]}
                      onClick={() =>
                        handleCompleteClick(cg.feature_category_id)
                      }
                    >
                      완료하기
                    </button>
                  </td>
                  <td />
                  <td>
                    <input
                      type="checkbox"
                      disabled={isCompleted}
                      className="list-checkbox"
                      checked={testCheckCg[cg.feature_category_id] || false}
                      onChange={(e) =>
                        setTestCheckCg((prev) => ({
                          ...prev,
                          [cg.feature_category_id]: e.target.checked,
                        }))
                      }
                    />
                  </td>
                </tr>

                {/* 기능 리스트 */}
                {
                  clickCg[index] &&
                  categoryFeatures.map((ft) => {
                    const featureActions =
                      actionsByFeatureId.get(ft.feature_id) || [];

                    return (
                      <React.Fragment key={ft.feature_id}>
                        <tr
                          className={`ft-row ${isCompleted ? "completed" : ""}`}
                        >
                          <td className="list-name">
                            <div className="ftlist-name">
                              {editingFeatureId === ft.feature_id ? (
                                <input
                                  type="text"
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      (e.target as HTMLInputElement).blur(); // 엔터치면 blur로 확정
                                    }
                                  }}
                                  onBlur={() => {
                                    updateFeatureName(
                                      ft.category_id,
                                      ft.feature_id,
                                    );
                                  }}
                                  autoFocus
                                />) : (
                                <>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="20px"
                                    viewBox="0 -960 960 960"
                                    width="20px"
                                    fill="#000"
                                    onClick={() => ftToggleClick(ft.feature_id)}
                                    style={{ cursor: "pointer" }}
                                  >
                                    <path
                                      d={
                                        clickFt[ft.feature_id]
                                          ? "M480-333 240-573l51-51 189 189 189-189 51 51-240 240Z"
                                          : "M522-480 333-669l51-51 240 240-240 240-51-51 189-189Z"
                                      }
                                    />
                                  </svg>
                                  <svg
                                    className="ftlist-icon"
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="20px"
                                    viewBox="0 -960 960 960"
                                    width="20px"
                                    fill="#FFFFFF"
                                  >
                                    <path d="M168-192q-29 0-50.5-21.5T96-264v-432q0-29.7 21.5-50.85Q139-768 168-768h216l96 96h312q29.7 0 50.85 21.15Q864-629.7 864-600v336q0 29-21.15 50.5T792-192H168Zm0-72h624v-336H450l-96-96H168v432Zm0 0v-432 432Z" />
                                  </svg>
                                  {ft.name === "" ? (
                                    <input
                                      type="text"
                                      value={name}
                                      onChange={(e) => setName(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          (e.target as HTMLInputElement).blur(); // 엔터치면 blur로 확정
                                        }
                                      }}
                                      onBlur={() => {
                                        updateFeatureName(
                                          ft.category_id,
                                          ft.feature_id,
                                          true,
                                        );
                                      }}
                                      autoFocus
                                    />
                                  ) : (
                                    <>
                                      <span title={ft.name}>{ft.name}</span>
                                      <button
                                        className="list-modifybtn"
                                        onClick={() => {
                                          setName(ft.name); // 현재 이름으로 초기화
                                          setEditingFeatureId(ft.feature_id); // 수정 모드 진입
                                        }}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          height="20px"
                                          viewBox="0 -960 960 960"
                                          width="20px"
                                          fill="#FFFFFF"
                                        >
                                          <path d="M216-216h51l375-375-51-51-375 375v51Zm-72 72v-153l498-498q11-11 23.84-16 12.83-5 27-5 14.16 0 27.16 5t24 16l51 51q11 11 16 24t5 26.54q0 14.45-5.02 27.54T795-642L297-144H144Zm600-549-51-51 51 51Zm-127.95 76.95L591-642l51 51-25.95-25.05Z" />
                                        </svg>
                                      </button>
                                      <div>
                                        <button
                                          onClick={() =>
                                            handleAddAction(ft.feature_id)
                                          }
                                          className="list-addbtn"
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
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleDeleteFeature(
                                              ft.category_id,
                                              ft.feature_id
                                            )
                                          }
                                          className="list-deletebtn"
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="20px"
                                            viewBox="0 -960 960 960"
                                            width="20px"
                                            fill="#FFFFFF"
                                          >
                                            <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
                                          </svg>
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                          <td />
                          <td />
                          <td />
                          <td>
                            <FeatureProgressCell actions={featureActions} />
                          </td>
                          <td />
                          <td>
                            <input
                              type="checkbox"
                              disabled={isCompleted}
                              className="list-checkbox"
                              checked={testCheckFt[ft.feature_id] || false}
                              onChange={(e) =>
                                setTestCheckFt((prev) => ({
                                  ...prev,
                                  [ft.feature_id]: e.target.checked,
                                }))
                              }
                            />
                          </td>
                        </tr>

                        {/* 액션 리스트 */}
                        {
                          clickFt[ft.feature_id] &&
                          featureActions.map((ac) => (
                            <tr
                              key={ac.action_id}
                              className={`ac-row ${isCompleted ? "completed" : ""
                                }`}
                            >
                              <td className="list-name">
                                <div className="aclist-name">
                                  {editingActionId === ac.action_id ? (<input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        (e.target as HTMLInputElement).blur(); // 엔터치면 blur로 확정
                                      }
                                    }}
                                    onBlur={() => {
                                      updateActionName(
                                        ac.feature_id,
                                        ac.action_id
                                      );
                                    }}
                                    autoFocus
                                  />) : (
                                    <>
                                      <svg
                                        className="aclist-icon"
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="20px"
                                        viewBox="0 -960 960 960"
                                        width="20px"
                                        fill="#FFF"
                                      >
                                        <path d="M336-240h288v-72H336v72Zm0-144h288v-72H336v72ZM263.72-96Q234-96 213-117.15T192-168v-624q0-29.7 21.15-50.85Q234.3-864 264-864h312l192 192v504q0 29.7-21.16 50.85Q725.68-96 695.96-96H263.72ZM528-624v-168H264v624h432v-456H528ZM264-792v189-189 624-624Z" />
                                      </svg>
                                      {ac.name === "" ? (
                                        <input
                                          type="text"
                                          value={name}
                                          onChange={(e) => setName(e.target.value)}
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                              (e.target as HTMLInputElement).blur(); // 엔터치면 blur로 확정
                                            }
                                          }}
                                          onBlur={() => {
                                            updateActionName(
                                              ac.feature_id,
                                              ac.action_id,
                                              true
                                            );
                                          }}
                                          autoFocus
                                        />
                                      ) : (
                                        <>
                                          <span
                                            title={ac.name}
                                            onClick={() =>
                                              navigate(
                                                `/ws/${cg.workspace_id}/action/${ac.action_id}`
                                              )
                                            }
                                          >
                                            {ac.name}
                                          </span>
                                          <button className="list-modifybtn"
                                            onClick={() => {
                                              setName(ac.name);
                                              setEditingActionId(ac.action_id);
                                            }}>
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              height="20px"
                                              viewBox="0 -960 960 960"
                                              width="20px"
                                              fill="#FFFFFF"
                                            >
                                              <path d="M216-216h51l375-375-51-51-375 375v51Zm-72 72v-153l498-498q11-11 23.84-16 12.83-5 27-5 14.16 0 27.16 5t24 16l51 51q11 11 16 24t5 26.54q0 14.45-5.02 27.54T795-642L297-144H144Zm600-549-51-51 51 51Zm-127.95 76.95L591-642l51 51-25.95-25.05Z" />
                                            </svg>
                                          </button>
                                          <div>
                                            <button
                                              className="list-deletebtn"
                                              onClick={() =>
                                                handleDeleteAction(
                                                  ac.feature_id,
                                                  ac.action_id
                                                )
                                              }
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="20px"
                                                viewBox="0 -960 960 960"
                                                width="20px"
                                                fill="#FFFFFF"
                                              >
                                                <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
                                              </svg>
                                            </button>
                                          </div>
                                        </>
                                      )}
                                    </>
                                  )}
                                </div>
                              </td>
                              <td>
                                <DateSelectCell
                                  value={startDates[ac.action_id] ?? null}
                                  disable={isCompleted}
                                  onChange={(date) => {
                                    if (isCompleted) return;
                                    setStartDates((prev) => ({
                                      ...prev,
                                      [ac.action_id]: date,
                                    }));
                                  }}
                                />
                              </td>
                              <td>
                                <DateSelectCell
                                  value={endDates[ac.action_id] ?? null}
                                  disable={isCompleted}
                                  onChange={(date) => {
                                    if (isCompleted) return;
                                    setEndDates((prev) => ({
                                      ...prev,
                                      [ac.action_id]: date,
                                    }));
                                  }}
                                />
                              </td>
                              <td>
                                {/* 참여자 */}
                                <ParticipantsCell
                                  value={ac.assignee_id}
                                  wsid={cg.workspace_id}
                                  disable={isCompleted}
                                  onChange={(newParti) => {
                                    if (isCompleted) return;
                                    // 상태 업데이트
                                    setActionsByFeatureId((prev) => {
                                      const featureId = ac.feature_id;
                                      const actions = prev.get(featureId);
                                      if (!actions) return prev;

                                      const updatedActions = actions.map(
                                        (item) =>
                                          item.action_id === ac.action_id
                                            ? {
                                              ...item,
                                              assignee_id: [...newParti],
                                            }
                                            : item
                                      );

                                      const newMap = new Map(prev);
                                      newMap.set(featureId, updatedActions);
                                      return newMap;
                                    });
                                  }}
                                />
                              </td>
                              <td>
                                {/* 지금 action상태변화에 따른 feature상태변화 안되는 중임 */}
                                {/* 오류나서 api연결하고 해야할것같음 */}
                                <ActionStatusCell
                                  status={ac.status}
                                  disable={isCompleted}
                                  onChange={(newStatus) => {
                                    if (isCompleted) return;

                                    setActionsByFeatureId((prev) => {
                                      const featureId = ac.feature_id;
                                      const actions = prev.get(featureId);
                                      if (!actions) return prev;

                                      const updatedActions = actions.map(
                                        (item) =>
                                          item.action_id === ac.action_id
                                            ? { ...item, status: newStatus }
                                            : item
                                      );

                                      const newMap = new Map(prev);
                                      newMap.set(featureId, updatedActions);
                                      return newMap;
                                    });
                                  }}
                                />
                              </td>
                              <td>
                                <ImportanceCell
                                  value={ac.importance ?? 0}
                                  onChange={(newVal) => {
                                    if (isCompleted) return;
                                    // 상태 업데이트
                                    setActionsByFeatureId((prev) => {
                                      const featureId = ac.feature_id;
                                      const actions = prev.get(featureId);
                                      if (!actions) return prev;

                                      const updatedActions = actions.map(
                                        (item) =>
                                          item.action_id === ac.action_id
                                            ? { ...item, importance: newVal }
                                            : item
                                      );

                                      const newMap = new Map(prev);
                                      newMap.set(featureId, updatedActions);
                                      return newMap;
                                    });
                                  }}
                                />
                              </td>
                              <td>
                                <input
                                  type="checkbox"
                                  disabled={isCompleted}
                                  className="list-checkbox"
                                  checked={testCheckAc[ac.action_id] || false}
                                  onChange={(e) =>
                                    setTestCheckAc((prev) => ({
                                      ...prev,
                                      [ac.action_id]: e.target.checked,
                                    }))
                                  }
                                />
                              </td>
                            </tr>
                          ))
                        }
                      </React.Fragment>
                    );
                  })
                }
              </React.Fragment>
            );
          })}
        </tbody>
      </table >
    </div >
  );
}
