<template>
  <div class="auth-layout">
    <div class="auth-container">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
}

.auth-container {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}

.auth-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  text-decoration: none;
}

.logo h1 {
  font-size: 24px;
  color: var(--el-color-primary);
  margin: 0;
}

.auth-footer {
  text-align: center;
  margin-top: 40px;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

@media (max-width: 768px) {
  .auth-container {
    padding: 15px;
  }

  .logo h1 {
    font-size: 20px;
  }
}
</style>
