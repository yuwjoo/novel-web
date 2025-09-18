<template>
  <div class="search-box">
    <input class="search-box__input" type="text" placeholder="搜索相册名称" v-model="modelValue" />
    <i-tabler-search class="search-box__search-icon" />
  </div>
</template>

<script setup lang="ts">
const modelValue = defineModel({
  type: String
}); // 输入的文字
</script>

<style lang="scss" scoped>
$borderColor: black; // 边框颜色
$bgColor: transparent; // 背景颜色

.search-box {
  display: flex;
  padding: 15px;
  box-sizing: border-box;
  border: 3px solid $borderColor;
  border-radius: 15px;
  background-color: $bgColor;

  &__input {
    background-color: transparent;
    border: none;
    flex-grow: 1;
    color: black;
    padding: 0;
  }

  &__search-icon {
    font-size: 26px;
    color: $borderColor;
    flex-shrink: 0;
  }
}
</style>
