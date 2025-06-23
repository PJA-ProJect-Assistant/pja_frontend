import type { Status } from "../types/list";

export const statusLabels: Record<Status, string> = {
  BEFORE: "진행 전",
  IN_PROGRESS: "진행 중",
  DONE: "완료",
  PENDING: "보류",
  DELETE: "삭제",
};

export const statusColors: Record<Status, string> = {
  BEFORE: "#d9d9d6",
  IN_PROGRESS: "#fec300",
  DONE: "#fe5000",
  PENDING: "#50b5ff",
  DELETE: "#ff4d4f",
};
