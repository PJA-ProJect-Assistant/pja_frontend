// import { useState } from "react";
// import type { TableData, Field } from "../../../types/erd";

// export default function ERDEdit() {
//   const [tables, setTables] = useState<TableData[]>([
//     // 초기값은 API에서 받아오도록 후에 변경
//   ]);

//   const handleFieldChange = (
//     tableIdx: number,
//     fieldIdx: number,
//     key: keyof Field,
//     value: string | boolean
//   ) => {
//     setTables((prevTables) => {
//       const updated = [...prevTables];
//       const updatedTable = { ...updated[tableIdx] };
//       const updatedFields = [...updatedTable.fields];
//       const updatedField = { ...updatedFields[fieldIdx], [key]: value };

//       updatedFields[fieldIdx] = updatedField;
//       updatedTable.fields = updatedFields;
//       updated[tableIdx] = updatedTable;

//       return updated;
//     });
//   };

//   return (
//     <div>
//       {tables.map((table, tableIdx) => (
//         <div key={tableIdx}>
//           <h2>{table.tableName}</h2>
//           {table.fields.map((field, fieldIdx) => (
//             <div key={fieldIdx}>
//               <input
//                 value={field.name}
//                 onChange={(e) =>
//                   handleFieldChange(tableIdx, fieldIdx, "name", e.target.value)
//                 }
//               />
//               <input
//                 value={field.type}
//                 onChange={(e) =>
//                   handleFieldChange(tableIdx, fieldIdx, "type", e.target.value)
//                 }
//               />
//             </div>
//           ))}
//         </div>
//       ))}
//     </div>
//   );
// }
