export interface BridgeGlobalEvent {
  version: string;
}

export interface BridgeGlobalOn<T extends Record<string, any> = Record<string, any>> {
  <K extends keyof T>(name: K, callback: BridgeGlobalOnCallback<T[K]>): void;
}

export interface BridgeGlobalOnCallback<T = unknown> {
  (result: T): void;
}
