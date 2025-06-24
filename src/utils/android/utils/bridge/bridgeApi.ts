import type {
  BridgeApi,
  BridgeApiHandler,
  BridgeApiHandlerDone,
  BridgeApiHandlerOn,
  BridgeApiHandlerSend,
  BridgeApiOptions,
  BridgeApiTargetObject
} from "../../types/bridge/bridgeApi";
import { bridgeInterfaceForAndroid } from "./bridgeInterfaceForAndroid";
import { Channel } from "./channel";
import { channelStore } from "./channelStore";
import { REJECT_CALLBACK_KEY, RESOLVE_CALLBACK_KEY } from "./constant";
import { generateId } from "./utils";

class ApiHandler implements BridgeApiHandler {
  #channel: Channel | undefined; // 缓存的通道
  #promise: Promise<any> | undefined; // 缓存的Promise

  constructor(channel?: Channel) {
    this.#channel = channel;
  }

  /**
   * @description: Promise对象
   */
  public get promise(): Promise<any> {
    if (this.#promise === undefined) {
      this.#promise = new Promise((resolve, reject) => {
        if (this.#channel === undefined) {
          reject("channel not found");
        } else {
          this.#channel.on(RESOLVE_CALLBACK_KEY, resolve);
          this.#channel.on(REJECT_CALLBACK_KEY, reject);
        }
      });
    }
    return this.#promise;
  }

  /**
   * @description: 监听事件
   */
  public on: BridgeApiHandlerOn = (name, callback) => {
    if (this.#channel === undefined) return;
    this.#channel.on(name, callback);
  };

  /**
   * @description: 监听一次性事件
   */
  public only: BridgeApiHandlerOn = (name, callback) => {
    if (this.#channel === undefined) return;
    this.#channel.only(name, callback);
  };

  /**
   * @description: 关闭事件
   */
  public off: BridgeApiHandlerOn = (name, callback) => {
    if (this.#channel === undefined) return;
    this.#channel.off(name, callback);
  };

  /**
   * @description: 发送事件
   */
  public send: BridgeApiHandlerSend = (name, data) => {
    if (this.#channel === undefined) return;
    bridgeInterfaceForAndroid.triggerEvent({ id: this.#channel.id, name, data });
  };

  /**
   * @description: 发送结束事件
   */
  public done: BridgeApiHandlerDone = (name, data) => {
    if (this.#channel === undefined) return;
    bridgeInterfaceForAndroid.triggerEvent({ id: this.#channel.id, name, data });
  };
}

/**
 * @description: 创建代理目标对象
 * @return {BridgeApiTargetObject} 代理目标对象
 */
const createTarget = (keys: string[]): BridgeApiTargetObject => {
  const target = () => {
    /** empty */
  };
  target.keys = keys;
  return target;
};

/**
 * @description: 代理处理对象
 */
const handler = {
  get(target: BridgeApiTargetObject, prop: string): BridgeApiTargetObject {
    return new Proxy(createTarget([...target.keys, prop]), handler);
  },
  apply(target: BridgeApiTargetObject, _thisArg: any, [data, options]: [any, BridgeApiOptions]): BridgeApiHandler {
    if (!bridgeInterfaceForAndroid.available) {
      console.error("android bridge is not available");
      return new ApiHandler();
    }
    const id = generateId();
    const channel = options?.noChannelMode ? undefined : channelStore.add(id);

    bridgeInterfaceForAndroid.callMethod({
      id,
      callMethodPath: target.keys,
      data
    });

    return new ApiHandler(channel);
  }
};

export const bridgeApi: BridgeApi = new Proxy<any>(createTarget([]), handler);
