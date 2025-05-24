<template>
  <div class="layout-main">
    <menu-navbar v-show="route.meta.main" class="layout-main__header" />
    <div class="layout-main__content">
      <router-view v-slot="{ Component }" :key="bookPlatform.currentPlatformKey">
        <keep-alive :include="routerStore.keepAliveList">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
    <menu-tabbar v-show="route.meta.main" class="layout-main__footer" />
  </div>
</template>

<script setup lang="ts">
import MenuNavbar from "@/layout/components/menu-navbar.vue";
import MenuTabbar from "@/layout/components/menu-tabbar.vue";
import { useRoute } from "@/router";
import { useBookPlatform } from "@/store/bookPlatform";
import { useRouterStore } from "@/store/router";

defineOptions({
  name: "layout-main"
});

const route = useRoute();

const routerStore = useRouterStore();
const bookPlatform = useBookPlatform();
</script>

<style lang="scss" scoped>
.layout-main {
  display: flex;
  flex-direction: column;
  height: 100vh;

  &__header {
    flex-shrink: 0;
  }

  &__content {
    flex-grow: 1;
    height: 0;
    overflow: auto;
  }

  &__footer {
    flex-shrink: 0;
  }
}
</style>
