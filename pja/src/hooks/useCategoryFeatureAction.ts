import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import type { feature_category, feature, action, Status, Importance } from "../types/list";
import type { RootState } from "../store/store";
import { features, actions, featureCategories } from "../constants/listconstant";
import { dummyWSMember } from "../constants/wsconstants";

interface UseCategoryFeatureCategoryReturn {
    categoryList: feature_category[];
    clickCg: { [key: number]: boolean };
    clickFt: { [key: number]: boolean };
    name: string;
    workspaceId: number | undefined;
    editingCategoryId: number | null;
    editingFeatureId: number | null;
    editingActionId: number | null;
    featuresByCategoryId: Map<number, feature[]>;
    actionsByFeatureId: Map<number, action[]>;

    testCheckCg: { [key: number]: boolean };
    testCheckFt: { [key: number]: boolean };
    testCheckAc: { [key: number]: boolean };
    participantList: number[];
    toggleTestCheckCg: (categoryId: number) => void;
    toggleTestCheckFt: (categoryId: number, featureId: number) => void;
    toggleTestCheckAc: (featureId: number, actionId: number) => void;
    categoryCompletableMap: { [key: number]: boolean };

    setName: React.Dispatch<React.SetStateAction<string>>;
    setEditingCategoryId: React.Dispatch<React.SetStateAction<number | null>>;
    setEditingFeatureId: React.Dispatch<React.SetStateAction<number | null>>;
    setEditingActionId: React.Dispatch<React.SetStateAction<number | null>>;

    handleCompleteClick: (categoryId: number) => void;
    cgToggleClick: (index: number, close?: boolean) => void;
    ftToggleClick: (id: number) => void;

    handleAddCategory: (workspaceId?: number) => void;
    updateCategoryName: (categoryId: number, isNew?: boolean) => void;
    handleAddFeature: (categoryId: number) => void;
    updateFeatureName: (categoryId: number, featureId: number, isNew?: boolean) => void;
    handleAddAction: (featureId: number) => void;
    updateActionName: (featureId: number, actionId: number, isNew?: boolean) => void;

    handleDeleteCategory: (categoryId: number) => void;
    handleDeleteFeature: (categoryId: number, featureId: number) => void;
    handleDeleteAction: (featureId: number, actionId: number) => void;

    updateAssignee: (featureId: number, actionId: number, newAssignees: number[]) => void;
    updateStatus: (featureId: number, actionId: number, newStatus: Status) => void;
    updateImportance: (featureId: number, actionId: number, newImportance: Importance) => void;
    updateStartDate: (featureId: number, actionId: number, date: Date | null) => void;
    updateEndDate: (featureId: number, actionId: number, date: Date | null) => void;
}

