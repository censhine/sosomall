<template>
  <el-container class="app-container">
    <el-header class="app-header">
      <div class="header-left">
        <router-link to="/" class="logo">
          <img src="@/assets/logo.svg" alt="Logo" />
          <span>{{ $t("common.title") }}</span>
        </router-link>
        <el-menu mode="horizontal" :router="true" class="nav-menu">
          <el-menu-item index="/">{{ $t("nav.home") }}</el-menu-item>
          <el-menu-item index="/products">{{
            $t("nav.products")
          }}</el-menu-item>
          <el-menu-item index="/category">{{
            $t("nav.categories")
          }}</el-menu-item>
          <el-menu-item index="/brand">{{ $t("nav.brands") }}</el-menu-item>
        </el-menu>
      </div>
      <div class="header-right">
        <language-switcher />
        <router-link to="/cart" class="cart-link">
          <el-badge :value="cartCount" :hidden="!cartCount">
            <el-icon><shopping-cart /></el-icon>
          </el-badge>
        </router-link>
        <template v-if="isAuthenticated">
          <el-dropdown>
            <span class="user-dropdown">
              <el-avatar :size="32" :src="userAvatar" />
              <span>{{ userNickname }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <router-link to="/user/profile">{{
                    $t("user.profile")
                  }}</router-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <router-link to="/user/orders">{{
                    $t("user.orders")
                  }}</router-link>
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">
                  {{ $t("auth.logout") }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template v-else>
          <router-link to="/auth/login" class="auth-link">
            {{ $t("auth.login") }}
          </router-link>
          <router-link to="/auth/register" class="auth-link">
            {{ $t("auth.register") }}
          </router-link>
        </template>
      </div>
    </el-header>
    <el-main class="app-main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
      <el-backtop />
    </el-main>
    <el-footer class="app-footer">
      <div class="footer-content">
        <p>
          &copy; {{ currentYear }} {{ $t("common.title") }}.
          {{ $t("common.allRightsReserved") }}
        </p>
      </div>
    </el-footer>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from "@vue/runtime-core";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
import { ShoppingCart } from "@element-plus/icons-vue";
import LanguageSwitcher from "@/components/LanguageSwitcher.vue";
import { useUserStore } from "@/stores/user";
import { useCartStore } from "@/stores/cart";

const { t } = useI18n();
const userStore = useUserStore();
const cartStore = useCartStore();

const currentYear = computed(() => new Date().getFullYear());
const isAuthenticated = computed(() => userStore.isAuthenticated);
const cartCount = computed(() => cartStore.count);
const userAvatar = computed(() => userStore.user?.avatar || "");
const userNickname = computed(() => userStore.user?.nickname || "");

const handleLogout = async () => {
  try {
    await userStore.logou$t();
    cartStore.clear();
    ElMessage.success($t("auth.logoutSuccess"));
  } catch (error) {
    console.error("Logout failed:", error);
    ElMessage.error($t("common.error"));
  }
};
</script>

<style scoped>
.app-container {
  min-height: 100vh;
}

.app-header {
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 64px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: var(--el-text-color-primary);
  font-size: 20px;
  font-weight: 600;
}

.logo img {
  height: 40px;
  width: auto;
}

.nav-menu {
  border-bottom: none;
  margin-left: 20px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.cart-link {
  color: var(--el-text-color-primary);
  font-size: 24px;
  text-decoration: none;
  display: flex;
  align-items: center;
}

.cart-link:hover {
  color: var(--el-color-primary);
}

.cart-link :deep(.el-badge__content) {
  background-color: var(--el-color-danger);
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-dropdown:hover {
  background-color: var(--el-fill-color-light);
}

.auth-link {
  color: var(--el-text-color-primary);
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 4px;
  transition: all 0.3s;
}

.auth-link:hover {
  color: var(--el-color-primary);
  background-color: var(--el-fill-color-light);
}

.app-main {
  background-color: var(--el-bg-color-page);
  padding: 20px;
  min-height: calc(100vh - 64px - 60px);
}

.app-footer {
  background-color: var(--el-bg-color);
  border-top: 1px solid var(--el-border-color-light);
  padding: 20px;
  height: 60px;
}

.footer-content {
  text-align: center;
  color: var(--el-text-color-secondary);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
