<template>
  <el-card class="addresses-card">
    <template #header>
      <div class="card-header">
        <h2>{{ $t("user.addresses") }}</h2>
        <el-button type="primary" @click="handleAdd">
          {{ $t("checkout.addAddress") }}
        </el-button>
      </div>
    </template>

    <div v-loading="loading" class="addresses-list">
      <el-empty
        v-if="!loading && addresses.length === 0"
        :description="$t('checkout.noAddress')"
      />

      <div v-else class="address-grid">
        <el-card
          v-for="address in addresses"
          :key="address.id"
          class="address-item"
          :class="{ 'is-default': address.isDefault }"
        >
          <template #header>
            <div class="address-header">
              <span class="recipient">{{ address.name }}</span>
              <el-tag v-if="address.isDefault" size="small" type="success">
                默认地址
              </el-tag>
            </div>
          </template>

          <div class="address-content">
            <p class="phone">{{ address.phone }}</p>
            <p class="location">
              {{ address.province }} {{ address.city }} {{ address.district }}
            </p>
            <p class="detail">{{ address.address }}</p>
          </div>

          <div class="address-footer">
            <el-button-group>
              <el-button
                v-if="!address.isDefault"
                link
                type="primary"
                @click="handleSetDefault(address)"
              >
                设为默认
              </el-button>
              <el-button link type="primary" @click="handleEdit(address)">
                {{ $t("common.edit") }}
              </el-button>
              <el-button link type="danger" @click="handleDelete(address)">
                {{ $t("common.delete") }}
              </el-button>
            </el-button-group>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 地址编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? $t('common.edit') : $t('checkout.addAddress')"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="addressForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item :label="$t('checkout.name')" prop="name">
          <el-input v-model="addressForm.name" />
        </el-form-item>

        <el-form-item :label="$t('checkout.phone')" prop="phone">
          <el-input v-model="addressForm.phone" />
        </el-form-item>

        <el-form-item :label="$t('checkout.region')" required>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item prop="province">
                <el-select
                  v-model="addressForm.province"
                  :placeholder="$t('checkout.selectProvince')"
                >
                  <el-option
                    v-for="item in provinces"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="city">
                <el-select
                  v-model="addressForm.city"
                  :placeholder="$t('checkout.selectCity')"
                >
                  <el-option
                    v-for="item in cities"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="district">
                <el-select
                  v-model="addressForm.district"
                  :placeholder="$t('checkout.selectDistrict')"
                >
                  <el-option
                    v-for="item in districts"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item :label="$t('checkout.address')" prop="address">
          <el-input v-model="addressForm.address" type="textarea" :rows="2" />
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="addressForm.isDefault">
            设为默认地址
          </el-checkbox>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">
          {{ $t("common.cancel") }}
        </el-button>
        <el-button type="primary" @click="handleSubmit">
          {{ $t("common.save") }}
        </el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from "@vue/runtime-core";
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormInstance } from "element-plus";

interface Address {
  id: number;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  address: string;
  isDefault: boolean;
}

// 表单校验规则
const rules = {
  name: [
    { required: true, message: "checkout.nameRequired", trigger: "blur" },
    { min: 2, max: 20, message: "Length should be 2 to 20", trigger: "blur" },
  ],
  phone: [
    { required: true, message: "checkout.phoneRequired", trigger: "blur" },
    {
      pattern: /^[0-9-+]{8,}$/,
      message: "checkout.phoneInvalid",
      trigger: "blur",
    },
  ],
  province: [
    { required: true, message: "Please select province", trigger: "change" },
  ],
  city: [{ required: true, message: "Please select city", trigger: "change" }],
  district: [
    { required: true, message: "Please select district", trigger: "change" },
  ],
  address: [
    { required: true, message: "checkout.addressRequired", trigger: "blur" },
    { min: 5, max: 100, message: "Length should be 5 to 100", trigger: "blur" },
  ],
};

// 状态变量
const loading = ref(false);
const dialogVisible = ref(false);
const isEdit = ref(false);
const addresses = ref<Address[]>([]);
const formRef = ref<FormInstance>();

// 表单数据
const addressForm = ref({
  id: 0,
  name: "",
  phone: "",
  province: "",
  city: "",
  district: "",
  address: "",
  isDefault: false,
});

// 地区数据（这里使用模拟数据，实际应该从API获取）
const provinces = ref([
  { value: "guangdong", label: "广东省" },
  { value: "zhejiang", label: "浙江省" },
]);

const cities = ref([
  { value: "guangzhou", label: "广州市" },
  { value: "shenzhen", label: "深圳市" },
]);

const districts = ref([
  { value: "tianhe", label: "天河区" },
  { value: "yuexiu", label: "越秀区" },
]);

// 获取地址列表
const fetchAddresses = async () => {
  loading.value = true;
  try {
    const response = await fetch("/api/addresses");
    const data = await response.json();
    addresses.value = data;
  } catch (error) {
    ElMessage.error("Failed to fetch addresses");
  } finally {
    loading.value = false;
  }
};

// 添加地址
const handleAdd = () => {
  isEdit.value = false;
  addressForm.value = {
    id: 0,
    name: "",
    phone: "",
    province: "",
    city: "",
    district: "",
    address: "",
    isDefault: false,
  };
  dialogVisible.value = true;
};

// 编辑地址
const handleEdit = (address: Address) => {
  isEdit.value = true;
  addressForm.value = { ...address };
  dialogVisible.value = true;
};

// 删除地址
const handleDelete = async (address: Address) => {
  try {
    await ElMessageBox.confirm("common.deleteConfirm", "common.warning", {
      type: "warning",
    });
    await fetch(`/api/addresses/${address.id}`, { method: "DELETE" });
    ElMessage.success("Address deleted successfully");
    fetchAddresses();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("Failed to delete address");
    }
  }
};

// 设为默认地址
const handleSetDefault = async (address: Address) => {
  try {
    await fetch(`/api/addresses/${address.id}/default`, { method: "POST" });
    ElMessage.success("Default address updated");
    fetchAddresses();
  } catch (error) {
    ElMessage.error("Failed to update default address");
  }
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        const url = isEdit.value
          ? `/api/addresses/${addressForm.value.id}`
          : "/api/addresses";
        const method = isEdit.value ? "PUT" : "POST";

        await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(addressForm.value),
        });

        ElMessage.success("checkout.addressAddSuccess");
        dialogVisible.value = false;
        fetchAddresses();
      } catch (error) {
        ElMessage.error("Failed to save address");
      }
    }
  });
};

onMounted(() => {
  fetchAddresses();
});
</script>

<style scoped>
.addresses-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.address-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.address-item {
  position: relative;
}

.address-item.is-default {
  border: 1px solid var(--el-color-success);
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.recipient {
  font-size: 16px;
  font-weight: bold;
}

.address-content {
  margin: 12px 0;
}

.address-content p {
  margin: 8px 0;
  color: var(--el-text-color-regular);
}

.phone {
  color: var(--el-text-color-secondary);
}

.location {
  font-size: 14px;
}

.detail {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.address-footer {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
