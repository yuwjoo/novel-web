<template>
  <div class="test-page">
    <book-reader />
  </div>
</template>

<script setup lang="ts">
import BookReader from "./components/book-reader/book-reader.vue";

defineOptions({
  name: "test-page"
});
</script>

<style lang="scss" scoped>
.test-page {
}
</style>
