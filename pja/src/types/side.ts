export interface GitInfoResponse {
  status: string;
  message: string;
  data: {
    gitUrl: string | null;
  };
}
