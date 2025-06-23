import type { AndroidInterface, AndroidInterfaceCallData } from "../../types/bridge";
import { ANDROID_INTERFACE_KEY } from "./store";

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
   * @param {AndroidInterfaceCallData} data 发送数据
   */
  public callMethod(data: AndroidInterfaceCallData) {
    this.androidInterface.callMethod(data);
  }
}

export const bridgeInterfaceForAndroid = new BridgeInterfaceForAndroid();
