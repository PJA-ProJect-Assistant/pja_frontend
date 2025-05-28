import type { IsClose } from "../../types/common";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Users } from "../../constants/userconstants";
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
    <div className="mainmenu-overlay">
      <motion.div
        className="mainmenu-container"
        ref={menuRef}
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: "0%", opacity: 1 }}
        exit={{ x: "-100%", opacity: 0 }}
        transition={{ type: "tween", duration: 0.3 }}
      >
        <div className="mainmenu-layout">
          <div className="mainmenu-profile">{Users.name.charAt(0)}</div>
          <p className="mainmenu-username">{Users.name}</p>
          <div className="mainmenu-list">
            <p>계정설정</p>
            <p>공지</p>
            <p>로그아웃</p>
            <p>탈퇴</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
