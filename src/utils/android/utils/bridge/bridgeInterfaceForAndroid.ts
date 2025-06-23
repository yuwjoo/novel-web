import type {
  AndroidInterface,
  AndroidCallMethodOptions,
  AndroidTriggerEventOptions
} from "../../types/bridge/bridgeInterfaceForAndroid";
import { ANDROID_INTERFACE_KEY } from "./constant";

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
   * @description: 调用方法
   * @param {AndroidCallMethodOptions} data 发送数据
   */
  public callMethod(data: AndroidCallMethodOptions) {
    this.androidInterface.callMethod(data);
  }

  /**
   * @description: 触发事件
   * @param {AndroidTriggerEventOptions} options 消息
   */
  public triggerEvent(options: AndroidTriggerEventOptions) {
    this.androidInterface.triggerEvent(options);
  }

  /**
   * @description: 抛出异常
   * @param {string} message 消息
   */
  public throwError(message: string) {
    this.androidInterface.throwError(message);
  }
}

export const bridgeInterfaceForAndroid = new BridgeInterfaceForAndroid();
