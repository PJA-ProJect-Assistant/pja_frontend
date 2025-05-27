import type { IsClose } from "../../types/common";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "./MainMenu.css";

export default function MainMenu({ onClose }: IsClose) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);
  return (
    <div className="menu-overlay">
      <motion.div
        className="mainmenu-container"
        ref={menuRef}
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: "0%", opacity: 1 }}
        exit={{ x: "-100%", opacity: 0 }}
        transition={{ type: "tween", duration: 0.3 }}
      >
        <button onClick={onClose}>닫기</button>
        <div>메인메뉴</div>
      </motion.div>
    </div>
  );
}
