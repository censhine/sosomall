/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// 声明 Vite 环境变量
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Element Plus 组件类型声明
declare module "vue" {
  export interface GlobalComponents {
    ElButton: (typeof import("element-plus"))["ElButton"];
    ElCard: (typeof import("element-plus"))["ElCard"];
    ElCarousel: (typeof import("element-plus"))["ElCarousel"];
    ElCarouselItem: (typeof import("element-plus"))["ElCarouselItem"];
    ElRow: (typeof import("element-plus"))["ElRow"];
    ElCol: (typeof import("element-plus"))["ElCol"];
    ElRate: (typeof import("element-plus"))["ElRate"];
    ElProgress: (typeof import("element-plus"))["ElProgress"];
    ElRadioGroup: (typeof import("element-plus"))["ElRadioGroup"];
    ElRadioButton: (typeof import("element-plus"))["ElRadioButton"];
    ElPagination: (typeof import("element-plus"))["ElPagination"];
    ElDialog: (typeof import("element-plus"))["ElDialog"];
    ElForm: (typeof import("element-plus"))["ElForm"];
    ElFormItem: (typeof import("element-plus"))["ElFormItem"];
    ElInput: (typeof import("element-plus"))["ElInput"];
    ElDropdown: (typeof import("element-plus"))["ElDropdown"];
    ElDropdownMenu: (typeof import("element-plus"))["ElDropdownMenu"];
    ElDropdownItem: (typeof import("element-plus"))["ElDropdownItem"];
    ElTag: (typeof import("element-plus"))["ElTag"];
    ElIcon: (typeof import("element-plus"))["ElIcon"];
    ElMessage: (typeof import("element-plus"))["ElMessage"];
  }
}
