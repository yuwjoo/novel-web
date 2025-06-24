import type { BridgeGlobalEvent, BridgeGlobalOn } from "../../types/bridge/bridgeGlobal";
import type { Channel } from "./channel";
import { channelStore } from "./channelStore";
import { GLOBAL_EVENT_CHANNEL_ID } from "./constant";

class BridgeGlobal<T extends Record<string, any>> {
  private globalEventChannel: Channel; // 全局事件通道

  constructor() {
    this.globalEventChannel = channelStore.add(GLOBAL_EVENT_CHANNEL_ID);
  }

  /**
   * @description: 监听事件
   */
  public readonly on: BridgeGlobalOn<T> = (name, callback) => {
    this.globalEventChannel.on(name, callback);
  };

  /**
   * @description: 监听一次性事件
   */
  public readonly only: BridgeGlobalOn<T> = (name, callback) => {
    this.globalEventChannel.only(name, callback);
  };

  /**
   * @description: 关闭事件
   */
  public readonly off: BridgeGlobalOn<T> = (name, callback) => {
    this.globalEventChannel.off(name, callback);
  };
}

export const bridgeGlobal = new BridgeGlobal<BridgeGlobalEvent>();
