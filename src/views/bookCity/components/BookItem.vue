<template>
  <div
    class="book-item"
    :class="{ 'book-item--page-first': source.bookInfo.page.index === 0 }"
    @click="handleClickItem(source)"
  >
    <div v-if="source.bookInfo.page.index === 0" class="book-item-page-divider">
      第{{ source.bookInfo.page.current }}/{{ source.bookInfo.page.total / source.bookInfo.page.size }}页
    </div>
    <div class="book-item__title">{{ source.bookInfo.title }}</div>
    <div class="book-item__info">
      <div class="book-item__author">作者：{{ source.bookInfo.author }}</div>
      <div class="book-item__update-date">最近更新：{{ source.bookInfo.updateDate }}</div>
    </div>
    <div class="book-item__describe">{{ source.bookInfo.describe }}</div>
  </div>
</template>

<script>
export default {
  name: "book-item",
  props: {
    index: {
      type: Number
    },
    source: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  methods: {
    // 点击书籍跳转到详情页
    handleClickItem(item) {
      this.$router.push({
        name: "bookDetail",
        query: {
          id: item.id
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.book-item {
  padding: 1rem 0.625rem;
  border-bottom: 1px solid $border-color;
  position: relative;

  &.book-item--page-first {
    padding-top: 2.3rem;
  }

  .book-item-page-divider {
    position: absolute;
    top: 0.5rem;
    left: 50%;
    transform: translateX(-50%);
    font-size: $font-size-medium-x;
    color: $font-color-ll;
    background: $theme-color;
    padding: 0.2rem 0.5rem;
    border-radius: 0.3rem;
  }

  .book-item__title {
    font-size: $font-size-large-x;
    color: $font-color-dd;
    font-weight: bold;

    &::before {
      content: "";
      float: left;
      width: 0.3rem;
      height: 1.2rem;
      background: $theme-color;
      margin: 0 0.2rem 0 0;
    }
  }

  .book-item__info {
    margin-top: 0.7rem;
    font-size: $font-size-medium;
    display: flex;
    justify-content: space-between;
  }

  .book-item__describe {
    margin-top: 0.7rem;
    color: $font-color-d;
  }
}
</style>
