import { useEffect } from "react";
import { MainHeader } from "../../components/header/MainHeader";
import { Myworkspace } from "./Myworkspace";
import "./MainPage.css";

export default function MainPage() {
  return (
    <>
      <div className="maincontainer">
        <MainHeader />
        <Myworkspace />
      </div>
    </>
  );
}
