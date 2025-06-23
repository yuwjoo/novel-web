import type {
  BridgeApi,
  BridgeApiFunHandler,
  BridgeApiFunOptions,
  BridgeApiTargetObject
} from "../../types/bridge/bridgeApi";
import { bridgeInterfaceForAndroid } from "./bridgeInterfaceForAndroid";
import { Channel, channelMap } from "./channel";
import { REJECT_CALLBACK_KEY, RESOLVE_CALLBACK_KEY } from "./constant";

/**
 * @description: 生成随机id
 * @return {string} id
 */
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const createTarget = (keys: string[]): BridgeApiTargetObject => {
  const target = () => {
    /** empty */
  };
  target.keys = keys;
  return target;
};

const handler = {
  get(target: BridgeApiTargetObject, prop: string): BridgeApiTargetObject {
    return new Proxy(createTarget([...target.keys, prop]), handler);
  },
  apply(
    target: BridgeApiTargetObject,
    _thisArg: BridgeApiTargetObject,
    [data, options]: [any, BridgeApiFunOptions | undefined]
  ): BridgeApiFunHandler {
    if (!bridgeInterfaceForAndroid.available) {
      throw new Error("android bridge is not available");
    }
    const id = generateId();
    let channel: Channel | undefined;
    let promise: Promise<any> | undefined;
    bridgeInterfaceForAndroid.callMethod({
      id,
      callMethodPath: target.keys,
      data
    });
    if (!options?.noChannelMode) {
      channel = new Channel();
      channelMap.set(id, channel);
    }
    return Object.create(null, {
      promise: {
        get() {
          if (channel === undefined) {
            promise = promise || Promise.reject(new Error("Channel not found"));
          } else if (promise === undefined) {
            promise = new Promise((resolve, reject) => {
              channel.on(RESOLVE_CALLBACK_KEY, resolve);
              channel.on(REJECT_CALLBACK_KEY, reject);
            });
          }
          return promise;
        }
      }
    });
  }
};

export const bridgeApi: BridgeApi = new Proxy<any>(createTarget([]), handler);
