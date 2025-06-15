<template>
  <div class="test-page">
    <book-reader />
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import BookReader from "./components/book-reader/book-reader.vue";
import { request } from "@/utils/axios";

defineOptions({
  name: "test-page"
});

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

// const formData = new FormData();
// formData.append("keyword", "姐姐");
// formData.append("page", 2);
// formData.append("size", 10);

// requestApp({
//   url: "http://192.168.0.108:3000/test-post",
//   method: "post",
//   params: {
//     name: "test22",
//     age: 18
//   },
//   cancelToken: source.token,
//   headers: {
//     // "Content-Type": "text/plain"
//   },
//   data: {
//     aa: 1,
//     bb: 2
//   }
// })
//   .then((res) => {
//     console.log("请求成功", res);
//   })
//   .catch((err) => {
//     if (axios.isCancel(err)) {
//       console.log("请求被取消", err.message);
//     } else {
//       console.error("请求失败", err);
//     }
//   });

request({
  url: "http://192.168.0.108:3000/test-post",
  method: "post",
  params: {
    name: "test22",
    age: 18
  },
  cancelToken: source.token,
  headers: {},
  data: {
    aa: 1,
    bb: 2
  },
  sendEnv: "android"
})
  .then((res) => {
    console.log("请求成功1", res);
  })
  .catch((err) => {
    if (axios.isCancel(err)) {
      console.log("请求被取消", err.message);
    } else {
      console.error("请求失败", err);
    }
  });

// setTimeout(() => {
//   source.cancel("3333");
// }, 2000);
</script>

<style lang="scss" scoped>
.test-page {
}
</style>
