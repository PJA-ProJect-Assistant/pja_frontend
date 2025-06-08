import React from "react";
import type { action, feature, filtered } from "../../../../types/list";
import { useCategoryFeatureCategory } from "../../../../hooks/useCategoryFeatureAction";
import DateSelectCell from "../../../../components/cells/DateSelectCell";
import { ActionStatusCell } from "../../../../components/cells/ActionStatusCell";
import { FeatureProgressCell } from "../../../../components/cells/FeatureProgessCell";
import { ImportanceCell } from "../../../../components/cells/ImportantCell";
import { ParticipantsCell } from "../../../../components/cells/ParticipantsCell";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import "./ListTable.css"
import { actions, features } from "../../../../constants/listconstant";

export default function FilterTable({ selectedCategories, selectedAssignees, selectedStatuses }: filtered) {
    const {
        categoryList,
        clickCg,
        clickFt,
        name,
        workspaceId,
        participantList,
        startDates,
        endDates,
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

        handleCompleteClick,
        cgToggleClick,
        ftToggleClick,

        updateAssignee,
        updateStatus,
        updateImportance,
        updateStartDate,
        updateEndDate,

        handleAddCategory,
        updateCategoryName,
        handleAddFeature,
        updateFeatureName,
        handleAddAction,
        updateActionName,

        handleDeleteCategory,
        handleDeleteFeature,
        handleDeleteAction,
    } = useCategoryFeatureCategory();

    const navigate = useNavigate();

    // 1. 카테고리 필터 (선택된 카테고리가 없으면 전체 허용)
    const allowedCategories = selectedCategories.length > 0
        ? categoryList.filter(cg => selectedCategories.includes(cg.feature_category_id))
        : categoryList;

    // 2. allowedCategories에 속한 feature 필터링
    const allowedCategoryIds = allowedCategories.map(cg => cg.feature_category_id);
    const filteredFeatures = features.filter(ft => allowedCategoryIds.includes(ft.category_id));

    // 3. feature id 리스트
    const filteredFeatureIds = filteredFeatures.map(ft => ft.feature_id);

    // 4. 액션 필터링: feature_id가 포함되고, 선택된 참여자와 상태 조건에 맞는 액션 필터링
    const filteredActions = actions.filter(ac => {
        if (!filteredFeatureIds.includes(ac.feature_id)) return false;
        if (
            selectedAssignees.length > 0 &&
            (!ac.assignee_id || !ac.assignee_id.some(id => selectedAssignees.includes(id)))
        ) return false;
        if (selectedStatuses.length > 0 && !selectedStatuses.includes(ac.status)) return false;
        return true;
    });

    // 5. feature 별로 액션 그룹핑
    const featureActionMap = new Map<number, action[]>();
    filteredActions.forEach(ac => {
        if (!featureActionMap.has(ac.feature_id)) {
            featureActionMap.set(ac.feature_id, []);
        }
        featureActionMap.get(ac.feature_id)!.push(ac);
    });

    // 6. 카테고리 별로 feature + 해당 feature에 속한 액션 묶기
    const categoryMap = new Map<number, { feature: feature; actions: action[] }[]>();
    filteredFeatures.forEach(ft => {
        const actionsForFeature = featureActionMap.get(ft.feature_id) || [];
        if (actionsForFeature.length === 0) return;  // 액션이 없는 feature는 제외

        if (!categoryMap.has(ft.category_id)) {
            categoryMap.set(ft.category_id, []);
        }
        categoryMap.get(ft.category_id)!.push({ feature: ft, actions: actionsForFeature });
    });

    return (
        <>
            <div>
                {[...categoryMap.entries()].map(([categoryId, featureActions]) => {
                    const category = categoryList.find(cg => cg.feature_category_id === categoryId);
                    return (
                        <div key={categoryId}>
                            <h2>{category?.name || `Category ${categoryId}`}</h2>
                            {featureActions.map(({ feature, actions }) => (
                                <div key={feature.feature_id} style={{ marginLeft: "20px" }}>
                                    <h3>{feature.name}</h3>
                                    <ul>
                                        {actions.map((ac) => (
                                            <li key={ac.action_id}>
                                                {ac.name} - 상태: {ac.status} - 참여자: {ac.assignee_id}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </>
    );
}