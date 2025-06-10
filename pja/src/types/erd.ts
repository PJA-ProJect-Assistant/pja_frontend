export interface erd {
  erd_id: number;
  created_at: Date;
  workspace_id: number;
}
export interface erd_table {
  erd_table_id: number;
  name: string;
  erd_id: number;
}

export interface erd_column {
  erd_column_id: number;
  erd_table_id: number;
  name?: string;
  data_type: string;
  is_primary_key: boolean;
  is_foreign_key: boolean;
  is_nullable: boolean;
}

export type Type = "ONE_TO_MANY" | "MANY_TO_MANY" | "MANY_TO_ONE";

export interface erd_relationships {
  erd_relationships_id: number;
  type: Type;
  foreign_key?: string;
  constraint_name?: string;
  from_erd_table_id: number;
  to_erd_table_id: number;
}
