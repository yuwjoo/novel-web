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
  (data: TData, options?: BridgeApiOptions): BridgeApiHandler<TResult, TOn, TSend>;
}

export interface BridgeApiOptions {
  noChannelMode?: boolean; // 无通道模式
}

export interface BridgeApiHandler<
  TResult = void,
  TOn extends Record<string, any> = Record<string, any>,
  TSend extends Record<string, any> = Record<string, any>
> {
  promise: Promise<TResult>;
  on: BridgeApiHandlerOn<TOn>;
  only: BridgeApiHandlerOn<TOn>;
  off: BridgeApiHandlerOn<TOn>;
  send: BridgeApiHandlerSend<TSend>;
  done: BridgeApiHandlerDone<TSend>;
}

export interface BridgeApiHandlerOn<T extends Record<string, any> = Record<string, any>> {
  <K extends Extract<keyof T, string>>(name: K, callback: BridgeApiHandlerOnCallback<T[K]>): void;
}

export interface BridgeApiHandlerOnCallback<T = unknown> {
  (result: T): void;
}

export interface BridgeApiHandlerSend<T extends Record<string, any> = Record<string, any>> {
  <K extends Extract<keyof T, string>>(name: K, data?: T[K]): void;
}

export interface BridgeApiHandlerDone<T extends Record<string, any> = Record<string, any>> {
  <K extends Extract<keyof T, string>>(name?: K, data?: T[K]): void;
}

export interface BridgeApiTargetObject {
  keys: string[];
}
