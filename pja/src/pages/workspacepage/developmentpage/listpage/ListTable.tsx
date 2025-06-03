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

export default function ListTable() {
  const [categoryList, setCategoryList] = useState<feature_category[]>([]);
  const [clickCg, setClickCg] = useState<{ [key: number]: boolean }>({});
  const [clickFt, setClickFt] = useState<{ [key: number]: boolean }>({});
  const [featuresByCategoryId, setFeaturesByCategoryId] = useState<Map<number, feature[]>>(new Map());
  const [actionsByFeatureId, setActionsByFeatureId] = useState<Map<number, action[]>>(new Map());
  const [startDates, setStartDates] = useState<{ [key: number]: Date | null }>({});
  const [endDates, setEndDates] = useState<{ [key: number]: Date | null }>({});
  const [testCheckCg, setTestCheckCg] = useState<{ [key: number]: boolean }>({});
  const [testCheckFt, setTestCheckFt] = useState<{ [key: number]: boolean }>({});
  const [testCheckAc, setTestCheckAc] = useState<{ [key: number]: boolean }>({});

  const selectedWS = useSelector(
    (state: RootState) => state.workspace.selectedWS
  );

  useEffect(() => {
    const category = featureCategories
      .filter((cg) => cg.workspace_id === selectedWS?.workspace_id)
      .sort((a, b) => Number(a.state) - Number(b.state));

    const cgCheck: { [key: number]: boolean } = {};
    category.forEach((cg) => {
      cgCheck[cg.feature_catefory_id] = cg.has_test;
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
        categoryList.some((cg) => cg.feature_catefory_id === ft.category_id)
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
      .filter((ac) =>
        allFeatures.some((ft) => ft.feature_id === ac.feature_id)
      )
      .forEach((ac) => {
        if (!actionMap.has(ac.feature_id)) {
          actionMap.set(ac.feature_id, []);
        }
        actionMap.get(ac.feature_id)!.push(ac);

        // ✅ 액션 내 포함된 날짜값을 그대로 초기값으로 설정
        startDateMap[ac.action_id] = ac.start_date ? new Date(ac.start_date) : null;
        endDateMap[ac.action_id] = ac.end_date ? new Date(ac.end_date) : null;
      });

    setActionsByFeatureId(actionMap);
    setStartDates(startDateMap);
    setEndDates(endDateMap);
  }, [featuresByCategoryId]);

  useEffect(() => {
    const cgCheck: { [key: number]: boolean } = {};
    categoryList.forEach((cg) => {
      cgCheck[cg.feature_catefory_id] = cg.has_test;
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
      const children = featuresByCategoryId.get(cg.feature_catefory_id) || [];
      result[cg.feature_catefory_id] = children.every((ft) => ft.state === true);
    }
    return result;
  }, [featuresByCategoryId, categoryList]);

  const handleCompleteClick = (categoryId: number) => {
    const updatedList = categoryList.map((cg) =>
      cg.feature_catefory_id === categoryId ? { ...cg, state: !cg.state } : cg
    );
    updatedList.sort((a, b) => Number(a.state) - Number(b.state));
    setCategoryList(updatedList);
  };

  const cgToggleClick = (index: number) => {
    setClickCg((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const ftToggleClick = (id: number) => {
    setClickFt((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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

            const categoryFeatures = featuresByCategoryId.get(cg.feature_catefory_id) || [];

            return (
              <React.Fragment key={cg.feature_catefory_id}>
                {/* 카테고리 행 */}
                <tr className={`cg-row ${isCompleted ? "completed" : ""}`}>
                  <td>
                    <div className="cglist-name">
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
                    </div>
                  </td>
                  <td />
                  <td />
                  <td />
                  <td>
                    <button
                      className={`list-completebtn ${isCompleted ? "completed" : ""
                        }`}
                      disabled={!categoryCompletableMap[cg.feature_catefory_id]}
                      onClick={() =>
                        handleCompleteClick(cg.feature_catefory_id)
                      }
                    >
                      완료하기
                    </button>
                  </td>
                  <td />
                  <td>
                    <input
                      type="checkbox"
                      className="list-checkbox"
                      checked={testCheckCg[cg.feature_catefory_id] || false}
                      onChange={(e) =>
                        setTestCheckCg((prev) => ({
                          ...prev,
                          [cg.feature_catefory_id]: e.target.checked,
                        }))
                      }
                    />
                  </td>
                </tr>

                {/* 기능 리스트 */}
                {clickCg[index] &&
                  categoryFeatures.map((ft) => {

                    const featureActions = actionsByFeatureId.get(ft.feature_id) || [];

                    return (
                      <React.Fragment key={ft.feature_id}>
                        <tr
                          className={`ft-row ${isCompleted ? "completed" : ""}`}
                        >
                          <td>
                            <div className="ftlist-name">
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
                              <span title={ft.name}>{ft.name}</span>
                            </div>
                          </td>
                          <td />
                          <td />
                          <td />
                          <td><FeatureProgressCell actions={featureActions} /></td>
                          <td />
                          <td>
                            <input
                              type="checkbox"
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
                        {clickFt[ft.feature_id] &&
                          featureActions.map((ac) => (
                            <tr
                              key={ac.action_id}
                              className={`ac-row ${isCompleted ? "completed" : ""
                                }`}
                            >
                              <td>
                                <div className="aclist-name">
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
                                  <span title={ac.name}>{ac.name}</span>
                                </div>
                              </td>
                              <td>
                                <DateSelectCell
                                  value={startDates[ac.action_id] ?? null}
                                  onChange={(date) =>
                                    setStartDates((prev) => ({
                                      ...prev,
                                      [ac.action_id]: date,
                                    }))
                                  }
                                />
                              </td>
                              <td>
                                <DateSelectCell
                                  value={endDates[ac.action_id] ?? null}
                                  onChange={(date) =>
                                    setEndDates((prev) => ({
                                      ...prev,
                                      [ac.action_id]: date,
                                    }))
                                  }
                                />
                              </td>
                              <td />
                              <td>
                                <ActionStatusCell
                                  status={ac.status}
                                  onChange={(newStatus) => {
                                    // actionBtFeatureId가 형태가 Map형태라 Map형태를 map 못함
                                    setActionsByFeatureId((prev) => {
                                      const featureId = ac.feature_id;
                                      const actions = prev.get(featureId);
                                      if (!actions) return prev;

                                      const updatedActions = actions.map((item) =>
                                        item.action_id === ac.action_id ? { ...item, status: newStatus } : item
                                      );

                                      const newMap = new Map(prev);
                                      newMap.set(featureId, updatedActions);

                                      // 모든 액션 완료 확인
                                      const allCompleted = updatedActions.every(act => act.status === "COMPLETED");

                                      if (allCompleted) {
                                        setFeaturesByCategoryId((prevFeatures) => {
                                          const updatedFeaturesByCategory = new Map(prevFeatures);
                                          let hasChanged = false;

                                          for (const [categoryId, ftList] of updatedFeaturesByCategory.entries()) {
                                            const newFtList = ftList.map((ft) => {
                                              if (ft.feature_id === featureId && ft.state !== true) {
                                                hasChanged = true;
                                                return { ...ft, state: true };
                                              }
                                              return ft;
                                            });

                                            if (hasChanged) {
                                              updatedFeaturesByCategory.set(categoryId, newFtList);
                                            }
                                          }

                                          return hasChanged ? updatedFeaturesByCategory : prevFeatures;
                                        });
                                      }

                                      return newMap;
                                    });
                                  }}
                                />
                              </td>
                              <td />
                              <td>
                                <input
                                  type="checkbox"
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
                          ))}
                      </React.Fragment>
                    );
                  })}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
