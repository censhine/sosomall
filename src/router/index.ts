import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/user";
import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("@/views/Home.vue"),
      },
      {
        path: "products",
        name: "products",
        component: () => import("@/views/ProductList.vue"),
      },
      {
        path: "product/:id",
        name: "product",
        component: () => import("@/views/Product.vue"),
        props: true,
      },
      {
        path: "cart",
        name: "cart",
        component: () => import("@/views/Cart.vue"),
      },
      {
        path: "checkout",
        name: "checkout",
        component: () => import("@/views/Checkout.vue"),
        meta: { requiresAuth: true },
      },
      // 用户中心路由
      {
        path: "user",
        component: () => import("@/layouts/UserLayout.vue"),
        meta: { requiresAuth: true },
        children: [
          {
            path: "",
            redirect: { name: "UserProfile" },
          },
          {
            path: "profile",
            name: "UserProfile",
            component: () => import("@/views/user/profile/index.vue"),
            meta: {
              title: "个人中心",
              requiresAuth: true,
            },
          },
          {
            path: "orders",
            name: "UserOrders",
            component: () => import("@/views/user/Orders.vue"),
            meta: { requiresAuth: true },
          },
          {
            path: "favorites",
            name: "UserFavorites",
            component: () => import("@/views/user/Favorites.vue"),
            meta: { requiresAuth: true },
          },
          {
            path: "addresses",
            name: "UserAddresses",
            component: () => import("@/views/user/Addresses.vue"),
            meta: { requiresAuth: true },
          },
          {
            path: "settings",
            name: "UserSettings",
            component: () => import("@/views/user/Settings.vue"),
            meta: { requiresAuth: true },
          },
        ],
      },
    ],
  },
  {
    path: "/auth",
    component: () => import("@/layouts/AuthLayout.vue"),
    children: [
      {
        path: "login",
        name: "login",
        component: () => import("@/views/auth/Login.vue"),
        meta: { guest: true },
      },
      {
        path: "register",
        name: "register",
        component: () => import("@/views/auth/Register.vue"),
        meta: { guest: true },
      },
      {
        path: "forgot-password",
        name: "forgot-password",
        component: () => import("@/views/auth/ForgotPassword.vue"),
        meta: { guest: true },
      },
      {
        path: "reset-password",
        name: "reset-password",
        component: () => import("@/views/auth/ResetPassword.vue"),
        meta: { guest: true },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("@/views/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();

  // 初始化用户状态
  if (!userStore.isInitialized) {
    await userStore.init();
  }

  // 检查页面是否需要认证
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // 如果需要认证且未登录，重定向到登录页
    if (!userStore.isLoggedIn) {
      next({
        path: "/auth/login",
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  } else if (to.meta.guest && userStore.isLoggedIn) {
    // 已登录用户不能访问游客页面
    next({ name: "home" });
  } else {
    next();
  }
});

export default router;
