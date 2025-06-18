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
