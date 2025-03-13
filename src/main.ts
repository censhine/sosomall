import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "@/styles/index.scss";
import App from "./App.vue";
import router from "./router";
import i18n from "./i18n";

// 开发环境下引入mock服务
if (import.meta.env.DEV) {
  await import("./mock");
}

// 创建 Vue 应用实例
const app = createApp(App);

// 创建 Pinia 实例
const pinia = createPinia();

// 使用插件
app.use(pinia);
app.use(router);
app.use(ElementPlus);
app.use(i18n);

// 挂载应用
app.mount("#app");
