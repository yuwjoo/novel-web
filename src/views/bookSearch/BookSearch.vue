<template>
  <div class="book-search">
    <van-search v-model="searchValue" placeholder="请输入书名或者作者名" @search="handleSearch" @clear="handleClear" />

    <VirtualList
      class="book-search__list"
      :list="list"
      :min-item-size="80"
      :buffer="500"
      :loading="loading"
      @scroll-bottom="handleScrollBottom"
    >
      <template #default="{ item, index }">
        <BookItem :source="item" :index="index" :search-value="searchValue" />
      </template>
    </VirtualList>
  </div>
</template>

<script setup lang="ts">
import { searchBook, SearchBookItem } from "@/api/lengku8";
import BookItem from "./components/BookItem.vue";

defineOptions({
  name: "book-search"
});

const searchValue = ref(""); // 模糊搜索值
const page = reactive({
  current: 1,
  size: 0,
  total: 0
});
const loading = ref(false);
const list = ref<SearchBookItem[]>([]);

/**
 * @description: 处理模糊查询
 */
const handleSearch = () => {
  page.current = 1;
  page.size = 0;
  page.total = 0;
  getData();
};

/**
 * @description: 处理清除查询
 */
const handleClear = () => {
  list.value = [];
};

/**
 * @description: 获取页面数据
 */
const getData = async () => {
  loading.value = true;
  try {
    const res = await searchBook({ searchValue: searchValue.value, current: page.current });
    page.current = res.currentPage;
    page.total = res.totalPage;
    list.value.push(...res.list);
  } finally {
    loading.value = false;
  }
};

/**
 * @description: 处理滚动到底部
 */
const handleScrollBottom = () => {
  if (!loading.value && page.current + 1 <= page.total) {
    page.current++;
    getData();
  }
};
</script>

<style lang="scss" scoped>
.book-search {
  height: 100%;
  display: flex;
  flex-direction: column;

  &__list {
    height: 0;
    flex-grow: 1;
  }
}
</style>
