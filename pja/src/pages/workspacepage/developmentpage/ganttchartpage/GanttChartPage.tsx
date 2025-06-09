import { useEffect, useRef, useState } from "react";
import { useCategoryFeatureCategory } from "../../../../hooks/useCategoryFeatureAction";
import "./GanttChartPage.css"

type Task = {
    id: string;
    name: string;
    start: string; // yyyy-mm-dd
    end: string;   // yyyy-mm-dd
};

const tasks: Task[] = [
    { id: "1", name: "기획", start: "2025-06-01", end: "2025-06-05" },
    { id: "2", name: "디자인", start: "2025-06-04", end: "2025-06-10" },
    { id: "3", name: "개발", start: "2025-06-08", end: "2025-06-15" },
    { id: "4", name: "기획", start: "2025-06-01", end: "2025-06-05" },
    { id: "5", name: "디자인", start: "2025-06-04", end: "2025-06-10" },
    { id: "6", name: "개발", start: "2025-06-08", end: "2025-06-15" },
    { id: "7", name: "기획", start: "2025-06-01", end: "2025-06-05" },
    { id: "8", name: "디자인", start: "2025-06-04", end: "2025-06-10" },
    { id: "9", name: "개발", start: "2025-06-08", end: "2025-06-15" },
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
    const {
        actionsByFeatureId,
    } = useCategoryFeatureCategory();

    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartX = useRef(0);
    const scrollStartX = useRef(0);

    const startDates = tasks.map((t) => new Date(t.start));
    const endDates = tasks.map((t) => new Date(t.end));
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

        const scrollTo = todayIndex * CELL_WIDTH - containerRef.current.clientWidth / 2 + CELL_WIDTH / 2;
        containerRef.current.scrollLeft = scrollTo > 0 ? scrollTo : 0;
    }, [dates, today]);

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
                    {/* 날짜 축 */}
                    <div className="gantt-date-row">
                        {dates.map((date) => (
                            <div key={date} className="gantt-date-cell">
                                {date.slice(5)}
                            </div>
                        ))}
                    </div>

                    {/* 바 영역 */}
                    <div
                        className="gantt-chart"
                        style={{ height: tasks.length * 30, width: dates.length * CELL_WIDTH }}
                    >
                        {tasks.map((task, i) => {
                            const left = dateDiffInDays(chartStart, new Date(task.start)) * CELL_WIDTH;
                            const width =
                                (dateDiffInDays(new Date(task.start), new Date(task.end)) + 1) *
                                CELL_WIDTH;
                            return (
                                <div
                                    key={task.id}
                                    className="gantt-task-bar"
                                    style={{
                                        top: i * 30,
                                        left,
                                        width,
                                    }}
                                    title={`${task.name} (${task.start} ~ ${task.end})`}
                                >
                                    {task.name}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}