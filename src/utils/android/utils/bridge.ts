import type {
  AndroidInterface,
  AndroidInterfaceCallData,
  BridgeApi,
  BridgeApiFunHandler,
  BridgeApiFunHandlerOnCallback,
  BridgeApiFunOptions,
  CallAndroidMessage,
  TargetObject
} from "../types/bridge";
import { EventEmitter } from "./eventEmitter";

const ANDROID_INTERFACE_KEY = "__bridgeInterfaceForAndroid__"; // android接口对象key
const WEB_INTERFACE_KEY = "__bridgeInterfaceForWeb__"; // web接口对象key

const SUCCESS_CALLBACK_KEY = Symbol("SUCCESS_CALLBACK_KEY"); // 成功回调key
const FAIL_CALLBACK_KEY = Symbol("FAIL_CALLBACK_KEY"); // 失败回调key
const channelMap: Map<string, Channel> = new Map(); // 通道map

class Channel {
  private timeout: number;
  private breakTime!: number;
  private callbackEventEmitter = new EventEmitter();

  constructor(timeout: number) {
    this.timeout = timeout;
    this.refreshBreakTime();
  }

  /**
   * @description: 是否断开连接
   */
  public get isBreak(): boolean {
    return this.breakTime <= Date.now();
  }

  /**
   * @description: 刷新断开时间
   */
  private refreshBreakTime() {
    this.breakTime = this.timeout === 0 ? Infinity : Date.now() + this.timeout;
  }

  /**
   * @description: 监听事件
   * @param {string | symbol} name 事件名称
   * @param {BridgeApiFunHandlerOnCallback} callback 回调函数
   */
  public on(name: string | symbol, callback: BridgeApiFunHandlerOnCallback) {
    this.callbackEventEmitter.on(name, callback);
  }

  /**
   * @description: 取消监听
   * @param {string | symbol} name 事件名称
   * @param {BridgeApiFunHandlerOnCallback} callback 回调函数
   */
  public off(name: string | symbol, callback: BridgeApiFunHandlerOnCallback) {
    this.callbackEventEmitter.off(name, callback);
  }

  /**
   * @description: 触发事件
   * @param {string | symbol} name 事件名称
   * @param {any} data 调用参数
   */
  public emit(name: string | symbol, data: any) {
    this.callbackEventEmitter.emit(name, data);
    this.refreshBreakTime();
  }
}

class BridgeInterfaceForAndroid {
  /**
   * @description: android接口对象
   * @return {AndroidInterface} 接口对象
   */
  private get androidInterface(): AndroidInterface {
    return window[ANDROID_INTERFACE_KEY];
  }

  /**
   * @description: 是否可用
   * @return {boolean} 状态
   */
  public get available(): boolean {
    return !!this.androidInterface;
  }

  /**
   * @description: 调用
   * @param {AndroidInterfaceCallData} data 发送数据
   */
  public call(data: AndroidInterfaceCallData) {
    this.androidInterface.call(data);
  }
}

class BridgeInterfaceForWeb {
  /**
   * @description: 挂载web接口对象
   */
  public static mount() {
    window[WEB_INTERFACE_KEY] = new BridgeInterfaceForWeb();
  }

  /**
   * @description: 调用
   * @param {string} message 消息
   */
  call(message: string) {
    const msg: CallAndroidMessage = JSON.parse(message);
    const channel = channelMap.get(msg.id);
    if (channel === undefined) return;
    if (channel.isBreak) {
      channelMap.delete(msg.id);
      return;
    }
    if (msg.name) {
      channel.emit(msg.name, msg.data);
    }
    if (msg.isDone) {
      channel.emit(msg.isFail ? FAIL_CALLBACK_KEY : SUCCESS_CALLBACK_KEY, msg.data);
      channelMap.delete(msg.id);
    }
  }

  /**
   * @description: 抛出异常
   * @param {string} message 消息
   */
  throwError(message: string) {
    throw new Error(message);
  }
}

const bridgeInterfaceForAndroid = new BridgeInterfaceForAndroid();

BridgeInterfaceForWeb.mount();

/**
 * @description: 生成随机id
 * @return {string} id
 */
const generateId = (): string => {
  return Math.random().toString() + Date.now();
};

const createTarget = (keys: string[]): TargetObject => {
  const target = () => {
    /** empty */
  };
  target.keys = keys;
  return target;
};

const handler = {
  get(target: TargetObject, prop: string): TargetObject {
    return new Proxy(createTarget([...target.keys, prop]), handler);
  },
  apply(
    target: TargetObject,
    _thisArg: TargetObject,
    [data, options]: [any, BridgeApiFunOptions | undefined]
  ): BridgeApiFunHandler {
    if (!bridgeInterfaceForAndroid.available) {
      throw new Error("android dridge is not available");
    }
    const id = generateId();
    let channel: Channel | undefined;
    let promise: Promise<any> | undefined;
    bridgeInterfaceForAndroid.call({
      id,
      callMethodPath: target.keys,
      data,
      timeout: options?.timeout
    });
    if (!options?.noChannelMode) {
      channel = new Channel(options?.timeout || 0);
      channelMap.set(id, channel);
    }
    return Object.create(null, {
      promise: {
        get() {
          if (channel === undefined) {
            promise = promise || Promise.reject(new Error("Channel not found"));
          } else if (promise === undefined) {
            promise = new Promise((resolve, reject) => {
              channel.on(SUCCESS_CALLBACK_KEY, resolve);
              channel.on(FAIL_CALLBACK_KEY, reject);
            });
          }
          return promise;
        }
      }
    });
  }
};

export const bridgeApi: BridgeApi = new Proxy<any>(createTarget([]), handler);

const myPromise = {
  then: () => {
    return Promise.resolve();
  }
} as Promise<any> & { send: number; on: string };
