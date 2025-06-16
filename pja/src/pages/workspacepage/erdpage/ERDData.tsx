import {
    Handle,
    Position,
} from "reactflow";
import type { Node, Edge, NodeProps, NodeTypes } from "reactflow";
import { getRandomColor } from "../../../utils/colorUtils";

export interface Field {
    name: string;
    type: string;
    isPrimary?: boolean;
    isForeign?: boolean;
}

export interface TableData {
    tableName: string;
    fields: Field[];
}

export const TableNode: React.FC<NodeProps<TableData>> = ({ data }) => (
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
                            className={`field-name ${field.isPrimary ? "font-bold" : ""} ${field.isForeign ? "text-foreign" : ""
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

export const nodeTypes: NodeTypes = {
    tableNode: TableNode,
};

// ERD 테이블 정의
export const tableData: { id: string; data: TableData }[] = [
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
export function generateNodes(): Node<TableData>[] {
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
export const edges: Edge[] = [
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