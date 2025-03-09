<template>
  <div class="user-center">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="user-info-card">
          <div class="user-avatar">
            <el-avatar :size="80" :src="userStore.user?.avatar" />
          </div>
          <h3 class="user-name">{{ userStore.user?.nickname }}</h3>
          <p class="user-email">{{ userStore.user?.email }}</p>
          <p class="join-date">
            {{ $t("user.joinDate") }}: {{ userStore.user?.createdAt }}
          </p>
          <el-menu class="user-menu" router>
            <el-menu-item index="/user/profile">
              <el-icon><user /></el-icon>
              <span>{{ $t("user.profile") }}</span>
            </el-menu-item>
            <el-menu-item index="/user/orders">
              <el-icon><list /></el-icon>
              <span>{{ $t("user.orders") }}</span>
            </el-menu-item>
            <el-menu-item index="/user/addresses">
              <el-icon><location /></el-icon>
              <span>{{ $t("user.addresses") }}</span>
            </el-menu-item>
            <el-menu-item index="/user/favorites">
              <el-icon><star /></el-icon>
              <span>{{ $t("user.favorites") }}</span>
            </el-menu-item>
            <el-menu-item index="/user/settings">
              <el-icon><setting /></el-icon>
              <span>{{ $t("user.settings") }}</span>
            </el-menu-item>
          </el-menu>
        </el-card>
      </el-col>
      <el-col :span="18">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "@vue/runtime-core";
import { useRouter } from "vue-router";
import { User, List, Location, Star, Setting } from "@element-plus/icons-vue";
import { useUserStore } from "@/stores/user";

const router = useRouter();
const userStore = useUserStore();

onMounted(() => {
  // 如果用户未登录，重定向到登录页
  if (!userStore.isAuthenticated) {
    router.push("/auth/login");
  }
});
</script>

<style scoped>
.user-center {
  padding: 20px;
}

.user-info-card {
  text-align: center;
  padding: 20px 0;
}

.user-avatar {
  margin-bottom: 16px;
}

.user-name {
  margin: 8px 0;
  font-size: 18px;
  color: var(--el-text-color-primary);
}

.user-email {
  margin: 4px 0;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.join-date {
  margin: 4px 0 20px;
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.user-menu {
  border-right: none;
}

.user-menu :deep(.el-menu-item) {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 48px;
  padding: 0 16px;
}

.user-menu :deep(.el-menu-item.is-active) {
  background-color: var(--el-color-primary-light-9);
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
