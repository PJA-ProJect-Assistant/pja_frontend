import { useState } from "react";
import type { TableData, Field } from "../../../types/erd";

export default function ERDEdit() {
  const [tables, setTables] = useState<TableData[]>([
    // 초기값은 API에서 받아오도록 후에 변경
  ]);

  const handleFieldChange = (
    tableIdx: number,
    fieldIdx: number,
    key: keyof Field,
    value: string
  ) => {
    const updated = [...tables];
    updated[tableIdx].fields[fieldIdx][key] = value;
    setTables(updated);
  };

  return (
    <div>
      {tables.map((table, tableIdx) => (
        <div key={tableIdx}>
          <h2>{table.tableName}</h2>
          {table.fields.map((field, fieldIdx) => (
            <div key={fieldIdx}>
              <input
                value={field.name}
                onChange={(e) =>
                  handleFieldChange(tableIdx, fieldIdx, "name", e.target.value)
                }
              />
              <input
                value={field.type}
                onChange={(e) =>
                  handleFieldChange(tableIdx, fieldIdx, "type", e.target.value)
                }
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
