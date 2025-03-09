import { defineStore } from "pinia";

export type Locale = "zh-CN" | "en-US";

export const useLocaleStore = defineStore("locale", {
  state: () => ({
    locale: (localStorage.getItem("locale") || "zh-CN") as Locale,
  }),

  getters: {
    currentLocale: (state) => state.locale,
  },

  actions: {
    setLocale(locale: Locale) {
      this.locale = locale;
      localStorage.setItem("locale", locale);
    },

    // 初始化语言设置
    init() {
      const savedLocale = localStorage.getItem("locale");
      if (savedLocale && (savedLocale === "zh-CN" || savedLocale === "en-US")) {
        this.locale = savedLocale;
      }
    },
  },
});
