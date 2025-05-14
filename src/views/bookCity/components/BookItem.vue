<template>
  <div class="book-item" :class="{ 'book-item--page-first': item.page.index === 0 }" @click="handleClickItem(item)">
    <div v-if="item.page.index === 0" class="book-item-page-divider">
      第{{ item.page.current }}/{{ item.page.total / item.page.size }}页
    </div>
    <div class="book-item__title">{{ item.title }}</div>
    <div class="book-item__info">
      <div class="book-item__author">作者：{{ item.author.name }}</div>
      <div class="book-item__update-date">最近更新：{{ item.updateDate }}</div>
    </div>
    <div class="book-item__describe">{{ item.intro }}</div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "@/router";
import type { PropType } from "vue";
import { BookListItem } from "../BookCity.vue";

defineOptions({
  name: "book-item"
});

defineProps({
  index: {
    type: Number,
    required: true
  },
  item: {
    type: Object as PropType<BookListItem>,
    required: true
  }
});

const router = useRouter();

/**
 * @description: 点击书籍跳转到详情页
 * @param {BookListItem} item 当前项
 */
const handleClickItem = (item: BookListItem) => {
  router.push({
    name: "bookDetail",
    query: {
      id: item.id
    }
  });
};
</script>

<style lang="scss" scoped>
.book-item {
  padding: 16px 10px;
  border-bottom: 1px solid $border-color;
  position: relative;

  &.book-item--page-first {
    padding-top: 36.8px;
  }

  .book-item-page-divider {
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    font-size: $font-size-medium-x;
    color: $font-color-ll;
    background: $theme-color;
    padding: 3.2px 8px;
    border-radius: 4.8px;
  }

  .book-item__title {
    font-size: $font-size-large-x;
    color: $font-color-dd;
    font-weight: bold;

    &::before {
      content: "";
      float: left;
      width: 4.8px;
      height: 19.2px;
      background: $theme-color;
      margin: 0 3.2px 0 0;
    }
  }

  .book-item__info {
    margin-top: 11.2px;
    font-size: $font-size-medium;
    display: flex;
    justify-content: space-between;
  }

  .book-item__describe {
    margin-top: 11.2px;
    color: $font-color-d;
  }
}
</style>
