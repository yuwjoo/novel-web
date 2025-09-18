import "normalize.css";
import "font-awesome/css/font-awesome.min.css";
import "@/assets/style/base.scss";
import App from "@/App.vue";
import { createApp } from "vue";
import { useRouter } from "@/router";
import { createPinia } from "pinia";
// import VConsole from "vconsole";

// new VConsole();

const app = createApp(App);

app.use(createPinia());
app.use(useRouter());

app.mount("#app");
