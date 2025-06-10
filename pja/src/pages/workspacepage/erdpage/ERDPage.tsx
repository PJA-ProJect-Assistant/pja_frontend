import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { WSHeader } from "../../../components/header/WSHeader";
import ReactFlow, {
  Background,
  Controls,
  Handle,
  Position,
  useReactFlow,
} from "reactflow";
import type { Node, Edge, NodeProps, NodeTypes } from "reactflow";
import "reactflow/dist/style.css";
import { getRandomColor } from "../../../utils/colorUtils";
import "./ERDPage.css";
import { useEffect } from "react";

interface Field {
  name: string;
  type: string;
  isPrimary?: boolean;
  isForeign?: boolean;
}

interface TableData {
  tableName: string;
  fields: Field[];
}

const TableNode: React.FC<NodeProps<TableData>> = ({ data }) => (
  <div className="table-node">
    <div className="table-node-header">{data.tableName}</div>
    <div className="table-node-body">
      {data.fields.map((field, idx) => (
        <div key={idx} className="table-node-row">
          <Handle
            type="target"
            position={Position.Left}
            id={`target-${field.name}`}
            className="handle-left"
          />
          <div className="table-node-field">
            {field.isPrimary && <span className="icon-primary">🔑</span>}
            {field.isForeign && <span className="icon-foreign">🔗</span>}
            <span
              className={`field-name ${field.isPrimary ? "font-bold" : ""} ${
                field.isForeign ? "text-foreign" : ""
              }`}
            >
              {field.name}
            </span>
          </div>
          <span className="field-type">{field.type}</span>
          <Handle
            type="source"
            position={Position.Right}
            id={`source-${field.name}`}
            className="handle-right"
          />
        </div>
      ))}
    </div>
  </div>
);

const nodeTypes: NodeTypes = {
  tableNode: TableNode,
};

// ERD 테이블 정의
const tableData: { id: string; data: TableData }[] = [
  {
    id: "users",
    data: {
      tableName: "Users",
      fields: [
        { name: "id", type: "INT", isPrimary: true },
        { name: "username", type: "VARCHAR(50)" },
        { name: "email", type: "VARCHAR(100)" },
      ],
    },
  },
  {
    id: "posts",
    data: {
      tableName: "Posts",
      fields: [
        { name: "id", type: "INT", isPrimary: true },
        { name: "user_id", type: "INT", isForeign: true },
        { name: "title", type: "VARCHAR(200)" },
        { name: "content", type: "TEXT" },
      ],
    },
  },
  {
    id: "comments",
    data: {
      tableName: "Comments",
      fields: [
        { name: "id", type: "INT", isPrimary: true },
        { name: "post_id", type: "INT", isForeign: true },
        { name: "user_id", type: "INT", isForeign: true },
        { name: "comment", type: "TEXT" },
      ],
    },
  },
  {
    id: "categories",
    data: {
      tableName: "Categories",
      fields: [
        { name: "id", type: "INT", isPrimary: true },
        { name: "name", type: "VARCHAR(100)" },
      ],
    },
  },
  {
    id: "post_categories",
    data: {
      tableName: "Post_Categories",
      fields: [
        { name: "post_id", type: "INT", isPrimary: true, isForeign: true },
        {
          name: "category_id",
          type: "INT",
          isPrimary: true,
          isForeign: true,
        },
      ],
    },
  },
];

// 노드 생성 함수 (2열 종대 배치)
function generateNodes(): Node<TableData>[] {
  const gapX = 550;
  const gapY = 220;

  return tableData.map((table, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    return {
      id: table.id,
      type: "tableNode",
      data: table.data,
      position: { x: col * gapX, y: row * gapY },
    };
  });
}

