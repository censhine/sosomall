import { createI18n } from "vue-i18n";
import zh from "./locales/zh-CN";
import en from "./locales/en";
import de from "./locales/de";
import fr from "./locales/fr";
import ja from "./locales/ja";
import ru from "./locales/ru";

// 支持的语言列表
export const SUPPORTED_LANGUAGES = {
  "zh-CN": "简体中文",
  en: "English",
  de: "Deutsch",
  fr: "Français",
  ja: "日本語",
  ru: "Русский",
};

const messages = {
  "zh-CN": {
    nav: {
      home: "首页",
      cart: "购物车",
      user: "个人中心",
    },
    error: {
      pageNotFound: "页面不存在",
    },
    common: {
      backToHome: "返回首页",
    },
    home: {
      hotProducts: "热卖商品",
      newProducts: "新品上架",
      categories: "商品分类",
      brands: "品牌展示",
    },
    product: {
      addToCart: "加入购物车",
    },
  },
  en: {
    nav: {
      home: "Home",
      cart: "Cart",
      user: "User",
    },
    error: {
      pageNotFound: "Page not found",
    },
    common: {
      backToHome: "Back to Home",
    },
    home: {
      hotProducts: "Hot Products",
      newProducts: "New Arrivals",
      categories: "Categories",
      brands: "Brands",
    },
    product: {
      addToCart: "Add to Cart",
    },
  },
  de,
  fr,
  ja,
  ru,
};

// 获取浏览器语言设置
const getBrowserLanguage = () => {
  const language = navigator.language;
  return Object.keys(messages).includes(language) ? language : "en";
};

// 创建 i18n 实例
const i18n = createI18n({
  legacy: false, // 使用组合式 API
  locale: localStorage.getItem("locale") || getBrowserLanguage(), // 优先使用本地存储的语言设置
  fallbackLocale: "en", // 回退语言
  messages,
});

// 切换语言的工具函数
export const setLocale = (locale: string) => {
  i18n.global.locale.value = locale;
  localStorage.setItem("locale", locale);
  document.querySelector("html")?.setAttribute("lang", locale);
};

export default i18n;
