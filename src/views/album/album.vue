<template>
  <div class="album">
    <search-box class="album-search" v-model="searchKeyText" />

    <div class="album-item-panel">
      <div class="album-item-panel__header">
        <div class="album-item-panel__title">相册分类</div>
        <div class="album-item-panel__manage-btn" @click="toggleManageMode">{{ isManageMode ? "取消" : "管理" }}</div>
      </div>

      <div class="album-item-panel__content">我是内容</div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import CardBox from "./components/cardBox.vue";
// import AlbumList from "./components/albumList.vue";
import searchBox from "./components/searchBox.vue";

const searchKeyText = ref(""); // 模糊搜索关键字
const isManageMode = ref(false); // 是否管理模式

/**
 * 切换管理模式
 */
const toggleManageMode = () => {
  isManageMode.value = !isManageMode.value;
};
</script>

<style lang="scss" scoped>
.album {
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
  background: linear-gradient(45deg, rgba($theme-color, 0.08) 55%, rgba(219, 56, 100, 0.1));
}

.album-search {
  margin-bottom: 40px;
}

.album-item-panel {
  &__header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  &__title {
    color: black;
    font-size: 18px;
    display: flex;
    align-items: center;

    &::before {
      content: "";
      display: block;
      width: 5px;
      height: 100%;
      padding: 2px 0;
      background: linear-gradient(0deg, rgba($theme-color, 0.5) 30%, rgba(219, 56, 100, 0.3) 70%);
      border-radius: 5px;
      margin-right: 5px;
    }
  }
}
</style>
