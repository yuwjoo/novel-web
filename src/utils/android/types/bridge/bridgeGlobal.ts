export interface BridgeGlobalOnEvent {
  version: string;
}

export interface BridgeGlobalSendEvent {
  ready: undefined;
}

export interface BridgeGlobalOn<T extends Record<string, any> = Record<string, any>> {
  <K extends Extract<keyof T, string>>(name: K, callback: BridgeGlobalOnCallback<T[K]>): void;
}

export interface BridgeGlobalOnCallback<T = unknown> {
  (result: T): void;
}

export interface BridgeGlobalSend<T extends Record<string, any> = Record<string, any>> {
  <K extends Extract<keyof T, string>>(name: K, data?: T[K]): void;
}
