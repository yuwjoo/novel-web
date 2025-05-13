<template>
  <div class="book-item">
    <h1 class="book-item__title">{{ source.title }}</h1>
    <p class="book-item__text" v-for="(text, index) in source.contents" :key="index">
      {{ text }}
    </p>
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
  }
};
</script>

<style lang="scss" scoped>
.book-item {
  padding-bottom: 0.625rem;

  &:last-of-type {
    padding-bottom: 4.5rem;
  }

  .book-item__title {
    width: 100%;
    font-size: calc(24px + var(--book-read-font-size-scale));
    line-height: 48px;
    color: var(--book-read-title-color, $font-color-dd);
    padding-top: 32px;
    font-weight: 600;
  }

  .book-item__text {
    margin-top: 8px;
    width: 100%;
    text-indent: 32px;
    line-height: 1.5;
    color: var(--book-read-color);
    font-size: calc(1em + var(--book-read-font-size-scale));
  }
}
</style>
