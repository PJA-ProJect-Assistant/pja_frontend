import { useEffect, useRef, useState } from "react";
import { useCategoryFeatureCategory } from "../../../../hooks/useCategoryFeatureAction";
import "./GanttChartPage.css";
import { getSequentialColor } from "../../../../utils/colorUtils";
import { Gantt_COLORS } from "../../../../constants/colors";

type Task = {
  action_id: number;
  name: string;
  start_date: Date; // yyyy-mm-dd
  end_date: Date; // yyyy-mm-dd
};

const tasks: Task[] = [
  {
    action_id: 1,
    name: "기획",
    start_date: new Date("2025-06-01"),
    end_date: new Date("2025-06-05"),
  },
  {
    action_id: 2,
    name: "디자인",
    start_date: new Date("2025-06-04"),
    end_date: new Date("2025-06-10"),
  },
  {
    action_id: 3,
    name: "로그인",
    start_date: new Date("2025-06-08"),
    end_date: new Date("2025-06-15"),
  },
  {
    action_id: 4,
    name: "회원가입",
    start_date: new Date("2025-06-10"),
    end_date: new Date("2025-06-15"),
  },
  {
    action_id: 5,
    name: "메인페이지 개발",
    start_date: new Date("2025-06-04"),
    end_date: new Date("2025-06-12"),
  },
  {
    action_id: 6,
    name: "API 연결",
    start_date: new Date("2025-06-18"),
    end_date: new Date("2025-06-25"),
  },
  {
    action_id: 7,
    name: "구글로그인 추가",
    start_date: new Date("2025-06-11"),
    end_date: new Date("2025-06-13"),
  },
  {
    action_id: 8,
    name: "좀 더 간단하게 디자인 수정",
    start_date: new Date("2025-06-20"),
    end_date: new Date("2025-06-20"),
  },
  {
    action_id: 9,
    name: "애니메이션 효과 넣기",
    start_date: new Date("2025-06-10"),
    end_date: new Date("2025-06-19"),
  },
];

function dateDiffInDays(a: Date, b: Date) {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.floor(
    (Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) -
      Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) /
      _MS_PER_DAY
  );
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10); // yyyy-mm-dd
}

export default function GanttChartPage() {
  const { actionsByFeatureId } = useCategoryFeatureCategory();

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const scrollStartX = useRef(0);

  const startDates = tasks.map((t) => new Date(t.start_date));
  const endDates = tasks.map((t) => new Date(t.end_date));
  const chartStart = new Date(Math.min(...startDates.map((d) => d.getTime())));
  const chartEnd = new Date(Math.max(...endDates.map((d) => d.getTime())));
  const totalDays = dateDiffInDays(chartStart, chartEnd);
  const today = formatDate(new Date());

  const dates: string[] = [];
  for (let i = 0; i <= totalDays; i++) {
    const d = new Date(chartStart);
    d.setDate(d.getDate() + i);
    dates.push(formatDate(d));
  }

  const CELL_WIDTH = 80;

  useEffect(() => {
    // 오늘 날짜를 가운데로 스크롤
    if (!containerRef.current || !contentRef.current) return;
    const todayIndex = dates.indexOf(today);
    if (todayIndex === -1) return;

    const scrollTo =
      todayIndex * CELL_WIDTH -
      containerRef.current.clientWidth / 2 +
      CELL_WIDTH / 2;
    containerRef.current.scrollLeft = scrollTo > 0 ? scrollTo : 0;
  }, []);

  // 드래그 핸들링
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    scrollStartX.current = containerRef.current?.scrollLeft || 0;
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const dx = e.clientX - dragStartX.current;
    containerRef.current.scrollLeft = scrollStartX.current - dx;
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      className="gantt-container"
      ref={containerRef}
      onMouseDown={onMouseDown}
    >
      <div
        className="gantt-drag-area"
        ref={contentRef}
        style={{ width: dates.length * CELL_WIDTH }}
      >
        <div className="gantt-content">
          <div
            className="gantt-chart"
            style={{ width: dates.length * CELL_WIDTH }}
          >
            {/* 날짜 칼럼 (absolute, 맨 아래 깔림) */}
            <div className="gantt-date-columns">
              {dates.map((date) => {
                const isToday = date === today;
                return (
                  <div
                    key={date}
                    className={`gantt-date-column ${isToday ? "today" : ""}`}
                  >
                    <div className="gantt-date-label">{date.slice(5)}</div>
                  </div>
                );
              })}
            </div>

            {/* 태스크 바 (absolute, 위에 올라옴) */}
            {tasks.map((task, i) => {
              const left =
                dateDiffInDays(chartStart, new Date(task.start_date)) *
                CELL_WIDTH;
              const width =
                (dateDiffInDays(
                  new Date(task.start_date),
                  new Date(task.end_date)
                ) +
                  1) *
                CELL_WIDTH;

              return (
                <div
                  key={task.action_id}
                  className="gantt-task-bar"
                  style={{
                    top: i * 30 + 30, // 💡 날짜 라벨 높이 + 여백
                    left,
                    width,
                    backgroundColor: getSequentialColor(Gantt_COLORS, i),
                  }}
                >
                  <span className="gantt-task-name" title={`${task.name}`}>
                    {task.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
