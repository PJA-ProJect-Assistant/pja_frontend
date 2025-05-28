import { motion } from "framer-motion";
import type { IsClose } from "../../types/common";
import "./WsSideBar.css";
export default function WsSidebar({ onClose }: IsClose) {
  return (
    <motion.div
      className="wssidebar-container"
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: "0%", opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ type: "tween", duration: 0.3 }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#000000"
        onClick={onClose}
      >
        <path d="M440-280v-400L240-480l200 200Zm80 160h80v-720h-80v720Z" />
      </svg>
    </motion.div>
  );
}
