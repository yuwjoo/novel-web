<template>
  <div class="layout">
    <MenuNavbar v-show="route.meta.main" class="layout__header" />
    <div class="layout__content">
      <RouterView v-slot="{ Component }">
        <KeepAlive :include="routerStore.keepAliveList">
          <Component :is="Component" />
        </KeepAlive>
      </RouterView>
    </div>
    <MenuTabbar v-show="route.meta.main" class="layout__footer" />
  </div>
</template>

<script setup lang="ts">
import MenuNavbar from "@/layout/components/MenuNavbar.vue";
import MenuTabbar from "@/layout/components/MenuTabbar.vue";
import { useRoute } from "@/router";
import { useRouterStore } from "@/store/router";

defineOptions({
  name: "layout"
});

const route = useRoute();

const routerStore = useRouterStore();
</script>

<style lang="scss" scoped>
.layout {
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
