import { createI18n } from "vue-i18n";
import zh from "./locales/zh-CN";
import en from "./locales/en";
import de from "./locales/de";
import fr from "./locales/fr";
import ja from "./locales/ja";
import ru from "./locales/ru";

// 定义语言类型
type Language = "zh-CN" | "en" | "de" | "fr" | "ja" | "ru";

// 支持的语言列表
export const SUPPORTED_LANGUAGES: Record<Language, string> = {
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
      products: "全部商品",
      categories: "商品分类",
      brands: "品牌专区",
    },
    error: {
      pageNotFound: "页面不存在",
    },
    common: {
      title: "SOSO商城",
      backToHome: "返回首页",
      viewAll: "查看全部",
      error: {
        fetchFailed: "数据加载失败",
      },
      allRightsReserved: "版权所有",
    },
    home: {
      banner: {
        viewMore: "了解更多",
      },
      categories: {
        title: "商品分类",
        products: "件商品",
      },
      hotProducts: {
        title: "热卖商品",
      },
      newProducts: {
        title: "新品上架",
      },
      brands: {
        title: "品牌展示",
        products: "件商品",
      },
    },
    product: {
      addToCart: "加入购物车",
    },
    user: {
      profile: "个人资料",
      orders: "我的订单",
    },
    auth: {
      login: "登录",
      register: "注册",
      logout: "退出登录",
      logoutSuccess: "退出成功",
    },
  },
  en: {
    nav: {
      home: "Home",
      cart: "Cart",
      user: "User",
      products: "Products",
      categories: "Categories",
      brands: "Brands",
    },
    error: {
      pageNotFound: "Page not found",
    },
    common: {
      title: "SOSO Mall",
      backToHome: "Back to Home",
      viewAll: "View All",
      error: {
        fetchFailed: "Failed to load data",
      },
      allRightsReserved: "All Rights Reserved",
    },
    home: {
      banner: {
        viewMore: "Learn More",
      },
      categories: {
        title: "Categories",
        products: "Products",
      },
      hotProducts: {
        title: "Hot Products",
      },
      newProducts: {
        title: "New Arrivals",
      },
      brands: {
        title: "Brands",
        products: "Products",
      },
    },
    product: {
      addToCart: "Add to Cart",
    },
    user: {
      profile: "Profile",
      orders: "Orders",
    },
    auth: {
      login: "Login",
      register: "Register",
      logout: "Logout",
      logoutSuccess: "Logout successful",
    },
  },
  de,
  fr,
  ja,
  ru,
};

// 获取浏览器语言设置
const getBrowserLanguage = (): Language => {
  const language = navigator.language as Language;
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
export const setLocale = (locale: Language) => {
  i18n.global.locale.value = locale;
  localStorage.setItem("locale", locale);
  document.querySelector("html")?.setAttribute("lang", locale);
};

export default i18n;
