import { useState } from "react";
import WsSidebar from "../../components/sidebar/WsSidebar";
import "./ApiPage.css";
import plusIcon from "../../assets/img/plus.png";
import minusIcon from "../../assets/img/minus.png";

const ApiPage = () => {
  //타입 명시
  type ApiRow = {
    id: number;
    category: string;
    feature: string;
    auth: string;
    method: string;
    url: string;
    io: string;
  };

  /*테이블 데이터를 배열 형태로 저장*/
  const [rows, setRows] = useState<ApiRow[]>([
    {
      id: Date.now(), // 고유 id 추가
      category: "Category",
      feature: "Feature",
      auth: "Auth",
      method: "Method",
      url: "URL",
      io: "request/response",
    },
  ]);

  // 행 추가
  const handleAddRow = () => {
    const newRow = {
      id: Date.now(), // 고유한 id 부여
      category: "",
      feature: "",
      auth: "",
      method: "",
      url: "",
      io: "",
    };
    setRows([...rows, newRow]);
  };

  // 해당 행 삭제
  // row.id !== id 로 해당 id만 제거
  const handleDeleteRow = (id: number) => {
    if (rows.length === 1) {
      alert("최소 1개의 행은 있어야 합니다!");
      return;
    }
    setRows(rows.filter((row) => row.id !== id));
  };

  //수정하기 버튼 클릭 시 input으로 변경
  const [isEditMode, setIsEditMode] = useState(false);

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };
  //셀 내용 변경
  const handleChange = (
    id: number,
    field: keyof Omit<ApiRow, "id">,
    value: string
  ) => {
    const updateRows = rows.map((row) =>
      row.id === id ? { ...row, [field]: value } : row
    );
    setRows(updateRows);
  };

  return (
    <div>
      <div className="api-wrapper">
        <WsSidebar />
        <div className="api-main">
          <h1 className="api-title">API 명세서</h1>
          <div className="api-alert">
            ✨아이디어와 명세서를 분석하여 API 추천을 해드려요
          </div>
          <div className="api-button-group">
            <button className="api-edit-button" onClick={toggleEditMode}>
              {isEditMode ? "수정완료" : "수정하기"}
            </button>
          </div>
          <table className="api-table">
            <thead>
              <tr>
                <th className="api-table-title">분류</th>
                <th className="api-table-title">기능</th>
                <th className="api-table-title">인증방식</th>
                <th className="api-table-title">http 매서드</th>
                <th className="api-table-title">api 경로</th>
                <th className="api-table-title">요청/응답</th>

                {/* ✅ 삭제 버튼 칼럼 */}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  {["category", "feature", "auth", "method", "url", "io"].map(
                    (field) => (
                      <td className="api-table-content" key={field}>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={row[field as keyof Omit<ApiRow, "id">]}
                            onChange={(e) =>
                              handleChange(
                                row.id,
                                field as keyof Omit<ApiRow, "id">,
                                e.target.value
                              )
                            }
                            className="api-edit-input"
                          />
                        ) : (
                          row[field as keyof Omit<ApiRow, "id">]
                        )}
                      </td>
                    )
                  )}

                  <td className="api-table-content no-border">
                    <button
                      className="api-delete-row-button"
                      onClick={() => handleDeleteRow(row.id)}
                    >
                      <img src={minusIcon} alt="삭제" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="api-button-group">
            <button className="api-add-button" onClick={handleAddRow}>
              <img src={plusIcon} alt="plusIcon" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiPage;
