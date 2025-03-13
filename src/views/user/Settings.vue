<template>
  <div class="settings-container">
    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <span>{{ $t("user.settings.title") }}</span>
        </div>
      </template>

      <el-tabs v-model="activeTab">
        <!-- 通知设置 -->
        <el-tab-pane
          :label="$t('user.settings.tabs.notifications')"
          name="notifications"
        >
          <el-form :model="notificationSettings" label-width="200px">
            <el-form-item :label="$t('user.settings.notifications.email')">
              <el-switch v-model="notificationSettings.email" />
            </el-form-item>
            <el-form-item :label="$t('user.settings.notifications.sms')">
              <el-switch v-model="notificationSettings.sms" />
            </el-form-item>
            <el-form-item :label="$t('user.settings.notifications.push')">
              <el-switch v-model="notificationSettings.push" />
            </el-form-item>
            <el-form-item
              :label="$t('user.settings.notifications.orderUpdates')"
            >
              <el-switch v-model="notificationSettings.orderUpdates" />
            </el-form-item>
            <el-form-item :label="$t('user.settings.notifications.promotions')">
              <el-switch v-model="notificationSettings.promotions" />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 隐私设置 -->
        <el-tab-pane :label="$t('user.settings.tabs.privacy')" name="privacy">
          <el-form :model="privacySettings" label-width="200px">
            <el-form-item :label="$t('user.settings.privacy.profile')">
              <el-radio-group v-model="privacySettings.profileVisibility">
                <el-radio label="public">{{
                  $t("user.settings.privacy.public")
                }}</el-radio>
                <el-radio label="friends">{{
                  $t("user.settings.privacy.friends")
                }}</el-radio>
                <el-radio label="private">{{
                  $t("user.settings.privacy.private")
                }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('user.settings.privacy.searchable')">
              <el-switch v-model="privacySettings.searchable" />
            </el-form-item>
            <el-form-item :label="$t('user.settings.privacy.activityVisible')">
              <el-switch v-model="privacySettings.activityVisible" />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 语言和区域 -->
        <el-tab-pane :label="$t('user.settings.tabs.locale')" name="locale">
          <el-form :model="localeSettings" label-width="200px">
            <el-form-item :label="$t('user.settings.locale.language')">
              <el-select v-model="localeSettings.language">
                <el-option
                  v-for="lang in languages"
                  :key="lang.value"
                  :label="lang.label"
                  :value="lang.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('user.settings.locale.timezone')">
              <el-select v-model="localeSettings.timezone">
                <el-option
                  v-for="tz in timezones"
                  :key="tz.value"
                  :label="tz.label"
                  :value="tz.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('user.settings.locale.currency')">
              <el-select v-model="localeSettings.currency">
                <el-option
                  v-for="currency in currencies"
                  :key="currency.value"
                  :label="currency.label"
                  :value="currency.value"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 主题设置 -->
        <el-tab-pane :label="$t('user.settings.tabs.theme')" name="theme">
          <el-form :model="themeSettings" label-width="200px">
            <el-form-item :label="$t('user.settings.theme.mode')">
              <el-radio-group v-model="themeSettings.mode">
                <el-radio label="light">{{
                  $t("user.settings.theme.light")
                }}</el-radio>
                <el-radio label="dark">{{
                  $t("user.settings.theme.dark")
                }}</el-radio>
                <el-radio label="system">{{
                  $t("user.settings.theme.system")
                }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('user.settings.theme.color')">
              <el-color-picker v-model="themeSettings.primaryColor" />
            </el-form-item>
            <el-form-item :label="$t('user.settings.theme.fontSize')">
              <el-slider
                v-model="themeSettings.fontSize"
                :min="12"
                :max="20"
                :step="1"
                show-input
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <div class="settings-actions">
        <el-button type="primary" @click="handleSave">
          {{ $t("common.save") }}
        </el-button>
        <el-button @click="handleReset">
          {{ $t("common.reset") }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import type {
  NotificationSettings,
  PrivacySettings,
  LocaleSettings,
  ThemeSettings,
} from "@/types/settings";

const { t } = useI18n();

// 当前激活的标签页
const activeTab = ref("notifications");

// 通知设置
const notificationSettings = ref<NotificationSettings>({
  email: true,
  sms: false,
  push: true,
  orderUpdates: true,
  promotions: false,
});

// 隐私设置
const privacySettings = ref<PrivacySettings>({
  profileVisibility: "public",
  searchable: true,
  activityVisible: true,
});

// 语言和区域设置
const localeSettings = ref<LocaleSettings>({
  language: "zh-CN",
  timezone: "Asia/Shanghai",
  currency: "CNY",
});

// 主题设置
const themeSettings = ref<ThemeSettings>({
  mode: "light",
  primaryColor: "#409EFF",
  fontSize: 14,
});

// 语言选项
const languages = [
  { value: "zh-CN", label: "简体中文" },
  { value: "en-US", label: "English" },
  { value: "ja-JP", label: "日本語" },
];

// 时区选项
const timezones = [
  { value: "Asia/Shanghai", label: "(GMT+8:00) 北京" },
  { value: "Asia/Tokyo", label: "(GMT+9:00) 东京" },
  { value: "America/New_York", label: "(GMT-5:00) 纽约" },
];

// 货币选项
const currencies = [
  { value: "CNY", label: "人民币 (¥)" },
  { value: "USD", label: "美元 ($)" },
  { value: "EUR", label: "欧元 (€)" },
];

// 获取设置
const fetchSettings = async () => {
  try {
    const response = await fetch("/api/user/settings");
    const data = await response.json();
    notificationSettings.value = data.notifications;
    privacySettings.value = data.privacy;
    localeSettings.value = data.locale;
    themeSettings.value = data.theme;
  } catch (error) {
    ElMessage.error(t("common.error.fetchFailed"));
  }
};

// 保存设置
const handleSave = async () => {
  try {
    await fetch("/api/user/settings", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notifications: notificationSettings.value,
        privacy: privacySettings.value,
        locale: localeSettings.value,
        theme: themeSettings.value,
      }),
    });
    ElMessage.success(t("user.settings.messages.saveSuccess"));
  } catch (error) {
    ElMessage.error(t("user.settings.messages.saveFailed"));
  }
};

// 重置设置
const handleReset = async () => {
  try {
    await fetch("/api/user/settings/reset", { method: "POST" });
    await fetchSettings();
    ElMessage.success(t("user.settings.messages.resetSuccess"));
  } catch (error) {
    ElMessage.error(t("user.settings.messages.resetFailed"));
  }
};

// 初始化
onMounted(() => {
  fetchSettings();
});
</script>

<style scoped lang="scss">
.settings-container {
  padding: 20px;

  .settings-card {
    .card-header {
      margin-bottom: 20px;
    }

    :deep(.el-tabs__nav) {
      margin-bottom: 20px;
    }

    .el-form {
      max-width: 600px;
      margin: 0 auto;
    }

    .settings-actions {
      margin-top: 30px;
      text-align: center;
    }
  }
}
</style>
