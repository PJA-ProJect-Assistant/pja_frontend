import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import type { IsClose } from "../../types/common";
import "./WsSideBar.css";
import { WSSidebarHeader } from "../header/WSSidebarHeader";

export default function WsSidebar({ onClose }: IsClose) {
  const selectedWS = useSelector(
    (state: RootState) => state.workspace.selectedWS
  );
  return (
    <motion.div
      className="wssidebar-container"
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: "0%", opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ type: "tween", duration: 0.3 }}
    >
      <WSSidebarHeader onClose={onClose} />
      <div></div>
    </motion.div>
  );
}
