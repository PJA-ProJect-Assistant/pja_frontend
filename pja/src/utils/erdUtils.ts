import type { Node, Edge } from "reactflow";
import { MarkerType } from "reactflow";
import type { ERDRelation, ERDTable } from "../types/erd";
import { getRandomColor } from "./colorUtils";

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
    style: { stroke: getRandomColor(), strokeWidth: 2 },
  }));
}

export function generateNodesFromData(tables: ERDTable[]): Node[] {
  const gapX = 600;
  const baseGapY = 150; // 기본 간격 (필드가 1개일 때)
  const fieldHeight = 40; // 필드 1개당 높이

  let currentYRow = [0, 0]; // 두 컬럼 각각의 현재 Y 위치

  return tables.map((table, index) => {
    const col = index % 2; // 2열 배치
    const fieldsCount = table.fields?.length || 0;
    const tableHeight = baseGapY + fieldsCount * fieldHeight;

    const position = {
      x: col * gapX,
      y: currentYRow[col],
    };

    currentYRow[col] += tableHeight;

    return {
      id: table.id,
      type: "tableNode",
      data: {
        tableName: table.tableName,
        fields: table.fields,
      },
      position,
    };
  });
}

// 수정페이지 노드 생성 함수
export function generateEdittableNodes(tables: ERDTable[]): Node[] {
  const gapX = 650;
  const baseGapY = 200; // 기본 간격 (필드가 1개일 때)
  const fieldHeight = 40; // 필드 1개당 높이

  let currentYRow = [0, 0]; // 두 컬럼 각각의 현재 Y 위치

  return tables.map((table, index) => {
    const col = index % 2; // 2열 배치
    const fieldsCount = table.fields?.length || 0;
    const tableHeight = baseGapY + fieldsCount * fieldHeight;

    const position = {
      x: col * gapX,
      y: currentYRow[col],
    };

    currentYRow[col] += tableHeight;

    return {
      id: table.id,
      type: "editableTableNode",
      data: table,
      position,
    };
  });
}

// 수정페이지 엣지 생성 함수
export function generateEdittableRelations(relations: ERDRelation[]): Edge[] {
  return relations.map((relation) => ({
    id: relation.id,
    source: relation.source,
    target: relation.target,
    sourceHandle: relation.sourceHandle,
    targetHandle: relation.targetHandle,
    animated: true,
    style: { stroke: "#00205B", strokeWidth: 2 },
    label: String(relation.label || "1:N"),
  }));
}
