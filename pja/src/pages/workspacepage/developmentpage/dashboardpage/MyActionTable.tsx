import { useEffect, useState } from "react";
import { ActionStatusCell } from "../../../../components/cells/ActionStatusCell";
import DateSelectCell from "../../../../components/cells/DateSelectCell";
import { ImportanceCell } from "../../../../components/cells/ImportantCell";
import "./MyActionTable.css"
import { getMyAction } from "../../../../services/listapi/DashboardApi";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import type { myActionList } from "../../../../types/list";

export function MyActionTable() {
    const selectedWS = useSelector(
        (state: RootState) => state.workspace.selectedWS
    );
    const [myAcList, setMyAcList] = useState<myActionList[]>([]);
    const getmyaclist = async () => {
        if (selectedWS?.workspaceId) {
            try {
                const response = await getMyAction(selectedWS.workspaceId);
                setMyAcList(response.data ?? []);
            }
            catch {
                console.log("내 액션 리스트 가져오기 실패");
            }
        }
    }
    useEffect(() => {
        getmyaclist();
    }, [])
    return (
        <div className="myactable-container">
            <p>내 작업</p>
            <div className="myaction-tablescroll">
                <table className="myaction-table">
                    <thead>
                        <tr>
                            <th>이름</th>
                            <th>마감일</th>
                            <th>상태</th>
                            <th>중요도</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myAcList.map((ac) => (
                            <tr key={ac.actionId}>
                                <td>
                                    <div className="myaclist-name">
                                        <svg
                                            className="myaclist-icon"
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="20px"
                                            viewBox="0 -960 960 960"
                                            width="20px"
                                            fill="#FFF"
                                        >
                                            <path d="M336-240h288v-72H336v72Zm0-144h288v-72H336v72ZM263.72-96Q234-96 213-117.15T192-168v-624q0-29.7 21.15-50.85Q234.3-864 264-864h312l192 192v504q0 29.7-21.16 50.85Q725.68-96 695.96-96H263.72ZM528-624v-168H264v624h432v-456H528ZM264-792v189-189 624-624Z" />
                                        </svg>
                                        <span title={ac.actionName}>{ac.actionName}</span>
                                    </div>
                                </td>
                                <td>
                                    <DateSelectCell
                                        value={ac.endDate ?? null}
                                        disable={true}
                                        onChange={() => {
                                            return;
                                        }}
                                    />
                                </td>
                                <td>
                                    <ActionStatusCell
                                        status={ac.state}
                                        disable={true}
                                        onChange={() => {
                                            return;
                                        }}
                                    />
                                </td>
                                <td>
                                    <ImportanceCell
                                        value={ac.importance ?? 0}
                                        disable={true}
                                        onChange={() => {
                                            return;
                                        }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div >
    );
}