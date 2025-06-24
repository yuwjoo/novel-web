import { bridgeInterfaceForAndroid } from "./bridgeInterfaceForAndroid";
import "./bridgeInterfaceForWeb";

export * from "./bridgeApi";
export * from "./bridgeGlobal";

window.addEventListener("unload", () => {
  bridgeInterfaceForAndroid.rebuild();
});
