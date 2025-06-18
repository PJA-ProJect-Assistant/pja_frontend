import type { Node, Edge } from "reactflow";
import { MarkerType } from "reactflow";
import type { ERDRelation, ERDTable } from "../../../types/erd";

export function generateEdgesFromData(relations: ERDRelation[]): Edge[] {
  return relations.map((rel) => ({
    id: rel.id,
    source: rel.source,
    target: rel.target,
    sourceHandle: rel.sourceHandle,
    targetHandle: rel.targetHandle,
    label: rel.label,
    animated: true,
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    style: { stroke: "#555" },
  }));
}

export function generateNodesFromData(tables: ERDTable[]): Node[] {
  return tables.map((table, index) => ({
    id: table.id,
    type: "tableNode", // ReactFlow에서 등록된 nodeType 이름 (예: "tableNode")
    position: { x: 100 + index * 300, y: 100 },
    data: {
      tableName: table.tableName,
      fields: table.fields,
    },
  }));
}

// import { Handle, Position } from "reactflow";
// import type { Edge, NodeProps, NodeTypes } from "reactflow";
// import { getRandomColor } from "../../../utils/colorUtils";
// import "./ERDPage.css";
// import type { TableData } from "../../../types/erd";

// export const nodeTypes: NodeTypes = {
//   tableNode: TableNode,
// };

// // ERD 테이블 정의
// export const tableData: { id: string; data: TableData }[] = [
//   {
//     id: "users",
//     data: {
//       tableName: "Users",
//       fields: [
//         { name: "id", type: "INT", isPrimary: true },
//         { name: "username", type: "VARCHAR(50)" },
//         { name: "email", type: "VARCHAR(100)" },
//       ],
//     },
//   },
//   {
//     id: "posts",
//     data: {
//       tableName: "Posts",
//       fields: [
//         { name: "id", type: "INT", isPrimary: true },
//         { name: "user_id", type: "INT", isForeign: true },
//         { name: "title", type: "VARCHAR(200)" },
//         { name: "content", type: "TEXT" },
//       ],
//     },
//   },
//   {
//     id: "comments",
//     data: {
//       tableName: "Comments",
//       fields: [
//         { name: "id", type: "INT", isPrimary: true },
//         { name: "post_id", type: "INT", isForeign: true },
//         { name: "user_id", type: "INT", isForeign: true },
//         { name: "comment", type: "TEXT" },
//       ],
//     },
//   },
//   {
//     id: "categories",
//     data: {
//       tableName: "Categories",
//       fields: [
//         { name: "id", type: "INT", isPrimary: true },
//         { name: "name", type: "VARCHAR(100)" },
//       ],
//     },
//   },
//   {
//     id: "post_categories",
//     data: {
//       tableName: "Post_Categories",
//       fields: [
//         { name: "post_id", type: "INT", isPrimary: true, isForeign: true },
//         {
//           name: "category_id",
//           type: "INT",
//           isPrimary: true,
//           isForeign: true,
//         },
//       ],
//     },
//   },
// ];

// 노드 생성 함수 (2열 종대 배치)
// export function generateNodesFromData(data: { id: string; data: TableData }[]) {
//   const gapX = 550;
//   const gapY = 220;

//   return data.map((table, index) => {
//     const col = index % 2;
//     const row = Math.floor(index / 2);
//     return {
//       id: table.id,
//       type: "tableNode",
//       data: table.data,
//       position: { x: col * gapX, y: row * gapY },
//     };
//   });
// }

// 외래키 연결 엣지들
// export const initialEdges: Edge[] = [
//   {
//     id: "posts-user",
//     source: "posts",
//     target: "users",
//     sourceHandle: "source-user_id",
//     targetHandle: "target-id",
//     type: "smoothstep",
//     animated: true,
//     style: { stroke: getRandomColor(), strokeWidth: 2 },
//     labelStyle: { fill: "#0ea5e9", fontWeight: "bold", fontSize: 12 },
//   },
//   {
//     id: "comments-user",
//     source: "comments",
//     target: "users",
//     sourceHandle: "source-user_id",
//     targetHandle: "target-id",
//     type: "smoothstep",
//     animated: true,
//     style: { stroke: getRandomColor(), strokeWidth: 2 },
//     labelStyle: { fill: "#10b981", fontWeight: "bold", fontSize: 12 },
//   },
//   {
//     id: "comments-post",
//     source: "comments",
//     target: "posts",
//     sourceHandle: "source-post_id",
//     targetHandle: "target-id",
//     type: "smoothstep",
//     animated: true,
//     style: { stroke: getRandomColor(), strokeWidth: 2 },
//     labelStyle: { fill: "#f59e0b", fontWeight: "bold", fontSize: 12 },
//   },
//   {
//     id: "post-categories-post",
//     source: "post_categories",
//     target: "posts",
//     sourceHandle: "source-post_id",
//     targetHandle: "target-id",
//     type: "smoothstep",
//     animated: true,
//     style: { stroke: getRandomColor(), strokeWidth: 2 },
//     labelStyle: { fill: "#8b5cf6", fontWeight: "bold", fontSize: 12 },
//   },
//   {
//     id: "post-categories-category",
//     source: "post_categories",
//     target: "categories",
//     sourceHandle: "source-category_id",
//     targetHandle: "target-id",
//     type: "smoothstep",
//     animated: true,
//     style: { stroke: getRandomColor(), strokeWidth: 2 },
//     labelStyle: { fill: "#ec4899", fontWeight: "bold", fontSize: 12 },
//   },
//   {
//     id: "comments-post",
//     source: "comments",
//     target: "posts",
//     sourceHandle: "source-post_id",
//     targetHandle: "target-id",
//     type: "smoothstep",
//     animated: true,
//     label: "1 : N",
//     style: { stroke: getRandomColor(), strokeWidth: 2 },
//     labelStyle: { fill: "#f59e0b", fontWeight: "bold", fontSize: 12 },
//   },
//   {
//     id: "post-categories-post",
//     source: "post_categories",
//     target: "posts",
//     sourceHandle: "source-post_id",
//     targetHandle: "target-id",
//     type: "smoothstep",
//     animated: true,
//     label: "N : M",
//     style: { stroke: getRandomColor(), strokeWidth: 2 },
//     labelStyle: { fill: "#8b5cf6", fontWeight: "bold", fontSize: 12 },
//   },
//   {
//     id: "post-categories-category",
//     source: "post_categories",
//     target: "categories",
//     sourceHandle: "source-category_id",
//     targetHandle: "target-id",
//     type: "smoothstep",
//     animated: true,
//     label: "N : M",
//     style: { stroke: getRandomColor(), strokeWidth: 2 },
//     labelStyle: { fill: "#ec4899", fontWeight: "bold", fontSize: 12 },
//   },
// ];
