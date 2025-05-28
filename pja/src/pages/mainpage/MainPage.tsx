import { useState } from "react";
import { MainHeader } from "../../components/header/MainHeader";
import { Myworkspace } from "./Myworkspace";
import MainMenu from "../../components/menu/MainMenu";
import { AnimatePresence } from "framer-motion";
import "./MainPage.css";

export default function MainPage() {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  return (
    <>
      <div className="maincontainer">
        <MainHeader onMenuToggle={() => setOpenMenu((prev) => !prev)} />
        <Myworkspace />
        <AnimatePresence>
          {openMenu && <MainMenu onClose={() => setOpenMenu(false)} />}
        </AnimatePresence>
      </div>
    </>
  );
}
