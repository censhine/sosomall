<template>
  <div class="register-container">
    <el-card class="register-card">
      <template #header>
        <h2>{{ $t("auth.register") }}</h2>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        @submit.prevent="handleSubmit"
      >
        <el-form-item :label="$t('auth.email')" prop="email">
          <el-input
            v-model="form.email"
            :placeholder="$t('auth.emailPlaceholder')"
            type="email"
          />
        </el-form-item>

        <el-form-item :label="$t('auth.username')" prop="username">
          <el-input
            v-model="form.username"
            :placeholder="$t('auth.usernamePlaceholder')"
          />
        </el-form-item>

        <el-form-item :label="$t('user.phone')" prop="phone">
          <el-input
            v-model="form.phone"
            :placeholder="$t('checkout.phoneRequired')"
          />
        </el-form-item>

        <el-form-item :label="$t('auth.password')" prop="password">
          <el-input
            v-model="form.password"
            :placeholder="$t('auth.passwordPlaceholder')"
            type="password"
            show-password
          />
        </el-form-item>

        <el-form-item
          :label="$t('auth.confirmPassword')"
          prop="confirmPassword"
        >
          <el-input
            v-model="form.confirmPassword"
            :placeholder="$t('auth.confirmPasswordPlaceholder')"
            type="password"
            show-password
          />
        </el-form-item>

        <el-form-item prop="agreement">
          <el-checkbox v-model="form.agreement">
            {{ $t("auth.agreement") }}
            <router-link to="/terms">{{ $t("auth.terms") }}</router-link>
          </el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            native-type="submit"
            class="submit-button"
            :loading="loading"
          >
            {{ $t("auth.register") }}
          </el-button>
        </el-form-item>

        <div class="form-footer">
          <p>
            {{ $t("auth.toLogin") }}
            <router-link to="/auth/login">
              {{ $t("auth.login") }}
            </router-link>
          </p>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";
import { useI18n } from "vue-i18n";
import {
  register,
  checkEmailExists,
  checkUsernameExists,
} from "@/api/mock/users";
import { useUserStore } from "@/stores/user";

const { t } = useI18n();
const userStore = useUserStore();
const router = useRouter();

const formRef = ref<FormInstance>();
const loading = ref(false);

const form = reactive({
  email: "",
  username: "",
  phone: "",
  password: "",
  confirmPassword: "",
  agreement: false,
});

// 自定义验证规则
const validatePass2 = (rule: any, value: string, callback: Function) => {
  if (value === "") {
    callback(new Error(t("auth.confirmPasswordRequired")));
  } else if (value !== form.password) {
    callback(new Error(t("auth.passwordMismatch")));
  } else {
    callback();
  }
};

const validateEmail = async (rule: any, value: string, callback: Function) => {
  if (value === "") {
    callback(new Error(t("auth.emailRequired")));
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      callback(new Error(t("auth.emailInvalid")));
    } else {
      try {
        const exists = await checkEmailExists(value);
        if (exists) {
          callback(new Error(t("auth.emailExists")));
        } else {
          callback();
        }
      } catch (error) {
        callback();
      }
    }
  }
};

const validateUsername = async (
  rule: any,
  value: string,
  callback: Function
) => {
  if (value === "") {
    callback(new Error(t("auth.usernameRequired")));
  } else if (value.length < 3) {
    callback(new Error(t("auth.usernameLength")));
  } else {
    try {
      const exists = await checkUsernameExists(value);
      if (exists) {
        callback(new Error(t("auth.usernameExists")));
      } else {
        callback();
      }
    } catch (error) {
      callback();
    }
  }
};

const validatePhone = (rule: any, value: string, callback: Function) => {
  if (value === "") {
    callback(new Error(t("checkout.phoneRequired")));
  } else {
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(value)) {
      callback(new Error(t("checkout.phoneInvalid")));
    } else {
      callback();
    }
  }
};

const rules = {
  email: [{ validator: validateEmail, trigger: "blur" }],
  username: [{ validator: validateUsername, trigger: "blur" }],
  phone: [{ validator: validatePhone, trigger: "blur" }],
  password: [
    {
      required: true,
      message: t("auth.passwordRequired"),
      trigger: "blur",
    },
    {
      min: 6,
      message: t("auth.passwordLength"),
      trigger: "blur",
    },
  ],
  confirmPassword: [{ validator: validatePass2, trigger: "blur" }],
  agreement: [
    {
      type: "boolean",
      message: t("auth.agreementRequired"),
      trigger: "change",
      transform: (value: boolean) => value === true,
    },
  ],
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    loading.value = true;

    const { confirmPassword, agreement, ...userData } = form;
    const { user, token } = await register(userData);
    userStore.setUserState(user, token);

    ElMessage.success(t("auth.registerSuccess"));
    router.push("/user");
  } catch (error) {
    console.error("Registration error:", error);
    ElMessage.error(
      error instanceof Error ? error.message : t("auth.registerFailed")
    );
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 0 20px;
}

.register-card :deep(.el-card__header) {
  text-align: center;
  padding: 20px;
}

.register-card :deep(.el-card__header h2) {
  margin: 0;
  font-size: 24px;
  color: var(--el-text-color-primary);
}

.submit-button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
}

.form-footer {
  text-align: center;
  margin-top: 20px;
  color: var(--el-text-color-regular);
}

.form-footer a {
  color: var(--el-color-primary);
  text-decoration: none;
}

.form-footer a:hover {
  text-decoration: underline;
}
</style>
