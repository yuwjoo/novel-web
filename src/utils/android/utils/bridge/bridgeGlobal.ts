import type {
  BridgeGlobalOnEvent,
  BridgeGlobalOn,
  BridgeGlobalSend,
  BridgeGlobalSendEvent
} from "../../types/bridge/bridgeGlobal";
import { bridgeInterfaceForAndroid } from "./bridgeInterfaceForAndroid";
import type { Channel } from "./channel";
import { channelStore } from "./channelStore";
import { GLOBAL_EVENT_CHANNEL_ID } from "./constant";

class BridgeGlobal<OnEvent extends Record<string, any>, SendEvent extends Record<string, any>> {
  private globalEventChannel: Channel; // 全局事件通道

  constructor() {
    this.globalEventChannel = channelStore.add(GLOBAL_EVENT_CHANNEL_ID);
  }

  /**
   * @description: 监听事件
   */
  public readonly on: BridgeGlobalOn<OnEvent> = (name, callback) => {
    this.globalEventChannel.on(name, callback);
  };

  /**
   * @description: 监听一次性事件
   */
  public readonly only: BridgeGlobalOn<OnEvent> = (name, callback) => {
    this.globalEventChannel.only(name, callback);
  };

  /**
   * @description: 关闭事件
   */
  public readonly off: BridgeGlobalOn<OnEvent> = (name, callback) => {
    this.globalEventChannel.off(name, callback);
  };

  /**
   * @description: 发送事件
   */
  public readonly send: BridgeGlobalSend<SendEvent> = (name, data) => {
    bridgeInterfaceForAndroid.triggerEvent({ id: GLOBAL_EVENT_CHANNEL_ID, name, data });
  };
}

export const bridgeGlobal = new BridgeGlobal<BridgeGlobalOnEvent, BridgeGlobalSendEvent>();
