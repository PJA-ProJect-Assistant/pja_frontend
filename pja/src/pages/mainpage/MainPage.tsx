import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { PROFILE_COLORS } from "../../constants/colors";
import ERDiagram from "../../ERDiagram";

export default function MainPage() {
  return (
    <>
      <div>
        <h1>메인페이지</h1>
        <ERDiagram />
      </div>
    </>
  );
}
