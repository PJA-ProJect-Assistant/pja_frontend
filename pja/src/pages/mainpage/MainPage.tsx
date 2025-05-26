import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getRandomColor } from "../../utils/colorUtils";
import { PROFILE_COLORS } from "../../constants/colors";
import { setProfileColor } from "../../store/profileSlice";
import type { RootState } from "../../store/store";

export default function MainPage() {
  const dispatch = useDispatch(); // store에 데이터 넣기
  const profileColor = useSelector(
    (state: RootState) => state.profile.profileColor
  ); //store에서 데이터 꺼내기
  // 로컬 스토리지,store에 저장
  useEffect(() => {
    const savedColor = localStorage.getItem("profileColor");
    if (savedColor) {
      dispatch(setProfileColor(savedColor));
    } else {
      const color = getRandomColor(PROFILE_COLORS);
      dispatch(setProfileColor(color));
      localStorage.setItem("profileColor", color);
    }
  }, [dispatch]);
  return (
    <>
      <div>
        <h1>메인페이지</h1>
        <p>
          프로필 색깔:{" "}
          <span style={{ color: profileColor }}>{profileColor}</span>
        </p>
      </div>
    </>
  );
}
