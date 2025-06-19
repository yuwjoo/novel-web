export interface AndroidBridgeCallback<T = any> {
  (result: T): void;
}

export interface AndroidBridgeNative {
  on: (data: Record<string, any>) => void;
  handle: (data: Record<string, any>) => void;
  connect: (data: Record<string, any>) => void;
}

export interface AndroidBridgeStore {
  cb: Record<string, any>;
  on: Record<string, any>;
}

export interface BridgeApi {
  request: BridgeApiFun<RequestData, RequestOnEvent["response"], RequestOnEvent, RequestSendEvent>;
}

export interface BridgeApiFun<TData = unknown, TResult = unknown, TOn = unknown, TSend = unknown> {
  (data: TData, options?: BridgeApiFunOptions): BridgeApiFunHandler<TResult, TOn, TSend>;
}

export interface BridgeApiFunOptions {
  timeout?: number;
}

export interface BridgeApiFunHandler<TResult = unknown, TOn = unknown, TSend = unknown> {
  promise: Promise<TResult>;
  on: BridgeApiFunHandlerOn<TOn>;
  send: BridgeApiFunHandlerSend<TSend>;
  done: BridgeApiFunHandlerDone<TSend>;
}

export interface BridgeApiFunHandlerOn<T = unknown> {
  <K extends keyof T>(name: K, callback: (result: T[K]) => void): void;
}

export interface BridgeApiFunHandlerSend<T = unknown> {
  <K extends keyof T>(name: K, data?: T[K]): void;
}

export interface BridgeApiFunHandlerDone<T = unknown> {
  <K extends keyof T>(name?: K, data?: T[K]): void;
}

export interface RequestData {
  url: string; // 请求url
  method: string; // 请求方法
  headers: Record<string, string>; // 请求头
  timeout: number; // 超时时间
  bodyText?: string; // body文本
  bodyBlobText?: string; // body二进制文本
  bodyMultipartList?: (BodyMultipartField | BodyMultipartBlob)[]; // body分块数据列表
}

export interface BodyMultipartField {
  type: "field"; // 类型
  name: string; // 名称
  value: string; // 值
}

export interface BodyMultipartBlob {
  type: "blob"; // 类型
  name: string; // 名称
  filePath?: string; // 文件路径
  fileName?: string; // 文件名称
  mimeType?: string; // mime类型
  blobText?: string; // 二进制文本
}

export interface RequestOnEvent {
  uploadProgress: {
    loaded: number; // 当前数据量
    total: number; // 总数据量
    lengthComputable: boolean; // 进度是否可以被测量
  };
  downloadProgress: {
    loaded: number; // 当前数据量
    total: number; // 总数据量
    lengthComputable: boolean; // 进度是否可以被测量
  };
  response: {
    status: number; // 状态码
    statusText: string; // 状态文本
    headers: Record<string, string>; // 响应头集合
    body: string; // body数据
    url: string; // 响应url
  };
  error: {
    type: "error"; // 类型
    data: "timeout" | "other"; // 失败类型
  };
}

export interface RequestSendEvent {
  cancelRequest: undefined;
}
