import { useState, useRef, useEffect } from "react";
import type { Status } from "../../types/list";
import "./ActionStatusCell.css"; // CSS 파일 임포트
import { statusLabels, statusColors } from "../../constants/statecolor";

interface StatusCellProps {
  status: Status;
  onChange: (newStatus: Status) => void;
  disable: boolean;
}

export const ActionStatusCell = ({
  status,
  onChange,
  disable,
}: StatusCellProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleSelect = (newStatus: Status) => {
    console.log("selected status:", newStatus);
    onChange(newStatus);
    setIsEditing(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsEditing(false);
      }
    };

    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing]);

  return (
    <div className="status-td">
      {isEditing && !disable ? (
        <div className="status-dropdown" ref={dropdownRef}>
          {(
            ["BEFORE", "IN_PROGRESS", "DONE", "PENDING", "DELETE"] as Status[]
          ).map((s) => (
            <div
              key={s}
              className="status-option"
              onClick={() => handleSelect(s)}
            >
              <span
                className="status-dot"
                style={{ backgroundColor: statusColors[s] }}
              />
              <span>{statusLabels[s]}</span>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="status-display"
          onClick={() => setIsEditing(true)}
          style={{
            cursor: disable ? "default" : "pointer",
          }}
        >
          <span
            className="status-dot"
            style={{
              backgroundColor: statusColors[status],
            }}
          />
          <span>{statusLabels[status]}</span>
        </div>
      )}
    </div>
  );
};
