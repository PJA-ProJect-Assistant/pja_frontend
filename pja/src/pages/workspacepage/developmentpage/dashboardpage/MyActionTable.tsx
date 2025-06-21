import { ActionStatusCell } from "../../../../components/cells/ActionStatusCell";
import DateSelectCell from "../../../../components/cells/DateSelectCell";
import { ImportanceCell } from "../../../../components/cells/ImportantCell";
import "./MyActionTable.css"

export function MyActionTable() {
    return (
        <div className="myactable-container">
            <p>내 작업</p>
            <table className="myaction-table">
                <thead>
                    <tr>
                        <th>이름</th>
                        <th>시작일</th>
                        <th>마감일</th>
                        <th>상태</th>
                        <th>중요도</th>
                    </tr>
                </thead>
                <tbody>
                    {/* {aiList.recommendedActions.map((ai, index) => (
                        <tr key={ai.name}>
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
                                    <span title={ai.name}>{ai.name}</span>
                                </div>
                            </td>
                            <td>
                                <DateSelectCell
                                    value={ai.startDate ?? null}
                                    disable={true}
                                    onChange={() => {
                                        return;
                                    }}
                                />
                            </td>
                            <td>
                                <DateSelectCell
                                    value={ai.endDate ?? null}
                                    disable={true}
                                    onChange={() => {
                                        return;
                                    }}
                                />
                            </td>
                            <td>
                                <ActionStatusCell
                                    status={ai.state}
                                    disable={true}
                                    onChange={() => {
                                        return;
                                    }}
                                />
                            </td>
                            <td>
                                <ImportanceCell
                                    value={ai.importance ?? 0}
                                    onChange={() => {
                                        return;
                                    }}
                                />
                            </td>
                        </tr>
                    ))} */}
                </tbody>
            </table>
        </div>
    );
}