<template>
  <div class="main-layout">
    <el-container>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
}

.el-container {
  min-height: 100vh;
}

.el-header {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  width: 100%;
  z-index: 100;
}

.nav {
  max-width: 1200px;
  margin: 0 auto;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-links a {
  color: #606266;
  text-decoration: none;
  font-size: 16px;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: #409eff;
}

.el-main {
  padding-top: 80px;
  background-color: #f5f7fa;
}

.el-footer {
  text-align: center;
  background-color: #fff;
  color: #909399;
  padding: 20px;
}
</style>
