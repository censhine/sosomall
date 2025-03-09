import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./styles/main.css";
import App from "./App.vue";
import router from "./router";
import { createI18n } from "vue-i18n";
import zhCN from "@/locales/zh-CN";
import enUS from "@/locales/en-US";

// 创建 Vue 应用实例
const app = createApp(App);

// 创建 Pinia 实例
const pinia = createPinia();

// 创建 i18n 实例
const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("locale") || "zh-CN",
  fallbackLocale: "zh-CN",
  messages: {
    "zh-CN": zhCN,
    "en-US": enUS,
  },
});

// 使用插件
app.use(pinia);
app.use(router);
app.use(ElementPlus);
app.use(i18n);

// 挂载应用
app.mount("#app");