export function useCategoryFeatureCategory(): UseCategoryFeatureCategoryReturn {
    const [categoryList, setCategoryList] = useState<feature_category[]>([]);
    const [clickCg, setClickCg] = useState<{ [key: number]: boolean }>({});
    const [clickFt, setClickFt] = useState<{ [key: number]: boolean }>({});
    const [name, setName] = useState<string>("");
    const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
    const [editingFeatureId, setEditingFeatureId] = useState<number | null>(null);
    const [editingActionId, setEditingActionId] = useState<number | null>(null);
    const [featuresByCategoryId, setFeaturesByCategoryId] = useState<Map<number, feature[]>>(new Map());
    const [actionsByFeatureId, setActionsByFeatureId] = useState<Map<number, action[]>>(new Map());
    const [testCheckCg, setTestCheckCg] = useState<{ [key: number]: boolean }>({});
    const [testCheckFt, setTestCheckFt] = useState<{ [key: number]: boolean }>({});
    const [testCheckAc, setTestCheckAc] = useState<{ [key: number]: boolean }>({});
    const [workspaceId, setWorkspaceId] = useState<number>();
    const [participantList, setParticipantList] = useState<number[]>([]);

    const selectedWS = useSelector((state: RootState) => state.workspace.selectedWS);

    useEffect(() => {
        const category = featureCategories
            .filter((cg) => cg.workspace_id === selectedWS?.workspace_id)
            .sort((a, b) => Number(a.state) - Number(b.state));

        if (!selectedWS?.workspace_id) {
            setParticipantList([]);
            return;
        }

        const participants = dummyWSMember
            .filter((member) => member.workspace_id === selectedWS.workspace_id)
            .map((member) => member.user_id); // user_id 배열로 저장 (원한다면 workspace_member_id로도 가능)

        setParticipantList(participants);

        setWorkspaceId(selectedWS?.workspace_id);
        setCategoryList(category);
        setClickCg({});
        setClickFt({});
    }, [selectedWS, featureCategories]);

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
    }, [categoryList, features]);

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

                startDateMap[ac.action_id] = ac.start_date ? new Date(ac.start_date) : null;
                endDateMap[ac.action_id] = ac.end_date ? new Date(ac.end_date) : null;
            });

        setActionsByFeatureId(actionMap);
    }, [featuresByCategoryId, actions]);

    // has_test 초기화 (category, feature, action 각각)
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
        console.log("")
        setTestCheckFt(ftCheck);
    }, [features]);

    useEffect(() => {
        const acCheck: { [key: number]: boolean } = {};
        actions.forEach((ac) => {
            acCheck[ac.action_id] = ac.has_test;
        });
        setTestCheckAc(acCheck);
    }, [actions]);

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
            const children = featuresByCategoryId.get(cg.feature_category_id) || [];
            result[cg.feature_category_id] = children.every((ft) => ft.state === true);
        }
        return result;
    }, [featuresByCategoryId, categoryList]);

    const handleCompleteClick = (categoryId: number) => {
        const updatedList = categoryList.map((cg) =>
            cg.feature_category_id === categoryId ? { ...cg, state: !cg.state } : cg
        );
        const index = categoryList.findIndex((cg) => cg.feature_category_id === categoryId);
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
            return { ...prev, [index]: next };
        });
    };

    const ftToggleClick = (id: number) => {
        setClickFt((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleAddCategory = () => {
        if (!workspaceId) return;
        const newCategory: feature_category = {
            feature_category_id: 0,
            name: "",
            state: false,
            order: 0,
            has_test: false,
            workspace_id: workspaceId,
        };
        setCategoryList((prev) => [...prev, newCategory]);
    };

    const updateCategoryName = (categoryId: number, isNew?: boolean) => {
        setCategoryList((prev) => {
            if (name.trim() === "") {
                if (isNew) {
                    return prev.filter((item) => item.feature_category_id !== categoryId);
                } else {
                    return prev;
                }
            }
            return prev.map((item) =>
                item.feature_category_id === categoryId ? { ...item, name } : item
            );
        });
        setEditingCategoryId(null);
        setName("");
    };

    const handleAddFeature = (categoryId: number) => {
        setFeaturesByCategoryId((prev) => {
            const features = prev.get(categoryId) || [];
            const newFeature: feature = {
                feature_id: 0,
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

    const updateFeatureName = (categoryId: number, featureId: number, isNew?: boolean) => {
        setFeaturesByCategoryId((prev) => {
            const features = prev.get(categoryId);
            if (!features) return prev;

            const trimmedName = name.trim();
            if (trimmedName === "") {
                if (isNew) {
                    const updated = features.filter((item) => item.feature_id !== featureId);
                    const newMap = new Map(prev);
                    newMap.set(categoryId, updated);
                    return newMap;
                } else {
                    return prev;
                }
            }
            const updated = features.map((item) =>
                item.feature_id === featureId ? { ...item, name: trimmedName } : item
            );
            const newMap = new Map(prev);
            newMap.set(categoryId, updated);
            return newMap;
        });
        setEditingFeatureId(null);
        setName("");
    };

    const handleAddAction = (featureId: number) => {
        setActionsByFeatureId((prev) => {
            const actions = prev.get(featureId) || [];
            const newAction: action = {
                action_id: 0,
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

    const updateActionName = (featureId: number, actionId: number, isNew?: boolean) => {
        setActionsByFeatureId((prev) => {
            const actions = prev.get(featureId);
            if (!actions) return prev;

            const trimmedName = name.trim();
            if (trimmedName === "") {
                if (isNew) {
                    const updated = actions.filter((item) => item.action_id !== actionId);
                    const newMap = new Map(prev);
                    newMap.set(featureId, updated);
                    return newMap;
                } else {
                    return prev;
                }
            }
            const updated = actions.map((item) =>
                item.action_id === actionId ? { ...item, name } : item
            );
            const newMap = new Map(prev);
            newMap.set(featureId, updated);
            return newMap;
        });
        setEditingActionId(null);
        setName("");
    };

    const handleDeleteCategory = (categoryId: number) => {
        setCategoryList((prevCategories) => prevCategories.filter((item) => item.feature_category_id !== categoryId));
    };

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

    //테스트 체크
    const toggleTestCheckCg = (categoryId: number) => {
        setClickCg((prev) => ({
            ...prev,
            [categoryId]: !prev[categoryId],
        }));
        setCategoryList((prev) =>
            prev.map((cg) =>
                cg.feature_category_id === categoryId
                    ? { ...cg, has_test: !cg.has_test }
                    : cg
            )
        );
    };

    const toggleTestCheckFt = (categoryId: number, featureId: number) => {
        setTestCheckFt((prev) => ({
            ...prev,
            [featureId]: !prev[featureId],
        }));

        setFeaturesByCategoryId((prev) => {
            const features = prev.get(categoryId);
            if (!features) return prev;

            const updatedFeatures = features.map((ft) =>
                ft.feature_id === featureId
                    ? { ...ft, has_test: !ft.has_test }
                    : ft
            );

            const newMap = new Map(prev);
            newMap.set(categoryId, updatedFeatures);
            return newMap;
        });
    };

    const toggleTestCheckAc = (featureId: number, actionId: number) => {
        setTestCheckAc((prev) => ({
            ...prev,
            [actionId]: !prev[actionId],
        }));
        setActionsByFeatureId((prev) => {
            const actions = prev.get(featureId);
            if (!actions) return prev;

            const updatedActions = actions.map((ac) =>
                ac.action_id === actionId
                    ? { ...ac, has_test: !ac.has_test }
                    : ac
            );

            const newMap = new Map(prev);
            newMap.set(featureId, updatedActions);
            return newMap;
        });
    };

    // 참가자 업데이트
    const updateAssignee = (featureId: number, actionId: number, newAssignee: number[]) => {
        setActionsByFeatureId((prev) => {
            const actions = prev.get(featureId);
            if (!actions) return prev;

            const updated = actions.map((a) => {
                if (a.action_id === actionId) {
                    return { ...a, assignee_id: newAssignee };
                }
                return a;
            });

            const newMap = new Map(prev);
            newMap.set(featureId, updated);
            return newMap;
        });
    };

    // 상태 업데이트
    const updateStatus = (featureId: number, actionId: number, newStatus: Status) => {
        setActionsByFeatureId((prev) => {
            const actions = prev.get(featureId);
            if (!actions) return prev;

            const updatedActions = actions.map((a) =>
                a.action_id === actionId ? { ...a, status: newStatus } : a
            );

            const newMap = new Map(prev);
            newMap.set(featureId, updatedActions);
            return newMap;
        });
    };

    // 중요도 업데이트
    const updateImportance = (featureId: number, actionId: number, newImportance: Importance) => {
        setActionsByFeatureId((prev) => {
            const actions = prev.get(featureId);
            if (!actions) return prev;

            const updated = actions.map((a) =>
                a.action_id === actionId ? { ...a, importance: newImportance } : a
            );

            const newMap = new Map(prev);
            newMap.set(featureId, updated);
            return newMap;
        });
    };
    // 시작,종료 날짜 업데이트
    const updateStartDate = (featureId: number, actionId: number, date: Date | null) => {
        console.log("updateEndDate called", featureId, actionId, date);
        if (!date) return;
        setActionsByFeatureId((prev) => {
            const actions = prev.get(featureId);
            if (!actions) return prev;

            const updated = actions.map((a) =>
                a.action_id === actionId ? { ...a, start_date: date } : a
            );
            const newMap = new Map(prev);
            newMap.set(featureId, updated);
            return newMap;
        });
    }
    const updateEndDate = (featureId: number, actionId: number, date: Date | null) => {
        if (!date) return;
        setActionsByFeatureId((prev) => {
            const actions = prev.get(featureId);
            if (!actions) return prev;

            const updated = actions.map((a) =>
                a.action_id === actionId ? { ...a, end_date: date } : a
            );

            const newMap = new Map(prev);
            newMap.set(featureId, updated);
            return newMap;
        });
    }


    return {
        categoryList,
        clickCg,
        clickFt,
        workspaceId,
        participantList,
        name,
        editingCategoryId,
        editingFeatureId,
        editingActionId,
        featuresByCategoryId,
        actionsByFeatureId,
        testCheckCg,
        testCheckFt,
        testCheckAc,
        categoryCompletableMap,

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
    };
}
