<template>
  <div class="book-item" @click="handleClickItem(source)">
    <van-highlight class="book-item__title" :keywords="[searchValue]" :source-string="source.title" />
    <div class="book-item__info">
      <div class="book-item__classify">分类：{{ source.classify }}</div>
      <div class="book-item__author">
        作者：<van-highlight :keywords="[searchValue]" :source-string="source.author" />
      </div>
    </div>
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
    },
    searchValue: {
      type: String,
      required: true
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
  padding: 15px 10px;
  border-bottom: 1px solid $border-color;

  .book-item__title {
    color: $font-color-dd;
    font-weight: bold;
  }

  .book-item__info {
    display: flex;
    justify-content: space-between;
    font-size: $font-size-medium;
    margin-top: 20px;

    .book-item__classify {
    }

    .book-item__author {
      display: flex;
    }
  }
}
</style>
