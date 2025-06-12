import { useEffect, useState } from "react";
import type { user } from "../types/user";
import { getuser } from "../services/userApi";

export function useUserData() {
  const [userData, setUserData] = useState<user>();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getuser();
        setUserData(response.data);
      } catch (error) {
        console.error("❌ 유저 정보 불러오기 실패:", error);
      }
    };
    fetchUser();
  }, []);
  return {
    userData,
  };
}
