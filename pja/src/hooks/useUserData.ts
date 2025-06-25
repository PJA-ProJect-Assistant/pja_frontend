import { useEffect, useState } from "react";
import type { user } from "../types/user";
import { getuser } from "../services/userApi";
import { getmyworkspaces } from "../services/workspaceApi";
import type { workspace } from "../types/workspace";
// import { useDispatch } from "react-redux";

export function useUserData() {
  // const dispatch = useDispatch();
  const [userData, setUserData] = useState<user>();
  const [myWSData, setMyWSData] = useState<workspace>();

  // ✅ useEffect 및 return보다 위에서 정의해야 함
  const fetchUser = async () => {
    try {
      const response = await getuser();
      setUserData(response.data);
      //여기에 사용자 id 반환하는거 있어야 할듯,,?
    } catch (error) {
      console.error("❌ 유저 정보 불러오기 실패:", error);
    }
  };

  const fetchMyWorkspaces = async () => {
    try {
      const response = await getmyworkspaces();
      setMyWSData(response.data);
    } catch (error) {
      console.error("❌ 내 워크스페이스 정보 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchMyWorkspaces();
  }, []);

  return {
    userData,
    myWSData,
    refetchUser: fetchUser,
    refetchWorkspaces: fetchMyWorkspaces,
  };
}
