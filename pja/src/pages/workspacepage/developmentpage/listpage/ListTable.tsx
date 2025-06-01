import "./ListTable.css"
import { featureCategories } from "../../../../constants/listconstant"
import { features } from "../../../../constants/listconstant";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import { useEffect, useState } from "react";
import type { feature_category } from "../../../../types/list";
import React from "react";

export default function ListTable() {
    const [categoryList, setCategoryList] = useState<feature_category[]>([]);
    const [clickCg, setClickCg] = useState<{ [key: number]: boolean }>({}); // 각 카테고리 클릭 상태 저장

    const selectedWS = useSelector(
        (state: RootState) => state.workspace.selectedWS
    );

    const isCategoryCompletable = (categoryId: number) => {
        const children = features.filter((ft) => ft.category_id === categoryId);
        return children.every(ft => ft.state === true);
    };

    useEffect(() => {
        const category = featureCategories.filter(
            (cg) => cg.workspace_id === selectedWS?.workspace_id
        )
            .sort((a, b) => Number(a.state) - Number(b.state));
        setCategoryList(category);
        setClickCg({}); // 워크스페이스 변경 시 상태 초기화
    }, [selectedWS]);

    const toggleClick = (index: number) => {
        setClickCg((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };
    const handleCompleteClick = (categoryId: number) => {
        // 카테고리 완료 상태 업데이트
        const updatedList = categoryList.map((cg) =>
            cg.feature_catefory_id === categoryId ? { ...cg, state: true } : cg
        );

        // 정렬: 완료 안 된 것 먼저, 완료된 것 나중
        updatedList.sort((a, b) => Number(a.state) - Number(b.state));

        setCategoryList(updatedList);
    };

    return (
        <div>
            <table className="feature-table">
                <thead>
                    <tr>
                        <th>이름</th>
                        <th>시작일</th>
                        <th>마감일</th>
                        <th>참여자</th>
                        <th>상태</th>
                        <th>중요도</th>
                        <th>테스트 여부</th>
                    </tr>
                </thead>
                <tbody>
                    {categoryList.map((cg, index) => (
                        <React.Fragment key={index}>
                            <tr>
                                <td>
                                    <div className="cglist-name">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="20px"
                                            viewBox="0 -960 960 960"
                                            width="20px"
                                            fill="#000000"
                                            onClick={() => toggleClick(index)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <path d="M522-480 333-669l51-51 240 240-240 240-51-51 189-189Z" />
                                        </svg>
                                        <svg
                                            className="cglist-icon"
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="20px"
                                            viewBox="0 -960 960 960"
                                            width="20px"
                                            fill="#FFFFFF"
                                        >
                                            <path d="M48-144v-72h864v72H48Zm120-120q-29.7 0-50.85-21.15Q96-306.3 96-336v-408q0-29.7 21.15-50.85Q138.3-816 168-816h624q29.7 0 50.85 21.15Q864-773.7 864-744v408q0 29.7-21.15 50.85Q821.7-264 792-264H168Zm0-72h624v-408H168v408Z" />
                                        </svg>
                                        <span>{cg.name}</span>
                                    </div>
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>
                                    <button
                                        className="list-completebtn"
                                        disabled={!isCategoryCompletable(cg.feature_catefory_id) || cg.state}
                                        onClick={() => handleCompleteClick(cg.feature_catefory_id)}
                                    >
                                        완료하기
                                    </button>
                                </td>
                                <td></td>
                                <td>{cg.has_test ? "✅" : "❌"}</td>
                            </tr>

                            {clickCg[index] &&
                                features
                                    .filter((ft) => ft.category_id === cg.feature_catefory_id)
                                    .map((ft, subIdx) => (
                                        <tr key={`ft-${index}-${subIdx}`}>
                                            <td>
                                                <div className="ftlist-name">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        height="20px"
                                                        viewBox="0 -960 960 960"
                                                        width="20px"
                                                        fill="#000000"
                                                    >
                                                        <path d="M522-480 333-669l51-51 240 240-240 240-51-51 189-189Z" />
                                                    </svg>
                                                    <svg
                                                        className="ftlist-icon"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        height="20px"
                                                        viewBox="0 -960 960 960"
                                                        width="20px"
                                                        fill="#FFFFFF"
                                                    >
                                                        <path d="M168-192q-29 0-50.5-21.5T96-264v-432q0-29.7 21.5-50.85Q139-768 168-768h216l96 96h312q29.7 0 50.85 21.15Q864-629.7 864-600v336q0 29-21.15 50.5T792-192H168Zm0-72h624v-336H450l-96-96H168v432Zm0 0v-432 432Z" />
                                                    </svg>
                                                    <span>{ft.name}</span>
                                                </div>
                                            </td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>{ft.state ? "✅" : "❌"}</td>
                                            <td></td>
                                            <td>{ft.has_test ? "✅" : "❌"}</td>
                                        </tr>
                                    ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
