import type { IBridgeEmitterConnect, IBridgeEmitterInvoke, IBridgeEmitterSend } from "../../types/bridge/bridgeEmitter";
import { bridgeInterfaceForAndroid } from "./bridgeInterfaceForAndroid";
import { Channel } from "./channel";
import { channelStore } from "./channelStore";
import { RESOLVE_CALLBACK_KEY, REJECT_CALLBACK_KEY } from "./constant";
import { checkNotIsAndroidBridgeEnv, generateId } from "./utils";

export class BridgeEmitter {
  /**
   * @description: 发送api
   */
  public readonly send: IBridgeEmitterSend = (name, data) => {
    if (checkNotIsAndroidBridgeEnv()) {
      return;
    }

    bridgeInterfaceForAndroid.callMethod({
      callMethodPath: name.split("/"),
      data
    });
  };

  /**
   * @description: 调用api
   */
  public readonly invoke: IBridgeEmitterInvoke = (name, data) => {
    if (checkNotIsAndroidBridgeEnv()) {
      return Promise.reject("android bridge is not available");
    }

    const id = generateId();
    const channel = new Channel(id);

    bridgeInterfaceForAndroid.callMethod({
      id,
      callMethodPath: name.split("/"),
      data
    });

    channelStore.add(channel);

    return new Promise((resolve, reject) => {
      channel.on(RESOLVE_CALLBACK_KEY, resolve as any);
      channel.on(REJECT_CALLBACK_KEY, reject);
    });
  };

  /**
   * @description: 连接api
   */
  public readonly connect: IBridgeEmitterConnect = (name, data) => {
    if (checkNotIsAndroidBridgeEnv()) {
      return new Channel("empty", true);
    }

    const id = generateId();
    const channel = new Channel(id);

    bridgeInterfaceForAndroid.callMethod({
      id,
      callMethodPath: name.split("/"),
      data
    });

    channelStore.add(channel);

    return channel;
  };
}

export const bridgeEmitter = new BridgeEmitter();
