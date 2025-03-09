<template>
  <div class="reset-password">
    <div class="reset-password-container">
      <h1>{{ $t("auth.resetPassword") }}</h1>

      <el-form
        ref="resetPasswordForm"
        :model="resetPasswordForm"
        :rules="formRules"
        class="reset-password-form"
      >
        <el-form-item prop="password">
          <el-input
            v-model="resetPasswordForm.password"
            type="password"
            :placeholder="$t('auth.newPasswordPlaceholder')"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-form-item prop="confirmPassword">
          <el-input
            v-model="resetPasswordForm.confirmPassword"
            type="password"
            :placeholder="$t('auth.confirmPasswordPlaceholder')"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-button
          type="primary"
          class="submit-button"
          :loading="loading"
          @click="handleSubmit"
        >
          {{ $t("auth.resetPassword") }}
        </el-button>

        <div class="back-to-login">
          <router-link :to="{ name: 'login' }">
            {{ $t("auth.backToLogin") }}
          </router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const loading = ref(false);
const resetPasswordForm = ref<ResetPasswordForm>({
  password: "",
  confirmPassword: "",
});

// 自定义验证规则：确认密码
const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (value === "") {
    callback(new Error(t("auth.confirmPasswordRequired")));
  } else if (value !== resetPasswordForm.value.password) {
    callback(new Error(t("auth.passwordMismatch")));
  } else {
    callback();
  }
};

const formRules = {
  password: [
    { required: true, message: t("auth.passwordRequired"), trigger: "blur" },
    { min: 6, message: t("auth.passwordLength"), trigger: "blur" },
  ],
  confirmPassword: [{ validator: validateConfirmPassword, trigger: "blur" }],
};

// 处理表单提交
const handleSubmit = async () => {
  const formEl = ref<FormInstance>();
  if (!formEl.value) return;

  try {
    loading.value = true;
    await formEl.value.validate();

    // 获取重置令牌
    const token = route.query.token as string;
    if (!token) {
      throw new Error(t("auth.invalidResetToken"));
    }

    // 这里应该调用实际的API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    ElMessage.success(t("auth.resetPasswordSuccess"));
    router.push("/login");
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error(
        error instanceof Error ? error.message : t("auth.resetPasswordFailed")
      );
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.reset-password {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.reset-password-container {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.reset-password-container h1 {
  margin: 0 0 30px;
  text-align: center;
  font-size: 24px;
  color: #333;
}

.reset-password-form {
  margin-top: 20px;
}

.submit-button {
  width: 100%;
  margin-bottom: 20px;
}

.back-to-login {
  text-align: center;
  font-size: 14px;
}

.back-to-login a {
  color: #409eff;
  text-decoration: none;
}

.back-to-login a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .reset-password-container {
    max-width: none;
    margin: 20px;
    padding: 20px;
  }
}
</style>
