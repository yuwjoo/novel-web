<template>
  <div class="menu-navbar">
    <div class="menu-navbar__title">{{ route.meta.title }}</div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "@/router";

defineOptions({
  name: "menu-navbar"
});

const route = useRoute();
</script>

<style lang="scss" scoped>
.menu-navbar {
  height: 44px;
  background: $theme-color;
  font-size: $font-size-large;
  color: $font-color-ll;
  text-align: center;
  line-height: 44px;
}
</style>
