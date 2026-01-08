export interface HistoryItem {
  id: number;
  url: string;
  method: string;
  statusCode: number;
  duration: number;
  createdAt: string;
}

export interface ApiResponse {
  response: any; // The actual JSON data
  meta: {
    statusCode: number;
    duration: number;
    size: number;
  };
}