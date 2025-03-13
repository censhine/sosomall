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
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { useUserStore } from "@/stores/user";
import type { FormInstance, UploadProps } from "element-plus";
import type { UserInfo } from "@/types/user";
import { updateUserInfo, uploadAvatar } from "@/api/auth";

const userStore = useUserStore();
const formRef = ref<FormInstance>();

// 表单数据
const profileForm = ref<UserInfo>({
  nickname: "",
  email: "",
  phone: "",
  avatar: "",
  gender: "other",
  birthday: "",
  bio: ""
});

// 表单验证规则
const rules = {
  nickname: [
    { required: true, message: "请输入昵称", trigger: "blur" },
    { min: 2, max: 20, message: "长度应在2到20个字符之间", trigger: "blur" },
  ],
  phone: [
    {
      pattern: /^[0-9-+]{8,}$/,
      message: "请输入有效的电话号码",
      trigger: "blur",
    },
  ],
};

// 初始化表单数据
onMounted(() => {
  if (userStore.user) {
    Object.assign(profileForm.value, userStore.user);
  }
});

// 头像上传前的验证
const beforeAvatarUpload: UploadProps["beforeUpload"] = (file) => {
  const isImage = /^image\//.test(file.type);
  if (!isImage) {
    ElMessage.error("只能上传图片文件！");
    return false;
  }
  return true;
};

// 头像上传成功的回调
const handleAvatarSuccess: UploadProps["onSuccess"] = (response) => {
  profileForm.value.avatar = response.data.url;
  ElMessage.success("头像上传成功");
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const response = await updateUserInfo(profileForm.value);
        userStore.setUser(response.data);
        ElMessage.success("个人资料更新成功");
      } catch (error) {
        ElMessage.error("更新失败，请重试");
      }
    }
  });
};
</script>

<style scoped>
.profile-card {
  margin: 20px;
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
  gap: 10px;
}

.avatar-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>