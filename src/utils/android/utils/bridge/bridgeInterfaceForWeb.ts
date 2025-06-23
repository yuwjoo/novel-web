import type { TriggerEventOptions } from "../../types/bridge/bridgeInterfaceForWeb";
import { channelMap } from "./channel";
import { WEB_INTERFACE_KEY, REJECT_CALLBACK_KEY, RESOLVE_CALLBACK_KEY } from "./constant";

class BridgeInterfaceForWeb {
  constructor() {
    window[WEB_INTERFACE_KEY] = this; // 挂载web接口对象
  }

  /**
   * @description: 触发事件
   * @param {string} message 消息
   */
  triggerEvent(message: string) {
    const options: TriggerEventOptions = JSON.parse(message);
    const channel = channelMap.get(options.id);
    if (channel === undefined) return;
    if (options.name) {
      channel.emit(options.name, options.data);
    }
    if (options.isDone) {
      channel.emit(options.isReject ? REJECT_CALLBACK_KEY : RESOLVE_CALLBACK_KEY, options.data);
      channelMap.delete(options.id);
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

export const bridgeInterfaceForWeb = new BridgeInterfaceForWeb();
