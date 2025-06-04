export interface AndroidRequest {
  <T = any, R = RequestResponse<T>, D = any>(config: AndroidRequestConfig<D>): Promise<R>;
}

export interface AndroidRequestConfig<D = any> {
  url: string;
  method?: string;
  baseURL?: string;
  headers?: Record<string, any>;
  params?: any;
  data?: D;
  timeout?: number;
  responseType?: ResponseType;
  onUploadProgress?: (progressEvent: ProgressEvent) => void;
  onDownloadProgress?: (progressEvent: ProgressEvent) => void;
  abortSignal?: AbortSignal; // 取消请求信号对象
}

export type Method =
  | "get"
  | "GET"
  | "delete"
  | "DELETE"
  | "head"
  | "HEAD"
  | "options"
  | "OPTIONS"
  | "post"
  | "POST"
  | "put"
  | "PUT"
  | "patch"
  | "PATCH"
  | "purge"
  | "PURGE"
  | "link"
  | "LINK"
  | "unlink"
  | "UNLINK";

export type ResponseType = "arraybuffer" | "blob" | "document" | "json" | "text" | "stream" | "formdata";

export interface ProgressEvent {
  loaded: number;
  total?: number;
  progress?: number;
  bytes: number;
  rate?: number;
  estimated?: number;
  upload?: boolean;
  download?: boolean;
  event?: any;
  lengthComputable: boolean;
}

export interface RequestResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, any>;
}
