<template>
  <div class="book-city">
    <van-dropdown-menu class="book-city__dropdown dropdown-menu">
      <van-dropdown-item v-model="downMenuForm.classify" :options="bookClassifyList" @change="handleChangeClassify" />
      <van-dropdown-item
        :title="`第${listCurrentPage}页`"
        ref="searchDropdownItemRef"
        @open="handleOpenSearchDropdownItem"
      >
        <van-cell center title="当前页">
          <template #right-icon>
            <van-stepper
              v-model="downMenuForm.current"
              theme="round"
              integer
              min="1"
              :max="page.total"
              button-size="22"
            />
          </template>
        </van-cell>
        <van-cell center title="总页数" :value="countPage" />
        <div class="dropdown-menu__item-btn">
          <van-button type="primary" block round @click="handleSearchConfirm"> 跳转 </van-button>
        </div>
      </van-dropdown-item>
    </van-dropdown-menu>
    <VirtualList
      class="book-city__list"
      :list="list"
      :min-item-size="200"
      :buffer="500"
      :loading="loading"
      :on-more="onMore"
      @scroll-bottom="handleScrollBottom"
      @current-item-index="handleCurrentItemIndex"
    >
      <template #default="{ item, index }">
        <BookItem :source="item" :index="index" />
      </template>
    </VirtualList>
  </div>
</template>

<script setup lang="ts">
import type { DropdownItemOption } from "vant";
import BookItem from "./components/BookItem.vue";
import { getBookList, getBookClassify } from "@/api/lengku8";

defineOptions({
  name: "book-city"
});

const list = ref<Record<string, any>[]>([]); // 列表数据
const page = reactive({
  current: 1, // 当前页
  size: 0, // 每页条数
  total: 0 // 总条数
});
const loading = ref(false); // 加载中
const onMore = ref(false); // 没有更多数据
const downMenuForm = reactive({
  classify: "0",
  current: 1
}); // 下拉筛选表单
const countPage = computed(() => page.total / page.size); // 总页数
const listCurrentPage = ref(1); // 当前列表展示页

const searchDropdownItemRef = useTemplateRef("searchDropdownItemRef"); // 筛选下拉框

const bookClassifyList = ref<DropdownItemOption[]>([]); // 分类列表

/**
 * @description: 获取分类列表
 */
const getBookClassifyList = async () => {
  const res = await getBookClassify();
  bookClassifyList.value = res.map((item) => ({
    text: item.title,
    value: item.id
  }));
};

/**
 * @description: 获取页面数据
 */
const getList = async () => {
  try {
    loading.value = true;
    const res = await getBookList({
      current: page.current,
      classify: downMenuForm.classify
    });
    page.current = res.current;
    page.total = res.total;
    page.size = res.size;
    list.value.push(
      ...res.data.map((item, index) => {
        return {
          id: item.id,
          bookInfo: {
            ...item.bookInfo,
            page: {
              ...page,
              index
            }
          }
        };
      })
    );
  } finally {
    loading.value = false;
  }
};

/**
 * @description: 处理滚动到底部
 */
const handleScrollBottom = () => {
  if (!loading.value && page.current + 1 <= countPage.value) {
    page.current++;
    getList();
  }
};

/**
 * @description: 处理列表当前展示项索引
 * @param {number} index item下标
 */
const handleCurrentItemIndex = (index: number) => {
  if (!list.value[index]) return;
  listCurrentPage.value = list.value[index].bookInfo.page.current;
};

/**
 * @description: 处理筛选下拉框打开
 */
const handleOpenSearchDropdownItem = () => {
  downMenuForm.current = listCurrentPage.value;
};

/**
 * @description: 处理筛选确认
 */
const handleSearchConfirm = () => {
  (searchDropdownItemRef.value as unknown as { toggle: () => void }).toggle();
  list.value = [];
  page.current = downMenuForm.current;
  getList();
};

/**
 * @description: 处理类型改变
 */
const handleChangeClassify = () => {
  list.value = [];
  page.current = 1;
  getList();
};

getBookClassifyList();
getList();
</script>

<style lang="scss" scoped>
.book-city {
  height: 100%;
  display: flex;
  flex-direction: column;

  &__list {
    height: 0;
    flex-grow: 1;
  }
}

.dropdown-menu {
  &__item-btn {
    padding: 10px 16px;
  }
}
</style>
