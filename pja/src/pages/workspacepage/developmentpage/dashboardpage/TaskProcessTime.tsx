import { getTaskProcessTime } from "../../../../services/listapi/DashboardApi";
import {
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
import type { processtime } from "../../../../types/list";
import { getSequentialColor } from "../../../../utils/colorUtils";
import { Gantt_COLORS } from "../../../../constants/colors";

export function TaskProcessTime() {
  const selectedWS = useSelector(
    (state: RootState) => state.workspace.selectedWS
  );

  // 사용자별 선형 그래프를 위한 데이터 변환 (ID 기반)
  const TransformLineData = (data: processtime[]) => {
    const importances = Array.from(new Set(data.map((d) => d.importance))).sort(
      (a, b) => a - b
    );

    // ID와 이름을 매핑하는 객체 생성
    const userMap = new Map<number, string>();
    data.forEach((d) => {
      if (!userMap.has(d.userId)) {
        userMap.set(d.userId, d.username);
      }
    });

    const userIds = Array.from(userMap.keys());

    const LinechartData = importances.map((imp) => {
      const obj: any = { importance: imp };
      userIds.forEach((userId) => {
        const item = data.find(
          (d) => d.userId === userId && d.importance === imp
        );
        obj[`user_${userId}`] = item?.meanHours ?? null;
      });
      return obj;
    });

    return { LinechartData, userIds, userMap };
  };

  const [processTime, setProcessTime] = useState<processtime[]>([]);
  const { LinechartData, userIds, userMap } = TransformLineData(processTime);

  useEffect(() => {
    const getprocesstime = async () => {
      try {
        const response = await getTaskProcessTime(selectedWS?.workspaceId ?? 0);
        if (!response.data) {
          console.log("평균 작업처리 데이터가 없습니다");
          return;
        }
        const processT = response.data;
        if (processT.length > 0) setProcessTime(processT);
      } catch {
        console.log("작업 시간 그래프 조회 실패");
      }
    };
    getprocesstime();
  }, [selectedWS]);

  return (
    <>
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
                  offset: -15,
                }}
              />
              <YAxis
                label={{
                  value: "시간 (h)",
                  angle: -90,
                  position: "insideLeft",
                  offset: -10,
                }}
              />
              <Tooltip
                labelFormatter={(label) => `중요도 ${label}`}
                formatter={(value: any, name: string) => {
                  const userId = parseInt(name.replace("user_", ""));
                  const userName = userMap.get(userId) || name;
                  return [value ? `${value}시간` : "데이터 없음", userName];
                }}
              />
              <Legend layout="vertical" align="right" verticalAlign="middle" />
              {userIds.map((userId, idx) => (
                <Line
                  key={userId}
                  type="monotone"
                  dataKey={`user_${userId}`}
                  stroke={getSequentialColor(Gantt_COLORS, idx)}
                  name={userMap.get(userId) || `User ${userId}`}
                  connectNulls
                  dot={{ r: 3 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </>
  );
}
