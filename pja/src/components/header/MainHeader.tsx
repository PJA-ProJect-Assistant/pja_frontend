import "./MainHeader.css";
import { Users } from "../../constants/userconstants";
import type { IsOpen } from "../../types/common";

export function MainHeader({ onMenuToggle }: IsOpen) {
  return (
    <>
      <div className="mainheadercontainer">
        <div className="profile" onClick={onMenuToggle}>
          {Users.name.charAt(0)}
        </div>
        <h1>{Users.name}님의 워크스페이스</h1>
        <div className="div-right"></div>
      </div>
    </>
  );
}
