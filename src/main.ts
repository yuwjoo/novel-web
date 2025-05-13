import "normalize.css";
import "@/assets/style/base.scss";
import App from "@/App.vue";
import { createApp } from "vue";
import { useRouter } from "@/router";
import { createPinia } from "pinia";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import VirtualScroller from "vue-virtual-scroller";

const app = createApp(App);

app.use(VirtualScroller);

app.use(createPinia());
app.use(useRouter());

app.mount("#app");
