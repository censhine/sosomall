<template>
  <el-card class="settings-card">
    <template #header>
      <div class="card-header">
        <h2>{{ $t("user.settings") }}</h2>
      </div>
    </template>

    <div class="settings-content">
      <!-- 密码修改 -->
      <section class="settings-section">
        <h3>{{ $t("settings.password.title") }}</h3>
        <el-form
          ref="passwordFormRef"
          :model="passwordForm"
          :rules="passwordRules"
          label-width="160px"
          class="settings-form"
        >
          <el-form-item
            :label="$t('settings.password.current')"
            prop="currentPassword"
          >
            <el-input
              v-model="passwordForm.currentPassword"
              type="password"
              show-password
            />
          </el-form-item>

          <el-form-item :label="$t('settings.password.new')" prop="newPassword">
            <el-input
              v-model="passwordForm.newPassword"
              type="password"
              show-password
            />
          </el-form-item>

          <el-form-item
            :label="$t('settings.password.confirm')"
            prop="confirmPassword"
          >
            <el-input
              v-model="passwordForm.confirmPassword"
              type="password"
              show-password
            />
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              :loading="passwordLoading"
              @click="handlePasswordChange"
            >
              {{ $t("settings.password.change") }}
            </el-button>
          </el-form-item>
        </el-form>
      </section>

      <!-- 通知设置 -->
      <section class="settings-section">
        <h3>{{ $t("settings.notifications.title") }}</h3>
        <el-form
          ref="notificationFormRef"
          :model="notificationForm"
          label-width="160px"
          class="settings-form"
        >
          <el-form-item :label="$t('settings.notifications.email')">
            <el-switch v-model="notificationForm.emailEnabled" />
          </el-form-item>

          <el-form-item :label="$t('settings.notifications.order')">
            <el-checkbox-group v-model="notificationForm.orderNotifications">
              <el-checkbox label="payment">
                {{ $t("settings.notifications.orderPayment") }}
              </el-checkbox>
              <el-checkbox label="shipping">
                {{ $t("settings.notifications.orderShipping") }}
              </el-checkbox>
              <el-checkbox label="delivery">
                {{ $t("settings.notifications.orderDelivery") }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item :label="$t('settings.notifications.marketing')">
            <el-checkbox-group
              v-model="notificationForm.marketingNotifications"
            >
              <el-checkbox label="promotion">
                {{ $t("settings.notifications.promotion") }}
              </el-checkbox>
              <el-checkbox label="newsletter">
                {{ $t("settings.notifications.newsletter") }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              :loading="notificationLoading"
              @click="handleNotificationSave"
            >
              {{ $t("common.save") }}
            </el-button>
          </el-form-item>
        </el-form>
      </section>

      <!-- 账号注销 -->
      <section class="settings-section danger-zone">
        <h3>{{ $t("settings.dangerZone.title") }}</h3>
        <div class="danger-zone-content">
          <p class="warning-text">
            {{ $t("settings.dangerZone.deleteAccountWarning") }}
          </p>
          <el-button type="danger" @click="handleDeleteAccount">
            {{ $t("settings.dangerZone.deleteAccount") }}
          </el-button>
        </div>
      </section>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from "@vue/runtime-core";
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormInstance } from "element-plus";

// 密码表单
const passwordFormRef = ref<FormInstance>();
const passwordLoading = ref(false);
const passwordForm = ref({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

// 密码验证规则
const passwordRules = {
  currentPassword: [
    {
      required: true,
      message: "settings.password.currentRequired",
      trigger: "blur",
    },
    { min: 6, message: "settings.password.minLength", trigger: "blur" },
  ],
  newPassword: [
    {
      required: true,
      message: "settings.password.newRequired",
      trigger: "blur",
    },
    { min: 6, message: "settings.password.minLength", trigger: "blur" },
  ],
  confirmPassword: [
    {
      required: true,
      message: "settings.password.confirmRequired",
      trigger: "blur",
    },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (value !== passwordForm.value.newPassword) {
          callback(new Error("settings.password.mismatch"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
};

// 通知表单
const notificationFormRef = ref<FormInstance>();
const notificationLoading = ref(false);
const notificationForm = ref({
  emailEnabled: true,
  orderNotifications: ["payment", "shipping"],
  marketingNotifications: ["newsletter"],
});

// 修改密码
const handlePasswordChange = async () => {
  if (!passwordFormRef.value) return;

  await passwordFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      passwordLoading.value = true;
      try {
        await fetch("/api/user/password", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword: passwordForm.value.currentPassword,
            newPassword: passwordForm.value.newPassword,
          }),
        });
        ElMessage.success("settings.password.changeSuccess");
        // 清空表单
        passwordForm.value = {
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        };
      } catch (error) {
        ElMessage.error("settings.password.changeFailed");
      } finally {
        passwordLoading.value = false;
      }
    }
  });
};

// 保存通知设置
const handleNotificationSave = async () => {
  notificationLoading.value = true;
  try {
    await fetch("/api/user/notifications", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notificationForm.value),
    });
    ElMessage.success("settings.notifications.saveSuccess");
  } catch (error) {
    ElMessage.error("settings.notifications.saveFailed");
  } finally {
    notificationLoading.value = false;
  }
};

// 删除账号
const handleDeleteAccount = async () => {
  try {
    await ElMessageBox.confirm(
      "settings.dangerZone.deleteConfirm",
      "common.warning",
      {
        type: "warning",
        confirmButtonText: "settings.dangerZone.confirmDelete",
        confirmButtonClass: "el-button--danger",
      }
    );

    await fetch("/api/user", {
      method: "DELETE",
    });

    ElMessage.success("settings.dangerZone.deleteSuccess");
    // 重定向到首页或登出
    window.location.href = "/";
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("settings.dangerZone.deleteFailed");
    }
  }
};
</script>

<style scoped>
.settings-card {
  margin-bottom: 20px;
}

.card-header {
  margin-bottom: 20px;
}

.settings-section {
  margin-bottom: 40px;
  padding-bottom: 40px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.settings-section:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.settings-section h3 {
  margin: 0 0 20px;
  font-size: 18px;
  color: var(--el-text-color-primary);
}

.settings-form {
  max-width: 500px;
}

.danger-zone {
  background-color: var(--el-color-danger-light-9);
  padding: 20px;
  border-radius: 4px;
}

.danger-zone h3 {
  color: var(--el-color-danger);
}

.danger-zone-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.warning-text {
  margin: 0;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  max-width: 70%;
}

:deep(.el-checkbox-group) {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
