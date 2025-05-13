import { defineStore } from "pinia";

/**
 * @description: 小说阅读页面设置-store
 */
export const useBookReadSetting = defineStore("bookReadSetting", () => {
  const settings = reactive(
    JSON.parse(localStorage.getItem("bookReadSettings")!) || {
      isNight: false, // 是否暗色模式
      customBg: "#f6f6f6", // 自定义背景颜色
      fontSizeScale: 0 // 字体缩放比例
    }
  );

  const mode = computed(() => {
    return {
      night: {
        bg: "#1b1b1b",
        color: "#6e6e6e",
        fontSizeScale: settings.fontSizeScale
      },
      light: {
        bg: settings.customBg,
        color: "#101010",
        fontSizeScale: settings.fontSizeScale
      }
    };
  }); // 模式属性

  const currentMode = computed(() => (settings.isNight ? mode.value.night : mode.value.light)); // 当前模式

  // 设置小说阅读页设置
  const setSetting = (key, value) => {
    settings[key] = value;
    localStorage.setItem("bookReadSettings", JSON.stringify(settings));
  };

  return { settings, mode, currentMode, setSetting };
});
