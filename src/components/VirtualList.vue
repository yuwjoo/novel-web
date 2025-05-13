<template>
  <DynamicScroller
    :items="list"
    :min-item-size="minItemSize"
    class="virtual-list"
    :buffer="buffer"
    emitUpdate
    :keyField="keyField"
    @update="handleUpdate"
  >
    <template #default="{ item, index, active }">
      <DynamicScrollerItem :item="item" :active="active" :data-index="index">
        <slot :item="item" :active="active" :index="index" />
      </DynamicScrollerItem>
    </template>
    <template v-if="!loading && list.length === 0" #empty>
      <div class="virtual-list__empty">暂无数据</div>
    </template>
    <template v-if="loading && !onMore" #after>
      <div class="virtual-list__loading">Loading ...</div>
    </template>
  </DynamicScroller>
</template>

<script setup lang="ts">
defineOptions({
  name: "virtual-list"
});

const emit = defineEmits<{
  "scroll-bottom": [];
  "current-item-index": [number];
}>();

const props = defineProps({
  // 列表数据
  list: {
    type: Array,
    required: true
  },
  // item最小尺寸
  minItemSize: {
    type: Number,
    required: true
  },
  // 滚动缓冲区
  buffer: {
    type: Number,
    default: 0
  },
  // 加载中
  loading: {
    type: Boolean,
    default: false
  },
  // 没有更多数据
  onMore: {
    type: Boolean,
    default: false
  },
  // item唯一key
  keyField: {
    type: String,
    default: "id"
  }
});

const listLength = computed(() => props.list.length);

const af = ref<number>(-1);

const handleUpdate = (_startIndex: number, endIndex: number, _visibleStartIndex: number, visibleEndIndex: number) => {
  cancelAnimationFrame(af.value);
  af.value = requestAnimationFrame(() => {
    if (endIndex === listLength.value) {
      emit("scroll-bottom");
    }
    emit("current-item-index", visibleEndIndex);
  });
};
</script>

<style lang="scss" scoped>
.virtual-list {
  &__empty {
    text-align: center;
    padding: 10px 0;
  }

  &__loading {
    text-align: center;
    padding: 10px 0;
  }
}
</style>
