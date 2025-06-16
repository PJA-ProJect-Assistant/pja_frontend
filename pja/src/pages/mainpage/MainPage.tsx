import { useEffect, useState } from "react";
import { MainHeader } from "../../components/header/MainHeader";
import { Myworkspace } from "./Myworkspace";
import MainMenu from "../../components/sidebar/MainMenuSidebar";
import { AnimatePresence } from "framer-motion";
import "./MainPage.css";
import { useUserData } from "../../hooks/useUserData";
import Plot from "react-plotly.js";

// export function BoxPlotChart() {
//   return (
//     <Plot
//       data={[
//         {
//           y: [7, 8, 9, 5, 6, 3, 4, 5, 7, 9],
//           x: ["데이터셋 1"],
//           type: "box",
//           name: "데이터셋 1",
//           boxpoints: "all", // 점도 표시
//           jitter: 0.3,
//           pointpos: -1.8,
//         },
//         {
//           y: [7, 8, 10, 5, 3, 3, 4, 5, 7, 9],
//           x: ["데이터셋 2"],
//           type: "box",
//           name: "데이터셋 1",
//           boxpoints: "all", // 점도 표시
//           jitter: 0.3,
//           pointpos: -1.8,
//         },
//       ]}
//       layout={{ width: 600, height: 400 }}
//     />
//   );
// }

export default function MainPage() {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const { refetchUser, refetchWorkspaces } = useUserData();
  useEffect(() => {
    refetchUser();
    refetchWorkspaces();
  }, []);
  return (
    <>
      <div className="main-container">
        <MainHeader onMenuToggle={() => setOpenMenu((prev) => !prev)} />
        <Myworkspace />
        <AnimatePresence>
          {openMenu && <MainMenu onClose={() => setOpenMenu(false)} />}
        </AnimatePresence>
      </div>
    </>
  );
}
