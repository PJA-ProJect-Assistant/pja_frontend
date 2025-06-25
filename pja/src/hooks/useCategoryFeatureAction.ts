import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import type {
  feature_category,
  feature,
  action,
  Status,
  Importance,
  getaiaction,
} from "../types/list";
import type { RootState } from "../store/store";
import { getlist } from "../services/listapi/listApi";
import {
  addcategory,
  deletecategory,
  patchcategoryname,
  patchcategorystate,
  patchcategorytest,
} from "../services/listapi/CategoryApi";
import {
  addfeature,
  deletefeature,
  patchfeaturename,
  patchfeaturestate,
  patchfeaturetest,
} from "../services/listapi/FeatureApi";
import {
  addaction,
  addAIAction,
  deleteaction,
  getActionAI,
  patchactionend,
  patchactionimportance,
  patchactionname,
  patchactionparti,
  patchactionstart,
  patchactionstate,
  patchactiontest,
} from "../services/listapi/ActionApi";
import type { workspace_member } from "../types/workspace";

interface UseCategoryFeatureCategoryReturn {
  categoryList: feature_category[];
  coreFeature: string[];
  clickCg: { [key: number]: boolean };
  clickFt: { [key: number]: boolean };
  aiList: getaiaction | undefined;
  name: string;
  totalCg: number;
  completeCg: number;
  completePg: number;
  workspaceId: number | undefined;
  editingCategoryId: number | null;
  editingFeatureId: number | null;
  editingActionId: number | null;
  participantList: workspace_member[];
  toggleTestCheckCg: (categoryId: number) => void;
  toggleTestCheckFt: (categoryId: number, featureId: number) => void;
  toggleTestCheckAc: (
    categoryId: number,
    featureId: number,
    actionId: number
  ) => void;
  categoryCompletableMap: { [key: number]: boolean };

  setName: React.Dispatch<React.SetStateAction<string>>;
  setEditingCategoryId: React.Dispatch<React.SetStateAction<number | null>>;
  setEditingFeatureId: React.Dispatch<React.SetStateAction<number | null>>;
  setEditingActionId: React.Dispatch<React.SetStateAction<number | null>>;

  handleCompleteClick: (categoryId: number) => void;
  cgToggleClick: (categoryId: number, close?: boolean) => void;
  ftToggleClick: (id: number) => void;

  handleAddCategory: () => void;
  updateCategoryName: (isNew?: boolean) => void;
  handleAddFeature: (categoryId: number) => void;
  updateFeatureName: (categoryId: number, isNew?: boolean) => void;
  handleAddAction: (categoryId: number, featureId: number) => void;
  updateActionName: (
    categoryId: number,
    featureId: number,
    isNew?: boolean
  ) => void;

  handleDeleteCategory: (categoryId: number) => void;
  handleDeleteFeature: (categoryId: number, featureId: number) => void;
  handleDeleteAction: (
    categoryId: number,
    featureId: number,
    actionId: number
  ) => void;

  updateAssignee: (
    categoryId: number,
    featureId: number,
    actionId: number,
    newAssignees: number[]
  ) => void;
  updateStatus: (
    categoryId: number,
    featureId: number,
    actionId: number,
    newStatus: Status
  ) => void;
  updateImportance: (
    categoryId: number,
    featureId: number,
    actionId: number,
    newImportance: Importance
  ) => void;
  updateStartDate: (
    categoryId: number,
    featureId: number,
    actionId: number,
    date: Date | null
  ) => void;
  updateEndDate: (
    categoryId: number,
    featureId: number,
    actionId: number,
    date: Date | null
  ) => void;
  handleAiActionDelete: (aiIdx: number) => void;
  handleUpdateAIAction: (
    categoryId: number,
    featureId: number,
    aiIdx: number
  ) => void;
  handleAddAIAction: (featureId: number) => void;
}

