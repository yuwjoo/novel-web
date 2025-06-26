import type { IChannelSend, IChannelDone, IChannel, IChannelOn, IChannelEmit } from "../../types/bridge/channel";
import { EventEmitter } from "../eventEmitter";
import { bridgeInterfaceForAndroid } from "./bridgeInterfaceForAndroid";
import { bridgeConfig } from "./bridgeConfig";

export class Channel<OnEvent extends Record<PropertyKey, any> = any, SendEvent extends Record<string, any> = any>
  extends EventEmitter
  implements IChannel
{
  public readonly id: string; // 通道id
  public isDone: boolean; // 是否结束

  constructor(id: string, isDone = false) {
    super();
    this.id = id;
    this.isDone = isDone;
  }

  /**
   * @description: 监听事件
   */
  public readonly on: IChannelOn<OnEvent> = (name, callback) => {
    if (this.isDone) return;
    super.on(name, callback);
  };

  /**
   * @description: 监听一次性事件
   */
  public readonly only: IChannelOn<OnEvent> = (name, callback) => {
    if (this.isDone) return;
    super.only(name, callback);
  };

  /**
   * @description: 关闭事件
   */
  public readonly off: IChannelOn<OnEvent> = (name, callback) => {
    if (this.isDone) return;
    super.off(name, callback);
  };

  /**
   * @description: 触发内部事件
   */
  public readonly emit: IChannelEmit<OnEvent> = (name, data) => {
    if (this.isDone) return;
    super.emit(name, data);
    if (name === bridgeConfig.REJECT_CALLBACK_KEY || name === bridgeConfig.RESOLVE_CALLBACK_KEY) {
      this.isDone = true;
    }
  };

  /**
   * @description: 发送事件
   */
  public readonly send: IChannelSend<SendEvent> = (name, data) => {
    if (this.isDone) return;
    bridgeInterfaceForAndroid.triggerEvent({ id: this.id, name, data });
  };

  /**
   * @description: 发送结束事件
   */
  public readonly done: IChannelDone<SendEvent> = (name, data) => {
    bridgeInterfaceForAndroid.triggerEvent({ id: this.id, name, data, isDone: true });
    this.isDone = true;
  };
}
