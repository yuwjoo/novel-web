<template>
  <div class="menu-navbar">
    <div class="menu-navbar__title">
      <span class="menu-navbar__title-item menu-navbar__platform" @click="showPicker = true">
        {{ bookPlatform.currentPlatform?.name }}
        <van-icon class="menu-navbar__platform-icon" name="arrow-down" />
      </span>
      <span class="menu-navbar__title-item menu-navbar__label">{{ route.meta.title }}</span>
    </div>

    <van-popup v-model:show="showPicker" round position="bottom">
      <van-picker
        title="小说平台"
        :columns="bookPlatform.bookPlatformList"
        :columns-field-names="{ text: 'name', value: 'key' }"
        @cancel="showPicker = false"
        @confirm="handleConfirmPlatform"
      />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "@/router";
import { useBookPlatform } from "@/store/bookPlatform";

defineOptions({
  name: "menu-navbar"
});

const route = useRoute();
const bookPlatform = useBookPlatform();

const showPicker = ref(false); // 显示平台选择器

/**
 * @description: 处理确认选择平台
 * @param {string[]} selectedValues 当前选中值集合
 */
const handleConfirmPlatform = ({ selectedValues }) => {
  bookPlatform.currentPlatformKey = selectedValues[0];
  showPicker.value = false;
};
</script>

<style lang="scss" scoped>
.menu-navbar {
  height: 44px;
  background: $theme-color;
  font-size: $font-size-large;
  color: $font-color-ll;
  line-height: 44px;

  &__title {
    display: flex;

    &-item {
      flex-basis: calc(100% / 3);
    }
  }

  &__platform {
    font-size: $font-size-medium;
    padding-left: 10px;

    &-icon {
      margin-left: 2px;
    }
  }

  &__label {
    text-align: center;
  }
}
</style>
