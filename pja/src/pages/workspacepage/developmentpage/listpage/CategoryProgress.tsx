import "./CategoryProgress.css";
import { PieChart, Pie, Cell } from "recharts";
import { useEffect, useState } from "react";
import { useCategoryFeatureCategory } from "../../../../hooks/useCategoryFeatureAction";

console.log("📄 categoryprogress.tsx 파일 로드됨!");

export default function CategoryProgress() {
  const [totalCg, setTotalCg] = useState<number>();
  const [completeCg, setCompleteCg] = useState<number>();
  const [completePg, setCompletePg] = useState<number>();

  const { categoryList, workspaceId } = useCategoryFeatureCategory();

  useEffect(() => {
    console.log("categoryList updated:", categoryList);

    if (workspaceId) {
      setTotalCg(categoryList.length);
      let completedCount = 0;
      for (const cg of categoryList) {
        if (cg.state) completedCount++;
      }
      setCompleteCg(completedCount);
      setCompletePg((completedCount / categoryList.length) * 100);
    } else {
      console.log("❌ workspaceId가 없어서 계산 스킵");
    }
  }, [categoryList]);

  const data = [
    { name: "완료", value: completePg ?? 0 },
    { name: "미완료", value: 100 - (completePg ?? 0) },
  ];

  const COLORS = ["#FE5000", "#d9d9d6"];
  return (
    <div className="categorypg-container">
      <div className="categorypg-pie">
        <PieChart width={200} height={200}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            dataKey="value"
            stroke="none"
            startAngle={90}
            endAngle={-270}
            style={{ pointerEvents: "none" }}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
        <div className="categorypg-pietxt">
          <p>전체진행률</p>
          <p>
            {completeCg}/{totalCg}
          </p>
        </div>
      </div>
      <div className="categorypg-list">
        <p>카테고리</p>
        <ul>
          {categoryList
            .filter((cg) => !cg.state)
            .map((cg, index) => (
              <li key={`incomplete-${index}`}>{cg.name}</li>
            ))}

          {categoryList
            .filter((cg) => cg.state)
            .map((cg, index) => (
              <li
                key={`complete-${index}`}
                style={{ textDecoration: "line-through" }}
              >
                {cg.name}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
