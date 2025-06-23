import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import "./GraphBox.css";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import { useEffect, useState } from "react";
import {
  getTaskImbalance,
  getTaskProcessTime,
} from "../../../../services/listapi/DashboardApi";
import type { Importance, processtime, Status } from "../../../../types/list";
import { getSequentialColor } from "../../../../utils/colorUtils";
import { Gantt_COLORS } from "../../../../constants/colors";

const statusLabels: Record<Status, string> = {
  BEFORE: "진행 전",
  IN_PROGRESS: "진행 중",
  DONE: "완료",
  PENDING: "보류",
  DELETE: "삭제",
};

const statusColors: Record<Status, string> = {
  BEFORE: "#d9d9d6",
  IN_PROGRESS: "#fec300",
  DONE: "#fe5000",
  PENDING: "#50b5ff",
  DELETE: "#ff4d4f",
};

type TransformBarData = {
  importance: Importance;
} & Record<Status, number | undefined>;

// 사용자별 선형 그래프를 위한 데이터 변환
const TransformLineData = (data: processtime[]) => {
  const importances = Array.from(new Set(data.map((d) => d.importance))).sort(
    (a, b) => a - b
  );

  const userIds = Array.from(new Set(data.map((d) => d.userId)));

  const LinechartData = importances.map((imp) => {
    const obj: any = { importance: imp };
    userIds.forEach((uid) => {
      const item = data.find((d) => d.userId === uid && d.importance === imp);
      obj[`user${uid}`] = item?.meanHours ?? null;
    });
    return obj;
  });

  return { LinechartData, userIds };
};

export function GraphBox() {
  const selectedWS = useSelector(
    (state: RootState) => state.workspace.selectedWS
  );
  const [chartData, setChartData] = useState<TransformBarData[]>([]);
  const [processTime, setProcessTime] = useState<processtime[]>([]);
  const { LinechartData, userIds } = TransformLineData(processTime);
  useEffect(() => {
    const getimblance = async () => {
      try {
        const response = await getTaskImbalance(selectedWS?.workspaceId ?? 0);
        const data = response.data ?? [];
        console.log("data :", data);

        // 데이터 변환
        const grouped: Record<Importance, TransformBarData> = {} as Record<
          Importance,
          TransformBarData
        >;
        data.forEach(({ importance, state, taskCount }) => {
          if (!grouped[importance]) {
            grouped[importance] = { importance } as TransformBarData;
          }
          grouped[importance][state] = taskCount;
        });

        const sorted = Object.values(grouped).sort(
          (a, b) => a.importance - b.importance
        );
        setChartData(sorted);
      } catch {
        console.log("일 분균형 그래프 가져오기 실패");
      }
    };
    const getprocesstime = async () => {
      try {
        const response = await getTaskProcessTime(selectedWS?.workspaceId ?? 0);
        const processT = response.data ?? [];
        console.log("processT :", processT);
        setProcessTime(processT);
      } catch {
        console.log("작업 시간 그래프 조회 실패");
      }
    };
    getprocesstime();
    getimblance();
  }, [selectedWS]);
  return (
    <div className="graph-container">
      {chartData.length > 0 && (
        <>
          <p>담당자 불균형 분석 그래프</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} barCategoryGap="20%">
              <XAxis
                dataKey="importance"
                label={{
                  value: "중요도",
                  position: "insideBottom",
                  offset: -5,
                }}
              />
              <YAxis
                label={{ value: "작업 수", angle: -90, position: "insideLeft" }}
              />
              <Tooltip />
              <Legend layout="vertical" align="right" verticalAlign="middle" />
              {Object.keys(statusLabels).map((status) => (
                <Bar
                  key={status}
                  dataKey={status}
                  name={statusLabels[status as Status]}
                  fill={statusColors[status as Status]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
      {LinechartData.length > 0 && (
        <>
          <p>중요도별 평균 작업 시간</p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={LinechartData}
              margin={{ top: 20, right: 40, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="importance"
                tickFormatter={(tick) => `중요도 ${tick}`}
                label={{
                  value: "중요도",
                  position: "insideBottom",
                  offset: -5,
                }}
              />
              <YAxis
                label={{
                  value: "시간 (h)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip />
              <Legend layout="vertical" align="right" verticalAlign="middle" />
              {userIds.map((uid, idx) => (
                <Line
                  key={uid}
                  type="monotone"
                  dataKey={`user${uid}`}
                  stroke={getSequentialColor(Gantt_COLORS, idx)}
                  name={`사용자 ${uid}`}
                  connectNulls
                  dot={{ r: 3 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}
