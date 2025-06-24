import { useSelector } from "react-redux";
import { statusLabels, statusColors } from "../../../../constants/statecolor";
import type { Importance, Status, taskimbalance } from "../../../../types/list";
import type { RootState } from "../../../../store/store";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getTaskImbalance } from "../../../../services/listapi/DashboardApi";

type TransformBarData = {
  importance: Importance;
} & Record<Status, number | undefined>;

export function TaskImbalance() {
  const selectedWS = useSelector(
    (state: RootState) => state.workspace.selectedWS
  );
  const [allUserData, setAllUserData] = useState<taskimbalance[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [userList, setUserList] = useState<
    { memberId: number; username: string }[]
  >([]);

  const getimblance = async () => {
    try {
      const response = await getTaskImbalance(selectedWS?.workspaceId ?? 0);
      const data = response.data ?? [];
      console.log("data :", data);

      // 전체 데이터 저장
      if (data.length > 0) setAllUserData(data);

      // 사용자 목록 생성 (중복 제거)
      const users = data.reduce((acc, item) => {
        const existingUser = acc.find(
          (user) => user.memberId === item.memberId
        );
        if (!existingUser) {
          acc.push({ memberId: item.memberId, username: item.username });
        }
        return acc;
      }, [] as { memberId: number; username: string }[]);

      setUserList(users);

      // 첫 번째 사용자를 기본 선택
      if (users.length > 0 && selectedUser === null) {
        setSelectedUser(users[0].memberId);
      }
    } catch {
      console.log("일 분균형 그래프 가져오기 실패");
    }
  };

  const generateChartData = (userId: number): TransformBarData[] => {
    const userTasks = allUserData.filter((item) => item.memberId === userId);

    const grouped: Record<Importance, TransformBarData> = {} as Record<
      Importance,
      TransformBarData
    >;

    userTasks.forEach(({ importance, state, taskCount }) => {
      if (!grouped[importance]) {
        grouped[importance] = { importance } as TransformBarData;
      }
      grouped[importance][state] = taskCount;
    });

    return Object.values(grouped).sort((a, b) => a.importance - b.importance);
  };

  // 현재 선택된 사용자의 차트 데이터
  const currentChartData = selectedUser ? generateChartData(selectedUser) : [];
  const selectedUsername =
    userList.find((user) => user.memberId === selectedUser)?.username || "";

  useEffect(() => {
    getimblance();
  }, []);
  return (
    <>
      {userList.length > 0 && (
        <>
          <div style={{ margin: "20px" }}>
            <label htmlFor="user-select" style={{ marginRight: "10px" }}>
              담당자 선택:
            </label>
            <select
              id="user-select"
              value={selectedUser || ""}
              onChange={(e) => setSelectedUser(Number(e.target.value))}
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                minWidth: "150px",
              }}
            >
              <option value="">담당자를 선택하세요</option>
              {userList.map((user) => (
                <option key={user.memberId} value={user.memberId}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>

          {selectedUser && currentChartData.length > 0 && (
            <>
              <p>{selectedUsername}님의 작업 불균형 분석 그래프</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={currentChartData} barCategoryGap="20%">
                  <XAxis
                    dataKey="importance"
                    label={{
                      value: "중요도",
                      position: "insideBottom",
                      offset: -5,
                    }}
                  />
                  <YAxis
                    label={{
                      value: "작업 수",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip />
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                  />
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

          {selectedUser && currentChartData.length === 0 && (
            <p>{selectedUsername}님의 작업 데이터가 없습니다.</p>
          )}
        </>
      )}
    </>
  );
}
