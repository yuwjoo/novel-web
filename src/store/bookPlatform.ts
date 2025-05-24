import { useCrawler } from "@/crawler";
import { defineStore } from "pinia";

/**
 * @description: 小说平台-store
 */
export const useBookPlatform = defineStore("useBookPlatform", () => {
  const bookPlatformList = Object.keys(useCrawler().books).map((key: string) => useCrawler().books[key].origin); // 小说平台列表
  const currentPlatformKey = ref(bookPlatformList[0].key); // 当前小说平台key
  const currentPlatform = computed(() => {
    return bookPlatformList.find((item) => item.key === currentPlatformKey.value);
  }); // 当前小说平台

  return { bookPlatformList, currentPlatformKey, currentPlatform };
});
