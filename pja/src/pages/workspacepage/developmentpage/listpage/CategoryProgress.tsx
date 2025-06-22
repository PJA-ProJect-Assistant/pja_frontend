import type { feature_category } from "../../../../types/list";
import "./CategoryProgress.css";
import { PieChart, Pie, Cell } from "recharts";

export default function CategoryProgress({
  categoryList,
  totalCg,
  completeCg,
  completePg,
}: any) {

  console.log("categoryList", categoryList);
  console.log("totalCg", totalCg);
  console.log("completeCg", completeCg);
  console.log("completePg", completePg);

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
            .filter((cg: feature_category) => !cg.state)
            .map((cg: feature_category, index: number) => (
              <li key={`incomplete-${index}`}>{cg.name}</li>
            ))}

          {categoryList
            .filter((cg: feature_category) => cg.state)
            .map((cg: feature_category, index: number) => (
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