export function useCategoryFeatureCategory(): UseCategoryFeatureCategoryReturn {
  const [categoryList, setCategoryList] = useState<feature_category[]>([]);
  const [coreFeature, setCoreFeature] = useState<string[]>([]);
  const [aiList, setAiList] = useState<getaiaction>();
  const [clickCg, setClickCg] = useState<{ [key: number]: boolean }>({});
  const [clickFt, setClickFt] = useState<{ [key: number]: boolean }>({});
  const [name, setName] = useState<string>("");
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null
  );
  const [editingFeatureId, setEditingFeatureId] = useState<number | null>(null);
  const [editingActionId, setEditingActionId] = useState<number | null>(null);
  const [categoryCompletableMap, setCategoryCompletableMap] = useState<{
    [key: number]: boolean;
  }>({});
  const [workspaceId, setWorkspaceId] = useState<number>();
  const [participantList, setParticipantList] = useState<workspace_member[]>(
    []
  );

  const selectedWS = useSelector(
    (state: RootState) => state.workspace.selectedWS
  );

  //카테고리 진행도
  const totalCg = useMemo(() => categoryList.length, [categoryList]);

  const completeCg = useMemo(
    () => categoryList.filter((cg) => cg.state).length,
    [categoryList]
  );

  const completePg = useMemo(() => {
    return totalCg > 0 ? (completeCg / totalCg) * 100 : 0;
  }, [completeCg, totalCg]);

  const getAllList = async () => {
    if (selectedWS?.workspaceId) {
      setWorkspaceId(selectedWS.workspaceId);
      try {
        const response = await getlist(selectedWS?.workspaceId);
        const data = response.data;
        if (data) {
          setParticipantList(data.participants);
          setCategoryList(
            [...data.featureCategories].sort(
              (a, b) => Number(a.state) - Number(b.state)
            )
          );
          setCoreFeature(data.coreFeatures);
        }
      } catch (err) {
        console.log("getalllist 실패");
      }
    }
  };

  useEffect(() => {
    getAllList();
    setClickCg({});
    setClickFt({});
  }, [selectedWS]);

  useEffect(() => {
    console.log("카테고리 리스트 변경");
  }, [categoryList]);

  // const categoryCompletableMap = useMemo(() => {
  //   const result: { [key: number]: boolean } = {};
  //   for (const cg of categoryList) {
  //     const children = cg.features || [];
  //     result[cg.featureCategoryId] = children.every((ft) => ft.state === true);
  //   }
  //   return result;
  // }, [categoryList]);

  //카테고리 리스트의 feature 수정
  const updateFeatureInCategoryList = (
    list: feature_category[],
    categoryId: number,
    featureId: number,
    updater: (feature: feature) => feature
  ): feature_category[] => {
    return list.map((category) =>
      category.featureCategoryId === categoryId
        ? {
            ...category,
            features: category.features.map((feature) =>
              feature.featureId === featureId ? updater(feature) : feature
            ),
          }
        : category
    );
  };

  //제사용 함수
  //카테고리 리스트의 feature 삭제
  const deleteFeatureFromCategoryList = (
    list: feature_category[],
    categoryId: number,
    featureId: number
  ): feature_category[] => {
    return list.map((category) =>
      category.featureCategoryId === categoryId
        ? {
            ...category,
            features: category.features.filter(
              (feature) => feature.featureId !== featureId
            ),
          }
        : category
    );
  };

  // CategoryList의 action 수정
  const updateActionInCategoryList = (
    list: feature_category[],
    categoryId: number,
    featureId: number,
    actionId: number,
    updater: (action: action) => action
  ): feature_category[] => {
    return list.map((category) =>
      category.featureCategoryId === categoryId
        ? {
            ...category,
            features: category.features.map((feature) =>
              feature.featureId === featureId
                ? {
                    ...feature,
                    actions: feature.actions.map((action) =>
                      action.actionId === actionId ? updater(action) : action
                    ),
                  }
                : feature
            ),
          }
        : category
    );
  };

  // CategoryList의 action 삭제
  const deleteActionFromCategoryList = (
    list: feature_category[],
    categoryId: number,
    featureId: number,
    actionId: number
  ): feature_category[] => {
    return list.map((category) =>
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
    );
  };

  //카테고리 완료
  const handleCompleteClick = async (categoryId: number) => {
    if (workspaceId) {
      const currentstate = categoryList.find(
        (cg) => cg.featureCategoryId === categoryId
      )?.state;
      const changestate = !currentstate;
      //카테고리 완료 수정 api
      try {
        await patchcategorystate(workspaceId, categoryId, changestate);
        getAllList();
        const updatedList = categoryList.map((cg) =>
          cg.featureCategoryId === categoryId
            ? { ...cg, state: changestate }
            : cg
        );
        const index = categoryList.findIndex(
          (cg) => cg.featureCategoryId === categoryId
        );
        if (index !== -1) {
          cgToggleClick(index, true);
        }
        updatedList.sort((a, b) => Number(a.state) - Number(b.state));
        setCategoryList(updatedList);
      } catch (err) {
        console.log("카테고리 상태 수정 실패");
      }
    }
  };

  const cgToggleClick = (categoryId: number, close?: boolean) => {
    console.log("cg토글호출");
    setClickCg((prev) => {
      const next = close ? false : !prev[categoryId];

      if (!next) {
        // categoryId로 실제 category 객체 찾기
        const category = categoryList.find(
          (cg) => cg.featureCategoryId === categoryId
        );
        if (category) {
          const featuresInCategory = category.features;
          setClickFt((prevFt) => {
            const updatedFt = { ...prevFt };
            featuresInCategory.forEach((ft) => {
              updatedFt[ft.featureId] = false;
            });
            return updatedFt;
          });
        }
      }

      return { ...prev, [categoryId]: next };
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
      hasTest: false,
      features: [],
    };
    setCategoryList((prev) => [...prev, newCategory]);
    console.log("카테고리 생성 완료 : ", categoryList);
  };

  const updateCategoryName = async (isNew?: boolean) => {
    console.log("업데이트카테고리네임 돌입");

    if (name.trim() === "") {
      // 이름이 비어 있을 경우
      setCategoryList((prev) => {
        return isNew
          ? prev.filter((item) => item.featureCategoryId !== editingCategoryId)
          : prev;
      });
    } else {
      if (editingCategoryId === null) {
        console.log("카테고리 아이디 존재하지 않음");

        return;
      }
      if (isNew) {
        console.log("카테고리 이름 있음");
        try {
          if (workspaceId) {
            console.log("카테고리 api 시작");
            const response = await addcategory(workspaceId, name); // 카테고리 생성 API 호출
            const newId = response.data;
            if (newId) {
              setCategoryList((prev) =>
                prev.map((item) =>
                  item.featureCategoryId === editingCategoryId
                    ? { ...item, name, featureCategoryId: newId }
                    : item
                )
              );
            }
            getAllList();
          }
        } catch (err) {
          console.error("카테고리 생성 실패", err);
          setCategoryList((prev) =>
            prev.filter((item) => item.featureCategoryId !== editingCategoryId)
          );
        }
      } else {
        try {
          if (workspaceId) {
            // 카테고리 이름 수정 api
            await patchcategoryname(workspaceId, editingCategoryId, name);
            setCategoryList((prev) =>
              prev.map((item) =>
                item.featureCategoryId === editingCategoryId
                  ? { ...item, name }
                  : item
              )
            );
            getAllList();
          }
        } catch (err) {
          console.error("카테고리 수정 실패", err);
        }
      }
    }
    setEditingCategoryId(null);
    setName("");
  };

  const handleAddFeature = (categoryId: number) => {
    console.log("기능 생성 버튼 클릭", categoryId);
    clickFt;
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
    setClickCg((prev) => ({ ...prev, [categoryId]: true }));
    console.log("기능 생성 완료 : ", categoryList);
  };

  const updateFeatureName = async (categoryId: number, isNew?: boolean) => {
    if (editingFeatureId === null) return;
    console.log("카테고리 아이디", categoryId);

    if (name.trim() === "") {
      // 이름이 비어 있을 경우
      if (isNew) {
        setCategoryList((prev) =>
          deleteFeatureFromCategoryList(prev, categoryId, editingFeatureId)
        );
      }
    } else {
      if (isNew) {
        try {
          if (workspaceId) {
            const response = await addfeature(workspaceId, categoryId, name); // 기능생성 API 호출
            const newId = response.data;
            if (newId) {
              setCategoryList((prev) =>
                updateFeatureInCategoryList(
                  prev,
                  categoryId,
                  editingFeatureId,
                  (feature) => ({
                    ...feature,
                    name,
                    featureId: newId,
                  })
                )
              );
            }
          }
        } catch (err) {
          console.error("카테고리 생성 실패", err);
          setCategoryList((prev) =>
            deleteFeatureFromCategoryList(prev, categoryId, editingFeatureId)
          );
        }
      } else {
        try {
          if (workspaceId) {
            // 기능 이름 수정 api
            await patchfeaturename(
              workspaceId,
              categoryId,
              editingFeatureId,
              name
            );
            setCategoryList((prev) =>
              updateFeatureInCategoryList(
                prev,
                categoryId,
                editingFeatureId,
                (feature) => ({
                  ...feature,
                  name,
                })
              )
            );
          }
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
                  startDate: null,
                  endDate: null,
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
    setClickFt((prev) => ({ ...prev, [featureId]: true }));
  };

  const handleAddAIAction = async (featureId: number) => {
    try {
      //여기에 aiaction추천받기 추가
      const response = await getActionAI(workspaceId ?? 0, featureId);
      if (response.data) {
        //ailist에 aiacion 추가
        setAiList(response.data);
        setClickFt((prev) => ({ ...prev, [featureId]: true }));
      }
    } catch (err) {
      console.log("aiaction 추천 실패", err);
    }
  };
  const handleUpdateAIAction = async (
    categoryId: number,
    featureId: number,
    aiIdx: number
  ) => {
    const selectai = aiList?.recommendedActions[aiIdx];
    if (selectai) {
      try {
        const response = await addAIAction(
          selectedWS?.workspaceId ?? 0,
          categoryId,
          featureId,
          selectai
        );
        const actionresponse = response.data;
        if (actionresponse) {
          setCategoryList((prev) =>
            prev.map((category) => {
              if (category.featureCategoryId === categoryId) {
                return {
                  ...category,
                  features: category.features.map((feature) => {
                    if (feature.featureId === featureId) {
                      const newAction: action = {
                        actionId: actionresponse.actionId,
                        name: selectai.name,
                        startDate: selectai.startDate,
                        endDate: selectai.endDate,
                        state: "BEFORE",
                        hasTest: false,
                        importance: selectai.importance,
                        orderIndex: feature.actions.length + 1,
                        participants: [],
                        actionPostId: actionresponse.actionPostId,
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
          setAiList((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              recommendedActions: prev.recommendedActions.filter(
                (_, idx) => idx !== aiIdx
              ),
            };
          });
        }
      } catch (err) {
        console.log("ai action에 추가 실패");
      }
    }
  };
  const handleAiActionDelete = (aiIdx: number) => {
    setAiList((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        recommendedActions: prev.recommendedActions.filter(
          (_, idx) => idx !== aiIdx
        ),
      };
    });
  };

  const updateActionName = async (
    categoryId: number,
    featureId: number,
    isNew?: boolean
  ) => {
    if (editingActionId === null) return;
    if (name.trim() === "") {
      if (isNew) {
        // 새로 만든 액션인데 이름 없이 종료하면 삭제
        setCategoryList((prev) =>
          deleteActionFromCategoryList(
            prev,
            categoryId,
            featureId,
            editingActionId
          )
        );
      }
    } else {
      if (isNew) {
        try {
          if (workspaceId) {
            // 새로운 액션 생성 api
            const response = await addaction(
              workspaceId,
              categoryId,
              featureId,
              name
            );
            const data = response.data;
            if (data) {
              setCategoryList((prev) =>
                updateActionInCategoryList(
                  prev,
                  categoryId,
                  featureId,
                  editingActionId,
                  (action) => ({
                    ...action,
                    name,
                    actionId: data.actionId,
                    actionPostId: data.actionPostId,
                  })
                )
              );
            }
          }
        } catch (err) {
          console.error("액션 생성 실패", err);
          // 실패 시 categorylsit의 액션 제거
          setCategoryList((prev) =>
            deleteActionFromCategoryList(
              prev,
              categoryId,
              featureId,
              editingActionId
            )
          );
        }
      } else {
        try {
          if (workspaceId) {
            // 액션 이름 수정 API 호출
            await patchactionname(
              workspaceId,
              categoryId,
              featureId,
              editingActionId,
              name
            );
            setCategoryList((prev) =>
              updateActionInCategoryList(
                prev,
                categoryId,
                featureId,
                editingActionId,
                (action) => ({
                  ...action,
                  name,
                })
              )
            );
          }
        } catch (err) {
          console.error("액션 수정 실패", err);
        }
      }
    }
    setEditingActionId(null); // ✅ 상태 관리 변수 이름에 따라 조정
    setName("");
  };
  const handleDeleteCategory = async (categoryId: number) => {
    try {
      if (workspaceId) {
        //카테고리 삭제 api
        await deletecategory(workspaceId, categoryId);
        setCategoryList((prev) =>
          prev.filter((item) => item.featureCategoryId !== categoryId)
        );
      }
    } catch (err) {
      console.log("카테고리 삭제 실패", err);
    }
  };

  const handleDeleteFeature = async (categoryId: number, featureId: number) => {
    try {
      if (workspaceId) {
        //기능 삭제 api
        await deletefeature(workspaceId, categoryId, featureId);
        setCategoryList((prev) =>
          deleteFeatureFromCategoryList(prev, categoryId, featureId)
        );
      }
    } catch (err) {
      console.log("기능 삭제 실패", err);
    }
  };

  const handleDeleteAction = async (
    categoryId: number,
    featureId: number,
    actionId: number
  ) => {
    try {
      if (workspaceId) {
        //액션 삭제 api추가하기
        await deleteaction(workspaceId, categoryId, featureId, actionId);
        setCategoryList((prev) =>
          deleteActionFromCategoryList(prev, categoryId, featureId, actionId)
        );
      }
    } catch (err) {
      console.log("액션 삭제 실패", err);
    }
  };

  //테스트 체크
  const toggleTestCheckCg = async (categoryId: number) => {
    try {
      if (workspaceId) {
        const currunttest = categoryList.find(
          (cg) => cg.featureCategoryId === categoryId
        )?.hasTest;
        console.log("현재 테스트 여부", currunttest);

        // 카테고리 테스트 수정api
        await patchcategorytest(workspaceId, categoryId, !currunttest);
        setCategoryList((prev) =>
          prev.map((cg) =>
            cg.featureCategoryId === categoryId
              ? { ...cg, hasTest: !currunttest }
              : cg
          )
        );
      }
    } catch (err) {
      console.log("카테고리 테스트 수정 실패");
    }
  };

  const toggleTestCheckFt = async (categoryId: number, featureId: number) => {
    try {
      if (workspaceId) {
        const currenttest = categoryList
          .find((cg) => cg.featureCategoryId === categoryId)
          ?.features.find((ft) => ft.featureId === featureId)?.hasTest;

        if (currenttest === undefined) return;
        // 기능 테스트 수정api
        await patchfeaturetest(
          workspaceId,
          categoryId,
          featureId,
          !currenttest
        );
        setCategoryList((prev) =>
          updateFeatureInCategoryList(
            prev,
            categoryId,
            featureId,
            (feature) => ({
              ...feature,
              hasTest: !currenttest,
            })
          )
        );
      }
    } catch (err) {
      console.log("기능 테스트 수정 실패");
    }
  };

  const toggleTestCheckAc = async (
    categoryId: number,
    featureId: number,
    actionId: number
  ) => {
    try {
      if (workspaceId) {
        const currenttest = categoryList
          .find((cg) => cg.featureCategoryId === categoryId)
          ?.features.find((ft) => ft.featureId === featureId)
          ?.actions.find((ac) => ac.actionId === actionId)?.hasTest;

        if (currenttest === undefined) return;
        // 액션 테스트 수정api
        await patchactiontest(
          workspaceId,
          categoryId,
          featureId,
          actionId,
          !currenttest
        );
        setCategoryList((prev) =>
          updateActionInCategoryList(
            prev,
            categoryId,
            featureId,
            actionId,
            (action) => ({
              ...action,
              hasTest: !currenttest,
            })
          )
        );
      }
    } catch (err) {
      console.log("기능 테스트 수정 실패");
    }
  };

  // 참가자 업데이트
  const updateAssignee = async (
    categoryId: number,
    featureId: number,
    actionId: number,
    newAssignee: number[]
  ) => {
    try {
      if (workspaceId) {
        //참가자 업데이트 api
        await patchactionparti(
          workspaceId,
          categoryId,
          featureId,
          actionId,
          newAssignee
        );
        //참가자 업데이트 시 반환 값이 따로 없어서 아예 모든 정보를 가져와야함
        getAllList();
      }
    } catch (err) {
      console.log("참가자 업데이트 실패");
    }
  };

  // 상태 업데이트
  const updateStatus = async (
    categoryId: number,
    featureId: number,
    actionId: number,
    newStatus: Status
  ) => {
    try {
      if (workspaceId) {
        //액션 상태업데이트 api
        await patchactionstate(
          workspaceId,
          categoryId,
          featureId,
          actionId,
          newStatus
        );

        let shouldUpdateFeatureStatus = false;
        let newFeatureStatus = false;
        setCategoryList((prev) => {
          const updated = prev.map((category) => {
            if (category.featureCategoryId !== categoryId) return category;

            const updatedFeatures = category.features.map((feature) => {
              if (feature.featureId !== featureId) return feature;

              const updatedActions = feature.actions.map((action) =>
                action.actionId === actionId
                  ? { ...action, state: newStatus }
                  : action
              );

              const allDone = updatedActions.every(
                (action) => action.state === "DONE"
              );

              if (feature.state !== allDone) {
                shouldUpdateFeatureStatus = true;
                newFeatureStatus = allDone;
              }

              return {
                ...feature,
                actions: updatedActions,
                state: allDone,
              };
            });

            return {
              ...category,
              features: updatedFeatures,
            };
          });

          // 🔄 여기서 카테고리 완료 여부 계산
          const newMap: { [key: number]: boolean } = {};
          for (const cg of updated) {
            newMap[cg.featureCategoryId] = cg.features.every(
              (ft) => ft.state === true
            );
          }

          setCategoryCompletableMap(newMap);

          return updated;
        });
        if (shouldUpdateFeatureStatus) {
          console.log("feature상태 변경 시작");
          try {
            await patchfeaturestate(
              workspaceId,
              categoryId,
              featureId,
              newFeatureStatus
            );
            console.log("feature상태 변경 성공");
          } catch {
            console.log("feature상태 변경 실패");
          }
        }
      }
    } catch (err) {
      console.log("상태 업데이트 실패");
    }
  };

  // 중요도 업데이트
  const updateImportance = async (
    categoryId: number,
    featureId: number,
    actionId: number,
    newImportance: Importance
  ) => {
    try {
      if (workspaceId) {
        //중요도 업데이트 api
        await patchactionimportance(
          workspaceId,
          categoryId,
          featureId,
          actionId,
          newImportance
        );
        setCategoryList((prev) =>
          updateActionInCategoryList(
            prev,
            categoryId,
            featureId,
            actionId,
            (action) => ({
              ...action,
              importance: newImportance,
            })
          )
        );
      }
    } catch (err) {
      console.log("중요도 업데이트 실패");
    }
  };
  // 시작,종료 날짜 업데이트
  const updateStartDate = async (
    categoryId: number,
    featureId: number,
    actionId: number,
    date: Date | null
  ) => {
    if (!date) return;
    try {
      if (workspaceId) {
        //시작 날짜 업데이트api
        await patchactionstart(
          workspaceId,
          categoryId,
          featureId,
          actionId,
          date
        );
        setCategoryList((prev) =>
          updateActionInCategoryList(
            prev,
            categoryId,
            featureId,
            actionId,
            (action) => ({
              ...action,
              startDate: date,
            })
          )
        );
      }
    } catch (err) {
      console.log("시작일 업데이트 실패");
    }
  };
  const updateEndDate = async (
    categoryId: number,
    featureId: number,
    actionId: number,
    date: Date | null
  ) => {
    if (!date) return;
    try {
      if (workspaceId) {
        //마감날짜 업데이트 api
        await patchactionend(
          workspaceId,
          categoryId,
          featureId,
          actionId,
          date
        );
        setCategoryList((prev) =>
          updateActionInCategoryList(
            prev,
            categoryId,
            featureId,
            actionId,
            (action) => ({
              ...action,
              endDate: date,
            })
          )
        );
      }
    } catch (err) {
      console.log("종료일 업데이트 실패");
    }
  };

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
    categoryCompletableMap,
    totalCg,
    completeCg,
    completePg,
    aiList,

    toggleTestCheckCg,
    toggleTestCheckFt,
    toggleTestCheckAc,
    setName,
    setEditingCategoryId,
    setEditingFeatureId,
    setEditingActionId,
    updateAssignee,
    updateStatus,
    updateImportance,
    updateStartDate,
    updateEndDate,
    handleCompleteClick,
    cgToggleClick,
    ftToggleClick,
    handleAddCategory,
    updateCategoryName,
    handleAddFeature,
    updateFeatureName,
    handleAddAction,
    updateActionName,
    handleDeleteCategory,
    handleDeleteFeature,
    handleDeleteAction,
    handleAiActionDelete,
    handleUpdateAIAction,
    handleAddAIAction,
  };
}
