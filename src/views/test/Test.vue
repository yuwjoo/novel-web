<template>
  <div class="test">
    <VirtualList class="test__list" :list="list" :min-item-size="200" :buffer="0" key-field="id">
      <template #default="{ item }">
        <div style="height: 200px; border: 1px solid #ccc">{{ item.name }}</div>
      </template>
    </VirtualList>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "test"
});

const list = ref(Array.from({ length: 100 }).map((item, index) => ({ id: index, name: index })));
</script>

<style lang="scss" scoped>
.test {
  &__list {
    height: 100vh;
  }
}
</style>
