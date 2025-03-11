<template>
  <div class="addresses-container">
    <el-card class="addresses-card">
      <template #header>
        <div class="card-header">
          <span>{{ $t("user.addresses.title") }}</span>
          <el-button type="primary" @click="handleAdd">
            {{ $t("user.addresses.actions.add") }}
          </el-button>
        </div>
      </template>

      <el-row v-loading="loading" :gutter="20">
        <el-col
          v-for="address in addresses"
          :key="address.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
          class="address-item"
        >
          <el-card :class="{ 'is-default': address.isDefault }">
            <div class="address-content">
              <div class="address-header">
                <span class="recipient">{{ address.recipient }}</span>
                <el-tag v-if="address.isDefault" type="success" size="small">
                  {{ $t("user.addresses.default") }}
                </el-tag>
              </div>
              <div class="phone">{{ address.phone }}</div>
              <div class="address-detail">
                {{ formatAddress(address) }}
              </div>
              <div class="address-actions">
                <el-button
                  v-if="!address.isDefault"
                  type="primary"
                  link
                  @click="handleSetDefault(address)"
                >
                  {{ $t("user.addresses.actions.setDefault") }}
                </el-button>
                <el-button type="primary" link @click="handleEdit(address)">
                  {{ $t("user.addresses.actions.edit") }}
                </el-button>
                <el-button type="danger" link @click="handleDelete(address)">
                  {{ $t("user.addresses.actions.delete") }}
                </el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <div v-if="!loading && addresses.length === 0" class="empty-state">
        <el-empty :description="$t('user.addresses.empty')" />
      </div>
    </el-card>

    <!-- 地址表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="$t(isEdit ? 'user.addresses.edit' : 'user.addresses.add')"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="addressForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item
          :label="$t('user.addresses.form.recipient')"
          prop="recipient"
        >
          <el-input v-model="addressForm.recipient" />
        </el-form-item>
        <el-form-item :label="$t('user.addresses.form.phone')" prop="phone">
          <el-input v-model="addressForm.phone" />
        </el-form-item>
        <el-form-item :label="$t('user.addresses.form.region')" prop="region">
          <el-cascader
            v-model="addressForm.region"
            :options="regionOptions"
            :props="{
              expandTrigger: 'hover',
              value: 'code',
              label: 'name',
            }"
          />
        </el-form-item>
        <el-form-item :label="$t('user.addresses.form.detail')" prop="detail">
          <el-input v-model="addressForm.detail" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="addressForm.isDefault">
            {{ $t("user.addresses.form.setDefault") }}
          </el-checkbox>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">
            {{ $t("common.cancel") }}
          </el-button>
          <el-button type="primary" @click="handleSubmit">
            {{ $t("common.confirm") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
import type { FormInstance } from "element-plus";
import type { Address } from "@/types/address";

const { t } = useI18n();

// 状态
const loading = ref(false);
const addresses = ref<Address[]>([]);
const dialogVisible = ref(false);
const isEdit = ref(false);
const formRef = ref<FormInstance>();

// 表单数据
const addressForm = ref({
  id: "",
  recipient: "",
  phone: "",
  region: [] as string[],
  detail: "",
  isDefault: false,
});

// 表单验证规则
const rules = {
  recipient: [
    {
      required: true,
      message: t("user.addresses.rules.recipientRequired"),
      trigger: "blur",
    },
    {
      min: 2,
      max: 20,
      message: t("user.addresses.rules.recipientLength"),
      trigger: "blur",
    },
  ],
  phone: [
    {
      required: true,
      message: t("user.addresses.rules.phoneRequired"),
      trigger: "blur",
    },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: t("user.addresses.rules.phoneFormat"),
      trigger: "blur",
    },
  ],
  region: [
    {
      required: true,
      message: t("user.addresses.rules.regionRequired"),
      trigger: "change",
    },
  ],
  detail: [
    {
      required: true,
      message: t("user.addresses.rules.detailRequired"),
      trigger: "blur",
    },
    {
      min: 5,
      max: 100,
      message: t("user.addresses.rules.detailLength"),
      trigger: "blur",
    },
  ],
};

// 地区选项（示例数据）
const regionOptions = [
  {
    code: "110000",
    name: "北京市",
    children: [
      {
        code: "110100",
        name: "北京市",
        children: [
          { code: "110101", name: "东城区" },
          { code: "110102", name: "西城区" },
        ],
      },
    ],
  },
  // ... 其他省市区数据
];

// 获取地址列表
const fetchAddresses = async () => {
  loading.value = true;
  try {
    const response = await fetch("/api/addresses");
    const data = await response.json();
    addresses.value = data.items;
  } catch (error) {
    ElMessage.error(t("common.error.fetchFailed"));
  } finally {
    loading.value = false;
  }
};

// 格式化地址
const formatAddress = (address: Address) => {
  const regionNames = address.region.map((code) => {
    const findRegion = (options: any[], code: string): string => {
      for (const option of options) {
        if (option.code === code) return option.name;
        if (option.children) {
          const name = findRegion(option.children, code);
          if (name) return name;
        }
      }
      return "";
    };
    return findRegion(regionOptions, code);
  });
  return [...regionNames, address.detail].join(" ");
};

// 添加地址
const handleAdd = () => {
  isEdit.value = false;
  addressForm.value = {
    id: "",
    recipient: "",
    phone: "",
    region: [],
    detail: "",
    isDefault: false,
  };
  dialogVisible.value = true;
};

// 编辑地址
const handleEdit = (address: Address) => {
  isEdit.value = true;
  addressForm.value = {
    ...address,
    region: [...address.region],
  };
  dialogVisible.value = true;
};

// 设为默认地址
const handleSetDefault = async (address: Address) => {
  try {
    await fetch(`/api/addresses/${address.id}/default`, {
      method: "PUT",
    });
    ElMessage.success(t("user.addresses.messages.setDefaultSuccess"));
    fetchAddresses();
  } catch (error) {
    ElMessage.error(t("user.addresses.messages.setDefaultFailed"));
  }
};

// 删除地址
const handleDelete = async (address: Address) => {
  try {
    const confirmed = await ElMessageBox.confirm(
      t("user.addresses.messages.deleteConfirm"),
      t("common.warning"),
      {
        confirmButtonText: t("common.confirm"),
        cancelButtonText: t("common.cancel"),
        type: "warning",
      }
    );
    if (confirmed) {
      await fetch(`/api/addresses/${address.id}`, {
        method: "DELETE",
      });
      ElMessage.success(t("user.addresses.messages.deleteSuccess"));
      fetchAddresses();
    }
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error(t("user.addresses.messages.deleteFailed"));
    }
  }
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid, fields) => {
    if (valid) {
      try {
        const method = isEdit.value ? "PUT" : "POST";
        const url = isEdit.value
          ? `/api/addresses/${addressForm.value.id}`
          : "/api/addresses";

        await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(addressForm.value),
        });

        ElMessage.success(
          t(
            `user.addresses.messages.${isEdit.value ? "updateSuccess" : "addSuccess"}`
          )
        );
        dialogVisible.value = false;
        fetchAddresses();
      } catch (error) {
        ElMessage.error(
          t(
            `user.addresses.messages.${isEdit.value ? "updateFailed" : "addFailed"}`
          )
        );
      }
    } else {
      console.error("Form validation failed:", fields);
    }
  });
};

// 初始化
onMounted(() => {
  fetchAddresses();
});
</script>

<style scoped lang="scss">
.addresses-container {
  padding: 20px;

  .addresses-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .address-item {
    margin-bottom: 20px;

    .el-card {
      height: 100%;
      transition: all 0.3s;

      &.is-default {
        border-color: var(--el-color-success);
      }

      &:hover {
        box-shadow: var(--el-box-shadow-light);
      }
    }

    .address-content {
      .address-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;

        .recipient {
          font-size: 16px;
          font-weight: bold;
        }
      }

      .phone {
        color: #666;
        margin-bottom: 8px;
      }

      .address-detail {
        color: #333;
        line-height: 1.5;
        margin-bottom: 12px;
      }

      .address-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        border-top: 1px solid #eee;
        padding-top: 12px;
        margin-top: 12px;
      }
    }
  }

  .empty-state {
    padding: 40px 0;
  }
}

:deep(.el-cascader) {
  width: 100%;
}
</style>
