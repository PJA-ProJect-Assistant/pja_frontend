import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import type {
  feature_category,
  feature,
  action,
  Status,
  Importance,
} from "../types/list";
import type { RootState } from "../store/store";
import { addAction, addcategory, addfeature, getlist } from "../services/listApi";
import type { workspace_member } from "../types/workspace";

interface UseCategoryFeatureCategoryReturn {
  categoryList: feature_category[];
  coreFeature: string[];
  clickCg: { [key: number]: boolean };
  clickFt: { [key: number]: boolean };
  name: string;
  workspaceId: number | undefined;
  editingCategoryId: number | null;
  editingFeatureId: number | null;
  editingActionId: number | null;

  // testCheckCg: { [key: number]: boolean };
  // testCheckFt: { [key: number]: boolean };
  // testCheckAc: { [key: number]: boolean };
  participantList: workspace_member[];
  // toggleTestCheckCg: (categoryId: number) => void;
  // toggleTestCheckFt: (categoryId: number, featureId: number) => void;
  // toggleTestCheckAc: (featureId: number, actionId: number) => void;
  categoryCompletableMap: { [key: number]: boolean };

  setName: React.Dispatch<React.SetStateAction<string>>;
  setEditingCategoryId: React.Dispatch<React.SetStateAction<number | null>>;
  setEditingFeatureId: React.Dispatch<React.SetStateAction<number | null>>;
  setEditingActionId: React.Dispatch<React.SetStateAction<number | null>>;

  handleCompleteClick: (categoryId: number) => void;
  cgToggleClick: (index: number, close?: boolean) => void;
  ftToggleClick: (id: number) => void;

  handleAddCategory: () => void;
  updateCategoryName: (categoryId: number, isNew?: boolean) => void;
  handleAddFeature: (categoryId: number) => void;
  updateFeatureName: (
    categoryId: number,
    featureId: number,
    isNew?: boolean
  ) => void;
  handleAddAction: (categoryId: number, featureId: number) => void;
  updateActionName: (
    categoryId: number,
    featureId: number,
    actionId: number,
    isNew?: boolean
  ) => void;

  // handleDeleteCategory: (categoryId: number) => void;
  // handleDeleteFeature: (categoryId: number, featureId: number) => void;
  // handleDeleteAction: (featureId: number, actionId: number) => void;

  // updateAssignee: (
  //   featureId: number,
  //   actionId: number,
  //   newAssignees: number[]
  // ) => void;
  // updateStatus: (
  //   featureId: number,
  //   actionId: number,
  //   newStatus: Status
  // ) => void;
  // updateImportance: (
  //   featureId: number,
  //   actionId: number,
  //   newImportance: Importance
  // ) => void;
  // updateStartDate: (
  //   featureId: number,
  //   actionId: number,
  //   date: Date | null
  // ) => void;
  // updateEndDate: (
  //   featureId: number,
  //   actionId: number,
  //   date: Date | null
  // ) => void;
}

