<template>
  <div class="not-found">
    <div class="not-found-content">
      <h1>404</h1>
      <p>{{ $t("common.pageNotFound") }}</p>
      <el-button type="primary" @click="$router.push('/')">
        {{ $t("common.backToHome") }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const router = useRouter();
const { t } = useI18n();
</script>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.not-found-content {
  text-align: center;
  padding: 40px;
}

.not-found-content h1 {
  font-size: 120px;
  margin: 0;
  color: #409eff;
  line-height: 1;
}

.not-found-content p {
  font-size: 24px;
  color: #606266;
  margin: 20px 0 30px;
}

@media (max-width: 768px) {
  .not-found-content h1 {
    font-size: 80px;
  }

  .not-found-content p {
    font-size: 18px;
  }
}
</style>
