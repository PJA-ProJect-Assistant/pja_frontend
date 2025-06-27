import { useEffect, useRef, useState } from "react";
import type { LockedUser } from "../types/edit";
import { useSelector } from "react-redux";
import { getedit, keepedit, startedit, stopedit } from "../services/editApi";
import type { RootState } from "../store/store";

type EditingMap = Record<string, LockedUser | null>; // key: `${field}_${filedId}`

/**
 * 전체 페이지에 대해 편집 중인 사용자 정보를 3초마다 폴링해서
 * 필드별로 편집자 목록을 관리해주는 훅
 */
export function useEditLock(page: string = "idea-input") {
  const [editingMap, setEditingMap] = useState<EditingMap>({});
  const timer = useRef<NodeJS.Timeout | null>(null);
  const keepTimer = useRef<NodeJS.Timeout | null>(null);
  const selectedWS = useSelector(
    (state: RootState) => state.workspace.selectedWS
  );
  const [alreadyEdit, setAlreadyEdit] = useState<boolean>(false);
  const workspaceId = selectedWS?.workspaceId;

  //편집 조회 api
  const fetchStatus = async () => {
    if (!workspaceId) return;
    try {
      const res = await getedit(workspaceId, page);
      const json = res.data;

      const map: EditingMap = {};

      json?.forEach((user: LockedUser) => {
        if (user.page === page) {
          const key = `${user.field ?? "null"}_${user.fieldId ?? "null"}`;
          if (!map[key]) map[key] = null;
          map[key] = user;
        }
      });

      setEditingMap(map);
    } catch (err) {
      console.warn("편집 상태 조회 실패:", err);
    }
  };

  // 편집 조회 타이머 시작
  const startPolling = () => {
    if (timer.current) clearInterval(timer.current); // 중복 방지
    fetchStatus(); // 바로 한 번 실행
    timer.current = setInterval(fetchStatus, 5000); // 이후 5초마다 실행
  };

  // 편집 조회 타이머 중지
  const stopPolling = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
    setEditingMap({});
  };

  // 편집 중인 user 호출
  const getUserEditingField = (
    field: string | null,
    fieldId: string | null
  ) => {
    const key = `${field ?? "null"}_${fieldId ?? "null"}`;
    return editingMap[key];
  };

  const startEditing = async (field: string | null, fieldId: string | null) => {
    if (!workspaceId) return;
    try {
      const res = await startedit(workspaceId, page, field, fieldId);

      // 편집 성공 시 자동으로 keep alive 시작
      startKeepAlive(field, fieldId);

      return res.data;
    } catch (err: any) {
      if (err.response?.status === 409) {
        // 이미 수정하고 있는 사람 존재
        setAlreadyEdit(true);
      } else console.error("편집 시작 에러:", err);
    }
  };

  const stopEditing = async (field: string | null, fieldId: string | null) => {
    if (!workspaceId) return;
    try {
      const res = await stopedit(workspaceId, page, field, fieldId);

      // 편집 중지 시 keepAlive 타이머도 중지
      if (keepTimer.current) {
        clearInterval(keepTimer.current);
        keepTimer.current = null;
      }

      return res.data;
    } catch (err) {
      console.warn("편집 종료 실패:", err);
    }
  };

  const startKeepAlive = (field: string | null, fieldId: string | null) => {
    if (keepTimer.current) clearInterval(keepTimer.current);
    if (!workspaceId) return;

    keepTimer.current = setInterval(async () => {
      try {
        const res = await keepedit(workspaceId, page, field, fieldId);
        return res.data;
      } catch (err) {
        console.warn("편집 유지 실패:", err);
      }
    }, 11000);
  };

  useEffect(() => {
    return () => {
      if (timer.current) clearInterval(timer.current);
      if (keepTimer.current) clearInterval(keepTimer.current);
    };
  }, []);

  return {
    getUserEditingField,
    startEditing,
    stopEditing,
    alreadyEdit,
    setAlreadyEdit,
    startPolling,
    stopPolling,
  };
}
