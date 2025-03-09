import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/user";

const router = createRouter({
  history: createWebHistory(),
  routes: [
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
        {
          path: "user",
          name: "user",
          component: () => import("@/views/user/UserCenter.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "orders",
          name: "orders",
          component: () => import("@/views/user/Orders.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "category",
          name: "categories",
          component: () => import("@/views/Category.vue"),
        },
        {
          path: "category/:id",
          name: "category",
          component: () => import("@/views/Category.vue"),
          props: true,
        },
        {
          path: "brand",
          name: "brands",
          component: () => import("@/views/Brand.vue"),
        },
        {
          path: "brand/:id",
          name: "brand",
          component: () => import("@/views/Brand.vue"),
          props: true,
        },
        {
          path: "terms",
          name: "terms",
          component: () => import("@/views/Terms.vue"),
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
  ],
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  // 需要登录的页面
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next({ name: "login", query: { redirect: to.fullPath } });
    return;
  }

  // 已登录用户不能访问游客页面
  if (to.meta.guest && userStore.isLoggedIn) {
    next({ name: "home" });
    return;
  }

  next();
});

export default router;
