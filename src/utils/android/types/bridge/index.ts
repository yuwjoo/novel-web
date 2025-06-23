import type { RequestData, RequestOnEvent, RequestResult, RequestSendEvent } from "./request";

export interface BridgeApi {
  request: BridgeApiFun<RequestData, RequestResult, RequestOnEvent, RequestSendEvent>;
}

export interface BridgeApiFun<
  TData = undefined,
  TResult = void,
  TOn extends Record<string, any> = Record<string, any>,
  TSend extends Record<string, any> = Record<string, any>
> {
  (data: TData, options?: BridgeApiFunOptions): BridgeApiFunHandler<TResult, TOn, TSend>;
}

export interface BridgeApiFunOptions {
  timeout?: number; // 超时时间，该时间内对方无响应则断开连接
  noChannelMode?: boolean; // 无通道模式
}

export interface BridgeApiFunHandler<
  TResult = void,
  TOn extends Record<string, any> = Record<string, any>,
  TSend extends Record<string, any> = Record<string, any>
> {
  promise: Promise<TResult>;
  on: BridgeApiFunHandlerOn<TOn>;
  off: BridgeApiFunHandlerOn<TOn>;
  send: BridgeApiFunHandlerSend<TSend>;
  done: BridgeApiFunHandlerDone<TSend>;
}

export interface BridgeApiFunHandlerOn<T extends Record<string, any> = Record<string, any>> {
  <K extends keyof T>(name: K, callback: BridgeApiFunHandlerOnCallback<T[K]>): void;
}

export interface BridgeApiFunHandlerOnCallback<T = unknown> {
  (result: T): void;
}

export interface BridgeApiFunHandlerSend<T extends Record<string, any> = Record<string, any>> {
  <K extends keyof T>(name: K, data?: T[K]): void;
}

export interface BridgeApiFunHandlerDone<T extends Record<string, any> = Record<string, any>> {
  <K extends keyof T>(name?: K, data?: T[K]): void;
}

export interface CallAndroidMessage<T = any> {
  id: string; // 通道id
  name?: string; // 事件名称
  data?: T; // 数据
  isDone?: boolean; // 是否结束
  isFail?: boolean; // 是否响应为失败
}

export interface AndroidInterface {
  callMethod: (data: AndroidInterfaceCallData) => void;
}

export interface AndroidInterfaceCallData {
  id: string; // 通道id
  callMethodPath: string[]; // 调用方法路径
  data: any; // 数据
  timeout?: number; // 超时时间
}

export interface TargetObject {
  keys: string[];
}