export function useCategoryFeatureCategory(): UseCategoryFeatureCategoryReturn {
  const [categoryList, setCategoryList] = useState<feature_category[]>([]);
  const [coreFeature, setCoreFeature] = useState<string[]>([]);
  const [clickCg, setClickCg] = useState<{ [key: number]: boolean }>({});
  const [clickFt, setClickFt] = useState<{ [key: number]: boolean }>({});
  const [name, setName] = useState<string>("");
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null
  );
  const [editingFeatureId, setEditingFeatureId] = useState<number | null>(null);
  const [editingActionId, setEditingActionId] = useState<number | null>(null);

  // const [testCheckCg, setTestCheckCg] = useState<{ [key: number]: boolean }>(
  //   {}
  // );
  // const [testCheckFt, setTestCheckFt] = useState<{ [key: number]: boolean }>(
  //   {}
  // );
  // const [testCheckAc, setTestCheckAc] = useState<{ [key: number]: boolean }>(
  //   {}
  // );
  const [workspaceId, setWorkspaceId] = useState<number>();
  const [participantList, setParticipantList] = useState<workspace_member[]>([]);

  const selectedWS = useSelector(
    (state: RootState) => state.workspace.selectedWS
  );

  const getAllList = async () => {
    if (selectedWS?.workspaceId) {
      setWorkspaceId(selectedWS.workspaceId);
      try {
        const response = await getlist(selectedWS?.workspaceId);
        const data = response.data;
        if (data) {
          setParticipantList(data.participants);
          setCategoryList(data.featureCategories.sort((a, b) => Number(a.state) - Number(b.state)));
          setCoreFeature(data.coreFeatures);
        }

      } catch (err) {
        console.log("getalllist 실패");
      }
    }
  }

  useEffect(() => {
    getAllList();
    setClickCg({});
    setClickFt({});
  }, [selectedWS]);

  // has_test 초기화 (category, feature, action 각각)
  // useEffect(() => {
  //   const cgCheck: { [key: number]: boolean } = {};
  //   categoryList.forEach((cg) => {
  //     cgCheck[cg.feature_category_id] = cg.has_test;
  //   });
  //   setTestCheckCg(cgCheck);
  // }, [categoryList]);

  // useEffect(() => {
  //   const ftCheck: { [key: number]: boolean } = {};
  //   features.forEach((ft) => {
  //     ftCheck[ft.feature_id] = ft.has_test;
  //   });
  //   console.log("");
  //   setTestCheckFt(ftCheck);
  // }, [features]);

  // useEffect(() => {
  //   const acCheck: { [key: number]: boolean } = {};
  //   actions.forEach((ac) => {
  //     acCheck[ac.action_id] = ac.has_test;
  //   });
  //   setTestCheckAc(acCheck);
  // }, [actions]);

  //feature의 모든 action 상태를 감시해서 자동 업데이트
  // 오류 발생, 충돌발생으로 액션 바꾸고 기능 상태 업데이트 불가능...
  // useEffect(() => {
  //     // featuresByCategoryId와 actionsByFeatureId가 모두 세팅된 후 동작
  //     if (featuresByCategoryId.size === 0 || actionsByFeatureId.size === 0) return;

  //     setFeaturesByCategoryId((prev) => {
  //         const newMap = new Map(prev);

  //         for (const [categoryId, features] of newMap.entries()) {
  //             const updatedFeatures = features.map((ft) => {
  //                 const relatedActions = actionsByFeatureId.get(ft.feature_id) || [];
  //                 const allComplete = relatedActions.length > 0 && relatedActions.every((a) => a.status === "COMPLETED");

  //                 // 상태가 다르면 업데이트
  //                 if (ft.state !== allComplete) {
  //                     return { ...ft, state: allComplete };
  //                 }
  //                 return ft;
  //             });
  //             newMap.set(categoryId, updatedFeatures);
  //         }

  //         return newMap;
  //     });
  // }, [actionsByFeatureId]); // <- 핵심: 액션 바뀌면 자동 감지

  const categoryCompletableMap = useMemo(() => {
    const result: { [key: number]: boolean } = {};
    for (const cg of categoryList) {
      const children = cg.features || [];
      result[cg.featureCategoryId] = children.every(
        (ft) => ft.state === true
      );
    }
    return result;
  }, [categoryList]);

  const handleCompleteClick = (categoryId: number) => {
    const updatedList = categoryList.map((cg) =>
      cg.featureCategoryId === categoryId ? { ...cg, state: !cg.state } : cg
    );
    const index = categoryList.findIndex(
      (cg) => cg.featureCategoryId === categoryId
    );
    if (index !== -1) {
      cgToggleClick(index, true);
    }
    updatedList.sort((a, b) => Number(a.state) - Number(b.state));
    setCategoryList(updatedList);
  };

  const cgToggleClick = (index: number, close?: boolean) => {
    setClickCg((prev) => {
      const next = close ? false : !prev[index];
      if (!next) {
        const featuresInCategory = categoryList[index].features;
        setClickFt((prevFt) => {
          const updatedFt = { ...prevFt };
          featuresInCategory.forEach((ft) => {
            updatedFt[ft.featureId] = false;
          });
          return updatedFt;
        });
      }
      return { ...prev, [index]: next };
    });
  };

  const ftToggleClick = (id: number) => {
    setClickFt((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddCategory = () => {
    if (!workspaceId) return;
    const newCategory: feature_category = {
      featureCategoryId: 0,
      name: "",
      state: false,
      orderIndex: categoryList.length + 1,
      has_test: false,
      features: [],
    };
    setCategoryList((prev) => [...prev, newCategory]);
  };

  const updateCategoryName = async (categoryId: number, isNew?: boolean) => {
    if (name.trim() === "") {
      // 이름이 비어 있을 경우
      setCategoryList((prev) => {
        return isNew
          ? prev.filter((item) => item.featureCategoryId !== categoryId)
          : prev;
      });
    } else {
      if (isNew) {
        try {
          if (workspaceId) {
            const response = await addcategory(workspaceId, name); // API 호출
            const newId = response.data;
            if (newId) {
              setCategoryList((prev) =>
                prev.map((item) =>
                  item.featureCategoryId === categoryId
                    ? { ...item, name, featureCategoryId: newId }
                    : item
                )
              );
            }
          }
        } catch (err) {
          console.error("카테고리 생성 실패", err);
          setCategoryList((prev) =>
            prev.filter((item) => item.featureCategoryId !== categoryId)
          );
        }
      } else {
        try {
          // 카테고리 수정 api 추가
          setCategoryList((prev) =>
            prev.map((item) =>
              item.featureCategoryId === categoryId
                ? { ...item, name }
                : item
            )
          );
        } catch (err) {
          console.error("카테고리 수정 실패", err);
        }
      }
    }
    setEditingCategoryId(null);
    setName("");
  };

  const handleAddFeature = (categoryId: number) => {
    setCategoryList((prev) =>
      prev.map((category) => {
        if (category.featureCategoryId === categoryId) {
          const newFeature: feature = {
            featureId: 0,
            name: "",
            state: false,
            hasTest: false,
            orderIndex: category.features.length + 1, // 예: 순서 자동 부여
            actions: [],
          };

          return {
            ...category,
            features: [...category.features, newFeature],
          };
        }
        return category;
      })
    );
  };

  const updateFeatureName = async (
    categoryId: number,
    featureId: number,
    isNew?: boolean
  ) => {
    if (name.trim() === "") {
      // 이름이 비어 있을 경우
      if (isNew) {
        setCategoryList((prev) =>
          prev.map((category) =>
            category.featureCategoryId === categoryId
              ? {
                ...category,
                features: category.features.filter(
                  (feature) => feature.featureId !== featureId
                ),
              }
              : category
          )
        );
      }
    } else {
      if (isNew) {
        try {
          if (workspaceId) {
            const response = await addfeature(workspaceId, categoryId, name); // 기능API 호출
            const newId = response.data;
            if (newId) {
              setCategoryList((prev) =>
                prev.map((category) =>
                  category.featureCategoryId === categoryId
                    ? {
                      ...category,
                      features: category.features.map((feature) =>
                        feature.featureId === featureId
                          ? { ...feature, name, featureId: newId }
                          : feature
                      ),
                    }
                    : category
                )
              );
            }
          }
        } catch (err) {
          console.error("카테고리 생성 실패", err);
          setCategoryList((prev) =>
            prev.map((category) =>
              category.featureCategoryId === categoryId
                ? {
                  ...category,
                  features: category.features.filter(
                    (feature) => feature.featureId !== featureId
                  ),
                }
                : category
            )
          );
        }
      } else {
        try {
          // 기능 수정 api 추가
          setCategoryList((prev) =>
            prev.map((category) =>
              category.featureCategoryId === categoryId
                ? {
                  ...category,
                  features: category.features.map((feature) =>
                    feature.featureId === featureId
                      ? { ...feature, name }
                      : feature
                  ),
                }
                : category
            )
          );
        } catch (err) {
          console.error("기능 수정 실패", err);
        }
      }
    }
    setEditingFeatureId(null);
    setName("");
  };

  const handleAddAction = (categoryId: number, featureId: number) => {
    setCategoryList((prev) =>
      prev.map((category) => {
        if (category.featureCategoryId === categoryId) {
          return {
            ...category,
            features: category.features.map((feature) => {
              if (feature.featureId === featureId) {
                const newAction: action = {
                  actionId: 0,
                  name: "",
                  startDate: "",
                  endDate: "",
                  state: "BEFORE",
                  hasTest: false,
                  importance: 0,
                  orderIndex: feature.actions.length + 1,
                  participants: [],
                  actionPostId: null,
                };
                return {
                  ...feature,
                  actions: [...feature.actions, newAction],
                };
              }
              return feature;
            }),
          };
        }
        return category;
      })
    );
  };

  const updateActionName = async (
    categoryId: number,
    featureId: number,
    actionId: number,
    isNew?: boolean
  ) => {
    if (name.trim() === "") {
      if (isNew) {
        // 새로 만든 액션인데 이름 없이 종료하면 삭제
        setCategoryList((prev) =>
          prev.map((category) =>
            category.featureCategoryId === categoryId
              ? {
                ...category,
                features: category.features.map((feature) =>
                  feature.featureId === featureId
                    ? {
                      ...feature,
                      actions: feature.actions.filter(
                        (action) => action.actionId !== actionId
                      ),
                    }
                    : feature
                ),
              }
              : category
          )
        );
      }
    } else {
      if (isNew) {
        try {
          if (workspaceId) {
            const response = await addAction(workspaceId, categoryId, featureId, name);
            const newId = response.data;
            if (newId) {
              setCategoryList((prev) =>
                prev.map((category) =>
                  category.featureCategoryId === categoryId
                    ? {
                      ...category,
                      features: category.features.map((feature) =>
                        feature.featureId === featureId
                          ? {
                            ...feature,
                            actions: feature.actions.map((action) =>
                              action.actionId === actionId
                                ? { ...action, name, actionId: newId }
                                : action
                            ),
                          }
                          : feature
                      ),
                    }
                    : category
                )
              );
            }
          }
        } catch (err) {
          console.error("액션 생성 실패", err);
          // 실패 시 액션 제거
          setCategoryList((prev) =>
            prev.map((category) =>
              category.featureCategoryId === categoryId
                ? {
                  ...category,
                  features: category.features.map((feature) =>
                    feature.featureId === featureId
                      ? {
                        ...feature,
                        actions: feature.actions.filter(
                          (action) => action.actionId !== actionId
                        ),
                      }
                      : feature
                  ),
                }
                : category
            )
          );
        }
      } else {
        try {
          // 액션 수정 API 호출 위치 (선택 사항)
          setCategoryList((prev) =>
            prev.map((category) =>
              category.featureCategoryId === categoryId
                ? {
                  ...category,
                  features: category.features.map((feature) =>
                    feature.featureId === featureId
                      ? {
                        ...feature,
                        actions: feature.actions.map((action) =>
                          action.actionId === actionId
                            ? { ...action, name }
                            : action
                        ),
                      }
                      : feature
                  ),
                }
                : category
            )
          );
        } catch (err) {
          console.error("액션 수정 실패", err);
        }
      }
    }

    setEditingActionId(null); // ✅ 상태 관리 변수 이름에 따라 조정
    setName("");
  };
  // const handleDeleteCategory = (categoryId: number) => {
  //   setCategoryList((prevCategories) =>
  //     prevCategories.filter((item) => item.feature_category_id !== categoryId)
  //   );
  // };

  // const handleDeleteFeature = (categoryId: number, featureId: number) => {
  //   setFeaturesByCategoryId((prev) => {
  //     const updated = new Map(prev);
  //     const features = updated.get(categoryId);
  //     if (!features) return prev;

  //     const newFeatures = features.filter((f) => f.feature_id !== featureId);
  //     updated.set(categoryId, newFeatures);
  //     return updated;
  //   });
  // };

  // const handleDeleteAction = (featureId: number, actionId: number) => {
  //   setActionsByFeatureId((prev) => {
  //     const updated = new Map(prev);
  //     const action = updated.get(featureId);
  //     if (!action) return prev;

  //     const newActions = action.filter((a) => a.action_id !== actionId);
  //     updated.set(featureId, newActions);
  //     return updated;
  //   });
  // };

  // //테스트 체크
  // const toggleTestCheckCg = (categoryId: number) => {
  //   setClickCg((prev) => ({
  //     ...prev,
  //     [categoryId]: !prev[categoryId],
  //   }));
  //   setCategoryList((prev) =>
  //     prev.map((cg) =>
  //       cg.feature_category_id === categoryId
  //         ? { ...cg, has_test: !cg.has_test }
  //         : cg
  //     )
  //   );
  // };

  // const toggleTestCheckFt = (categoryId: number, featureId: number) => {
  //   setTestCheckFt((prev) => ({
  //     ...prev,
  //     [featureId]: !prev[featureId],
  //   }));

  //   setFeaturesByCategoryId((prev) => {
  //     const features = prev.get(categoryId);
  //     if (!features) return prev;

  //     const updatedFeatures = features.map((ft) =>
  //       ft.feature_id === featureId ? { ...ft, has_test: !ft.has_test } : ft
  //     );

  //     const newMap = new Map(prev);
  //     newMap.set(categoryId, updatedFeatures);
  //     return newMap;
  //   });
  // };

  // const toggleTestCheckAc = (featureId: number, actionId: number) => {
  //   setTestCheckAc((prev) => ({
  //     ...prev,
  //     [actionId]: !prev[actionId],
  //   }));
  //   setActionsByFeatureId((prev) => {
  //     const actions = prev.get(featureId);
  //     if (!actions) return prev;

  //     const updatedActions = actions.map((ac) =>
  //       ac.action_id === actionId ? { ...ac, has_test: !ac.has_test } : ac
  //     );

  //     const newMap = new Map(prev);
  //     newMap.set(featureId, updatedActions);
  //     return newMap;
  //   });
  // };

  // // 참가자 업데이트
  // const updateAssignee = (
  //   featureId: number,
  //   actionId: number,
  //   newAssignee: number[]
  // ) => {
  //   setActionsByFeatureId((prev) => {
  //     const actions = prev.get(featureId);
  //     if (!actions) return prev;

  //     const updated = actions.map((a) => {
  //       if (a.action_id === actionId) {
  //         return { ...a, assignee_id: newAssignee };
  //       }
  //       return a;
  //     });

  //     const newMap = new Map(prev);
  //     newMap.set(featureId, updated);
  //     return newMap;
  //   });
  // };

  // // 상태 업데이트
  // const updateStatus = (
  //   featureId: number,
  //   actionId: number,
  //   newStatus: Status
  // ) => {
  //   setActionsByFeatureId((prev) => {
  //     const actions = prev.get(featureId);
  //     if (!actions) return prev;

  //     const updatedActions = actions.map((a) =>
  //       a.action_id === actionId ? { ...a, status: newStatus } : a
  //     );

  //     const newMap = new Map(prev);
  //     newMap.set(featureId, updatedActions);
  //     return newMap;
  //   });
  // };

  // // 중요도 업데이트
  // const updateImportance = (
  //   featureId: number,
  //   actionId: number,
  //   newImportance: Importance
  // ) => {
  //   setActionsByFeatureId((prev) => {
  //     const actions = prev.get(featureId);
  //     if (!actions) return prev;

  //     const updated = actions.map((a) =>
  //       a.action_id === actionId ? { ...a, importance: newImportance } : a
  //     );

  //     const newMap = new Map(prev);
  //     newMap.set(featureId, updated);
  //     return newMap;
  //   });
  // };
  // // 시작,종료 날짜 업데이트
  // const updateStartDate = (
  //   featureId: number,
  //   actionId: number,
  //   date: Date | null
  // ) => {
  //   console.log("updateEndDate called", featureId, actionId, date);
  //   if (!date) return;
  //   setActionsByFeatureId((prev) => {
  //     const actions = prev.get(featureId);
  //     if (!actions) return prev;

  //     const updated = actions.map((a) =>
  //       a.action_id === actionId ? { ...a, start_date: date } : a
  //     );
  //     const newMap = new Map(prev);
  //     newMap.set(featureId, updated);
  //     return newMap;
  //   });
  // };
  // const updateEndDate = (
  //   featureId: number,
  //   actionId: number,
  //   date: Date | null
  // ) => {
  //   if (!date) return;
  //   setActionsByFeatureId((prev) => {
  //     const actions = prev.get(featureId);
  //     if (!actions) return prev;

  //     const updated = actions.map((a) =>
  //       a.action_id === actionId ? { ...a, end_date: date } : a
  //     );

  //     const newMap = new Map(prev);
  //     newMap.set(featureId, updated);
  //     return newMap;
  //   });
  // };

  return {
    categoryList,
    clickCg,
    clickFt,
    workspaceId,
    participantList,
    coreFeature,
    name,
    editingCategoryId,
    editingFeatureId,
    editingActionId,
    // testCheckCg,
    // testCheckFt,
    // testCheckAc,
    categoryCompletableMap,

    // toggleTestCheckCg,
    // toggleTestCheckFt,
    // toggleTestCheckAc,
    setName,
    setEditingCategoryId,
    setEditingFeatureId,
    setEditingActionId,
    // updateAssignee,
    // updateStatus,
    // updateImportance,
    // updateStartDate,
    // updateEndDate,
    handleCompleteClick,
    cgToggleClick,
    ftToggleClick,
    handleAddCategory,
    updateCategoryName,
    handleAddFeature,
    updateFeatureName,
    handleAddAction,
    updateActionName,
    // handleDeleteCategory,
    // handleDeleteFeature,
    // handleDeleteAction,
  };
}
