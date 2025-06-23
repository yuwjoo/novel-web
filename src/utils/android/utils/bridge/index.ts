import type { TargetObject, BridgeApiFunOptions, BridgeApiFunHandler, BridgeApi } from "../../types/bridge";
import { bridgeInterfaceForAndroid } from "./bridgeInterfaceForAndroid";
import "./bridgeInterfaceForWeb";
import { Channel } from "./channel";
import { channelMap, SUCCESS_CALLBACK_KEY, FAIL_CALLBACK_KEY } from "./store";

/**
 * @description: 生成随机id
 * @return {string} id
 */
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
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
