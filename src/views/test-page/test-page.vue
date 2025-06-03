<template>
  <div class="test-page">
    <book-reader />
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import BookReader from "./components/book-reader/book-reader.vue";
import { requestApp } from "@/utils/request";

defineOptions({
  name: "test-page"
});

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

requestApp({
  url: "/aa",
  cancelToken: source.token,
  headers: {
    "Access-Control-Allow-Origin": "*",
    Accept: "aa"
  }
});

setTimeout(() => {
  source.cancel("3333");
}, 2000);
</script>

<style lang="scss" scoped>
.test-page {
}
</style>
