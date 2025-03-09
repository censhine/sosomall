<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <h2>{{ $t("auth.login") }}</h2>
      </template>

      <el-form
        ref="formRef"
        :model="loginForm"
        :rules="rules"
        label-width="0"
        class="login-form"
      >
        <!-- 邮箱 -->
        <el-form-item prop="email">
          <el-input
            v-model="loginForm.email"
            :placeholder="$t('auth.emailPlaceholder')"
            prefix-icon="Message"
          />
        </el-form-item>

        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            show-password
            :placeholder="$t('auth.passwordPlaceholder')"
            prefix-icon="Lock"
          />
        </el-form-item>

        <!-- 记住我和忘记密码 -->
        <div class="form-options">
          <el-checkbox v-model="loginForm.remember">
            {{ $t("auth.rememberMe") }}
          </el-checkbox>
          <el-link type="primary" @click="handleForgotPassword">
            {{ $t("auth.forgotPassword") }}
          </el-link>
        </div>

        <!-- 登录按钮 -->
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            class="submit-btn"
            @click="handleSubmit"
          >
            {{ $t("auth.login") }}
          </el-button>
        </el-form-item>

        <!-- 注册链接 -->
        <div class="register-link">
          {{ $t("auth.toRegister") }}
          <el-link type="primary" @click="handleRegister">
            {{ $t("auth.register") }}
          </el-link>
        </div>

        <!-- 第三方登录 -->
        <div class="social-login">
          <div class="divider">
            <span>{{ $t("auth.orLoginWith") }}</span>
          </div>
          <div class="social-buttons">
            <el-button @click="handleSocialLogin('google')">
              <i class="fab fa-google"></i>
              Google
            </el-button>
            <el-button @click="handleSocialLogin('github')">
              <i class="fab fa-github"></i>
              GitHub
            </el-button>
          </div>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "@vue/runtime-core";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { Message, Lock } from "@element-plus/icons-vue";
import { useUserStore } from "@/stores/user";
import type { FormInstance } from "element-plus";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const loading = ref(false);
const formRef = ref<FormInstance>();

// 登录表单数据
const loginForm = ref({
  email: "",
  password: "",
  remember: false,
});

// 表单验证规则
const rules = {
  email: [
    { required: true, message: "auth.emailRequired", trigger: "blur" },
    { type: "email", message: "auth.emailInvalid", trigger: "blur" },
  ],
  password: [
    { required: true, message: "auth.passwordRequired", trigger: "blur" },
    { min: 6, message: "auth.passwordLength", trigger: "blur" },
  ],
};

// 处理登录提交
const handleSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true;
      try {
        await userStore.login({
          email: loginForm.value.email,
          password: loginForm.value.password,
          remember: loginForm.value.remember,
        });
        ElMessage.success("auth.loginSuccess");

        // 获取重定向路径，如果没有则跳转到用户中心
        const redirect = (route.query.redirect as string) || "/user";
        router.push(redirect);
      } catch (error) {
        ElMessage.error("auth.loginFailed");
      } finally {
        loading.value = false;
      }
    }
  });
};

// 处理注册跳转
const handleRegister = () => {
  // 保持重定向参数
  const redirect = route.query.redirect;
  router.push({
    path: "/auth/register",
    query: redirect ? { redirect } : undefined,
  });
};

// 处理忘记密码
const handleForgotPassword = () => {
  router.push("/auth/forgot-password");
};

// 处理第三方登录
const handleSocialLogin = async (provider: string) => {
  try {
    await userStore.socialLogin(provider);
    ElMessage.success("auth.loginSuccess");

    // 获取重定向路径，如果没有则跳转到用户中心
    const redirect = (route.query.redirect as string) || "/user";
    router.push(redirect);
  } catch (error) {
    ElMessage.error("auth.socialLoginFailed");
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
}

.login-form {
  margin-top: 20px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.submit-btn {
  width: 100%;
}

.register-link {
  text-align: center;
  margin: 16px 0;
}

.social-login {
  margin-top: 24px;
}

.divider {
  display: flex;
  align-items: center;
  margin: 16px 0;
  color: var(--el-text-color-secondary);
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: var(--el-border-color-lighter);
}

.divider span {
  padding: 0 16px;
}

.social-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
}

.social-buttons .el-button {
  display: flex;
  align-items: center;
  gap: 8px;
}

.social-buttons i {
  font-size: 18px;
}
</style>
