<template>
  <book-page-scroll v-if="mode === 'scroll'" :pages="pages" />
  <div v-else class="book-page"></div>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import BookPageScroll from "./book-page-scroll.vue";

export interface IBookPagePage extends Record<string, any> {
  id: string | number; // id
  title: string; // 标题
  lines: string[]; // 行内容集合
}

defineOptions({
  name: "book-page"
});

defineProps({
  // 模式
  mode: {
    type: String as PropType<"none" | "scroll" | "slide">,
    default: "scroll"
  },
  // 数据
  pages: {
    type: Array as PropType<IBookPagePage[]>,
    required: true
  }
});
</script>
