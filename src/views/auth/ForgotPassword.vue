<template>
  <div class="forgot-password">
    <div class="forgot-password-container">
      <h1>{{ $t("auth.forgotPassword") }}</h1>

      <el-form
        ref="forgotPasswordForm"
        :model="forgotPasswordForm"
        :rules="formRules"
        class="forgot-password-form"
      >
        <p class="form-description">
          {{ $t("auth.forgotPasswordDescription") }}
        </p>

        <el-form-item prop="email">
          <el-input
            v-model="forgotPasswordForm.email"
            :placeholder="$t('auth.emailPlaceholder')"
            prefix-icon="Message"
          />
        </el-form-item>

        <el-button
          type="primary"
          class="submit-button"
          :loading="loading"
          @click="handleSubmit"
        >
          {{ $t("auth.sendResetLink") }}
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
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";

interface ForgotPasswordForm {
  email: string;
}

const router = useRouter();
const { t } = useI18n();

const loading = ref(false);
const forgotPasswordForm = ref<ForgotPasswordForm>({
  email: "",
});

const formRules = {
  email: [
    { required: true, message: t("auth.emailRequired"), trigger: "blur" },
    { type: "email", message: t("auth.emailInvalid"), trigger: "blur" },
  ],
};

// 处理表单提交
const handleSubmit = async () => {
  const formEl = ref<FormInstance>();
  if (!formEl.value) return;

  try {
    loading.value = true;
    await formEl.value.validate();

    // 这里应该调用实际的API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    ElMessage.success(t("auth.resetLinkSent"));
    router.push("/login");
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error(t("auth.resetLinkFailed"));
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.forgot-password {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.forgot-password-container {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.forgot-password-container h1 {
  margin: 0 0 30px;
  text-align: center;
  font-size: 24px;
  color: #333;
}

.forgot-password-form {
  margin-top: 20px;
}

.form-description {
  margin-bottom: 20px;
  color: #666;
  text-align: center;
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
  .forgot-password-container {
    max-width: none;
    margin: 20px;
    padding: 20px;
  }
}
</style>
