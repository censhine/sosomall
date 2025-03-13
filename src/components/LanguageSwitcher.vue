<template>
  <el-dropdown trigger="click" @command="handleCommand">
    <span class="language-switcher">
      {{ currentLocale === "zh-CN" ? "中文" : "English" }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="zh-CN" :disabled="currentLocale === 'zh-CN'">
          中文
        </el-dropdown-item>
        <el-dropdown-item command="en-US" :disabled="currentLocale === 'en-US'">
          English
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { computed } from "@vue/runtime-core";
import { useI18n } from "vue-i18n";
import { ArrowDown } from "@element-plus/icons-vue";
import { useLocaleStore, type Locale } from "@/stores/locale";

const i18n = useI18n();
const localeStore = useLocaleStore();

const currentLocale = computed(() => localeStore.currentLocale);

const handleCommand = (command: Locale) => {
  localeStore.setLocale(command);
  i18n.locale.value = command;
};
</script>

<style scoped>
.language-switcher {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.language-switcher:hover {
  background-color: var(--el-fill-color-light);
}
</style>
