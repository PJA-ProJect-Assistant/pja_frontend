import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../../store/store";
import { WSHeader } from "../../../components/header/WSHeader"

export default function ERDPage() {
    const dispatch = useDispatch();
    const selectedWS = useSelector(
        (state: RootState) => state.workspace.selectedWS
    );
    return (
        <>
            <WSHeader title="ERD 생성" />
        </>
    )
}