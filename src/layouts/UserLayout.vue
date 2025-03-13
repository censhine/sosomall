<template>
  <div class="user-layout">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from '@vue/runtime-core';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();

onMounted(() => {
  // 如果用户未登录，重定向到登录页
  if (!userStore.isAuthenticated) {
    router.push('/auth/login');
  }
});
</script>

<style scoped>
.user-layout {
  min-height: 100vh;
  padding: 20px;
  background-color: var(--el-bg-color);
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