// 외래키 연결 엣지들
const edges: Edge[] = [
  {
    id: "posts-user",
    source: "posts",
    target: "users",
    sourceHandle: "source-user_id",
    targetHandle: "target-id",
    type: "smoothstep",
    animated: true,
    style: { stroke: getRandomColor(), strokeWidth: 2 },
    labelStyle: { fill: "#0ea5e9", fontWeight: "bold", fontSize: 12 },
  },
  {
    id: "comments-user",
    source: "comments",
    target: "users",
    sourceHandle: "source-user_id",
    targetHandle: "target-id",
    type: "smoothstep",
    animated: true,
    style: { stroke: getRandomColor(), strokeWidth: 2 },
    labelStyle: { fill: "#10b981", fontWeight: "bold", fontSize: 12 },
  },
  {
    id: "comments-post",
    source: "comments",
    target: "posts",
    sourceHandle: "source-post_id",
    targetHandle: "target-id",
    type: "smoothstep",
    animated: true,
    style: { stroke: getRandomColor(), strokeWidth: 2 },
    labelStyle: { fill: "#f59e0b", fontWeight: "bold", fontSize: 12 },
  },
  {
    id: "post-categories-post",
    source: "post_categories",
    target: "posts",
    sourceHandle: "source-post_id",
    targetHandle: "target-id",
    type: "smoothstep",
    animated: true,
    style: { stroke: getRandomColor(), strokeWidth: 2 },
    labelStyle: { fill: "#8b5cf6", fontWeight: "bold", fontSize: 12 },
  },
  {
    id: "post-categories-category",
    source: "post_categories",
    target: "categories",
    sourceHandle: "source-category_id",
    targetHandle: "target-id",
    type: "smoothstep",
    animated: true,
    style: { stroke: getRandomColor(), strokeWidth: 2 },
    labelStyle: { fill: "#ec4899", fontWeight: "bold", fontSize: 12 },
  },
  {
    id: "comments-post",
    source: "comments",
    target: "posts",
    sourceHandle: "source-post_id",
    targetHandle: "target-id",
    type: "smoothstep",
    animated: true,
    label: "1 : N",
    style: { stroke: getRandomColor(), strokeWidth: 2 },
    labelStyle: { fill: "#f59e0b", fontWeight: "bold", fontSize: 12 },
  },
  {
    id: "post-categories-post",
    source: "post_categories",
    target: "posts",
    sourceHandle: "source-post_id",
    targetHandle: "target-id",
    type: "smoothstep",
    animated: true,
    label: "N : M",
    style: { stroke: getRandomColor(), strokeWidth: 2 },
    labelStyle: { fill: "#8b5cf6", fontWeight: "bold", fontSize: 12 },
  },
  {
    id: "post-categories-category",
    source: "post_categories",
    target: "categories",
    sourceHandle: "source-category_id",
    targetHandle: "target-id",
    type: "smoothstep",
    animated: true,
    label: "N : M",
    style: { stroke: getRandomColor(), strokeWidth: 2 },
    labelStyle: { fill: "#ec4899", fontWeight: "bold", fontSize: 12 },
  },
];

export default function ERDPage() {
  const dispatch = useDispatch();
  const selectedWS = useSelector(
    (state: RootState) => state.workspace.selectedWS
  );
  const nodes = generateNodes();

  const { fitView } = useReactFlow();

  useEffect(() => {
    const handleResize = () => {
      fitView({ padding: 0.2 });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [fitView]);

  return (
    <>
      <WSHeader title="ERD 생성" />
      <div className="erd-page-container">
        <div className="erd-page-header">
          <h1 className="erd-title">
            ✨아이디어와 명세서를 분석하여 ERD 추천을 해드려요
          </h1>
          <p className="erd-subtitle">
            완료하기 버튼을 누르면 다음 단계로 넘어갈 수 있어요
          </p>
        </div>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
          zoomOnScroll={false}
          zoomActivationKeyCode="Control" // Ctrl 키 누르고 휠 돌릴 때만 확대/축소
          className="erdflow-container"
        >
          <Background color="#e5e7eb" gap={16} />
          <Controls />
        </ReactFlow>
      </div>
    </>
  );
}
