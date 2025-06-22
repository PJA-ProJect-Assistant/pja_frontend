import type { Importance } from "../../types/list";
import "./ImportantCell.css"
type Props = {
    value?: Importance; // 중요도 값 (0 ~ 5)
    onChange: (newValue: Importance) => void;
    disable: boolean;
};

const MAX_IMPORTANCE = 5;

export const ImportanceCell = ({ value = 0, onChange, disable }: Props) => {
    return (
        <div className="importance-cell-container">
            {Array.from({ length: MAX_IMPORTANCE }, (_, i) => {
                const level = (i + 1) as Importance;
                const isFilled = level <= value;

                return (
                    <span
                        key={level}
                        className={`importance-dot ${isFilled ? "filled" : ""}`}
                        onClick={() => onChange(level)}
                        title={`중요도 ${level}`}
                        style={{
                            cursor: disable ? 'default' : 'pointer'
                        }}
                    />
                );
            })}
        </div>
    );
};