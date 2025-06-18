import type { AndroidBridgeCallback, AndroidBridgeNative, AndroidBridgeStore } from "../types/bridge";
import { EventEmitter } from "./eventEmitter";

// class AndroidBridgeConnect {
//   isConnect: boolean;
//   send: (type: string, data?: any) => void;
//   on: (type: string, callback?: AndroidBridgeCallback) => void;
//   close: () => void;
// }

const NATIVE_KEY = "__androidBridgeNative__"; // native入口key
const STORE_KEY = "__androidBridgeStore__"; // 数据仓库key

class AndroidBridge extends EventEmitter {
  constructor() {
    super();
    if (this.available) {
      window[STORE_KEY] = { cb: {}, on: {} };
    }
  }

  get available(): boolean {
    return !!window[NATIVE_KEY];
  }

  get store(): AndroidBridgeStore {
    return window[STORE_KEY];
  }

  get native(): AndroidBridgeNative {
    return window[NATIVE_KEY];
  }

  send(name: string, data?: any): void {
    if (!this.available) return;
    this.native.on({ name, data });
  }

  invoke(name: string, data?: any, callback?: AndroidBridgeCallback): Promise<any> {
    if (!this.available) return Promise.reject();
    return new Promise((resolve, reject) => {
      const id = this.generateId();
      const cb = (resultText: any) => {
        const result = JSON.parse(resultText);
      };
      this.store.cb[id] = callback;
      this.native.handle({ id, name, data });
    });
  }

  //   createConnect(name: string): AndroidBridgeConnect;

  /**
   * @description: 生成随机id
   * @return {string} id
   */
  private generateId(): string {
    return Math.random().toString() + Date.now();
  }
}

export default new AndroidBridge();
