<template>
  <el-card class="profile-card">
    <template #header>
      <div class="card-header">
        <h2>{{ $t("user.profile.title") }}</h2>
      </div>
    </template>

    <el-form
      ref="formRef"
      :model="profileForm"
      :rules="rules"
      label-width="120px"
      class="profile-form"
    >
      <h3>{{ $t("user.profile.basicInfo") }}</h3>

      <!-- 头像上传 -->
      <el-form-item :label="$t('user.profile.avatar')">
        <div class="avatar-uploader">
          <el-upload
            class="avatar-upload"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess"
            action="/api/user/avatar"
          >
            <el-avatar
              v-if="profileForm.avatar"
              :src="profileForm.avatar"
              :size="100"
            />
            <el-icon v-else class="avatar-uploader-icon"><plus /></el-icon>
          </el-upload>
          <el-button
            type="primary"
            link
            class="upload-button"
            @click="triggerUpload"
          >
            {{ $t("user.profile.uploadAvatar") }}
          </el-button>
        </div>
      </el-form-item>

      <!-- 昵称 -->
      <el-form-item :label="$t('user.profile.nickname')" prop="nickname">
        <el-input v-model="profileForm.nickname" />
      </el-form-item>

      <!-- 邮箱 -->
      <el-form-item :label="$t('user.profile.email')" prop="email">
        <el-input v-model="profileForm.email" disabled />
      </el-form-item>

      <!-- 手机号码 -->
      <el-form-item :label="$t('user.profile.phone')" prop="phone">
        <el-input v-model="profileForm.phone" />
      </el-form-item>

      <!-- 性别 -->
      <el-form-item :label="$t('user.profile.gender')" prop="gender">
        <el-radio-group v-model="profileForm.gender">
          <el-radio label="male">
            {{ $t("user.profile.genderOptions.male") }}
          </el-radio>
          <el-radio label="female">
            {{ $t("user.profile.genderOptions.female") }}
          </el-radio>
          <el-radio label="other">
            {{ $t("user.profile.genderOptions.other") }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 生日 -->
      <el-form-item :label="$t('user.profile.birthday')" prop="birthday">
        <el-date-picker
          v-model="profileForm.birthday"
          type="date"
          :placeholder="$t('user.profile.birthday')"
        />
      </el-form-item>

      <!-- 个人简介 -->
      <el-form-item :label="$t('user.profile.bio')" prop="bio">
        <el-input v-model="profileForm.bio" type="textarea" :rows="4" />
      </el-form-item>

      <!-- 提交按钮 -->
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">
          {{ $t("user.profile.save") }}
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from "@vue/runtime-core";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { useUserStore } from "@/stores/user";
import type { FormInstance, UploadProps } from "element-plus";
import type { User } from "@/types";

const userStore = useUserStore();
const formRef = ref<FormInstance>();

// 表单数据
const profileForm = ref({
  avatar: "",
  nickname: "",
  email: "",
  phone: "",
  gender: "",
  birthday: "",
  bio: "",
});

// 表单验证规则
const rules = {
  nickname: [
    { required: true, message: "user.nicknameRequired", trigger: "blur" },
    { min: 2, max: 20, message: "Length should be 2 to 20", trigger: "blur" },
  ],
  phone: [
    {
      pattern: /^[0-9-+]{8,}$/,
      message: "Invalid phone number",
      trigger: "blur",
    },
  ],
};

// 初始化表单数据
onMounted(() => {
  if (userStore.user) {
    const { avatar, nickname, email, phone, gender, birthday, bio } =
      userStore.user;
    profileForm.value = {
      avatar: avatar || "",
      nickname: nickname || "",
      email: email || "",
      phone: phone || "",
      gender: gender || "",
      birthday: birthday || "",
      bio: bio || "",
    };
  }
});

// 头像上传前的验证
const beforeAvatarUpload: UploadProps["beforeUpload"] = (file: File) => {
  const isImage = /^image\//.test(file.type);
  if (!isImage) {
    ElMessage.error("user.avatarTypeError");
    return false;
  }
  return true;
};

// 头像上传成功的回调
const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response: { url: string },
  uploadFile: UploadProps["UploadFile"]
) => {
  profileForm.value.avatar = response.url;
  ElMessage.success("user.avatarUpdateSuccess");
};

// 触发头像上传
const triggerUpload = () => {
  const uploadEl = document.querySelector(
    '.avatar-upload input[type="file"]'
  ) as HTMLInputElement | null;
  if (uploadEl) {
    uploadEl.click();
  }
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        // TODO: 调用更新用户信息的 API
        await userStore.updateProfile(profileForm.value);
        ElMessage.success("user.profile.updateSuccess");
      } catch (error) {
        ElMessage.error("user.profile.updateFailed");
      }
    }
  });
};
</script>

<style scoped>
.profile-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-form {
  max-width: 600px;
  margin: 0 auto;
}

.avatar-uploader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.avatar-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-upload:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
}

.upload-button {
  margin-top: 8px;
}

h3 {
  margin: 24px 0 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  color: var(--el-text-color-primary);
}
</style>
