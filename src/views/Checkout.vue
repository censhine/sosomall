<template>
  <div class="checkout">
    <div class="checkout-header">
      <h1>{{ $t("checkout.title") }}</h1>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">{{
          $t("nav.home")
        }}</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/cart' }">{{
          $t("cart.title")
        }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ $t("checkout.title") }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="checkout-content" v-loading="loading">
      <!-- 收货地址 -->
      <el-card class="address-section">
        <template #header>
          <div class="card-header">
            <span>{{ $t("checkout.shippingAddress") }}</span>
            <el-button
              v-if="!addresses.length"
              type="primary"
              @click="showAddressDialog"
            >
              {{ $t("checkout.addAddress") }}
            </el-button>
          </div>
        </template>

        <div class="address-list" v-if="addresses.length">
          <el-radio-group v-model="selectedAddressId">
            <div
              v-for="address in addresses"
              :key="address.id"
              class="address-item"
            >
              <el-radio :label="address.id">
                <div class="address-info">
                  <div class="contact">
                    <span class="name">{{ address.name }}</span>
                    <span class="phone">{{ address.phone }}</span>
                  </div>
                  <div class="location">
                    {{ address.province }} {{ address.city }}
                    {{ address.district }}
                    {{ address.address }}
                  </div>
                </div>
              </el-radio>
            </div>
          </el-radio-group>
          <div class="address-actions">
            <el-button type="primary" @click="showAddressDialog">
              {{ $t("checkout.addAddress") }}
            </el-button>
          </div>
        </div>

        <el-empty v-else :description="$t('checkout.noAddress')" />
      </el-card>

      <!-- 订单商品 -->
      <el-card class="order-items">
        <template #header>
          <div class="card-header">
            <span>{{ $t("checkout.orderItems") }}</span>
          </div>
        </template>

        <el-table :data="orderItems" style="width: 100%">
          <el-table-column :label="$t('cart.product')" min-width="400">
            <template #default="{ row }">
              <div class="product-info">
                <el-image
                  :src="row.image"
                  :alt="row.name"
                  class="product-image"
                />
                <div class="product-details">
                  <div class="product-name">{{ row.name }}</div>
                  <div class="product-specs" v-if="row.specs">
                    <span v-for="(value, key) in row.specs" :key="key">
                      {{ key }}: {{ value }}
                    </span>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('cart.price')" width="120" align="center">
            <template #default="{ row }">
              <span class="price">¥{{ row.price.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('cart.quantity')"
            width="120"
            align="center"
          >
            <template #default="{ row }">
              <span>{{ row.quantity }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('cart.subtotal')"
            width="120"
            align="center"
          >
            <template #default="{ row }">
              <span class="subtotal">
                ¥{{ (row.price * row.quantity).toFixed(2) }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 支付方式 -->
      <el-card class="payment-section">
        <template #header>
          <div class="card-header">
            <span>{{ $t("checkout.paymentMethod") }}</span>
          </div>
        </template>

        <el-radio-group v-model="paymentMethod">
          <el-radio label="alipay">
            <i class="payment-icon alipay"></i>
            {{ $t("checkout.alipay") }}
          </el-radio>
          <el-radio label="wechat">
            <i class="payment-icon wechat"></i>
            {{ $t("checkout.wechat") }}
          </el-radio>
          <el-radio label="creditCard">
            <i class="payment-icon credit-card"></i>
            {{ $t("checkout.creditCard") }}
          </el-radio>
        </el-radio-group>
      </el-card>

      <!-- 订单总结 -->
      <el-card class="order-summary">
        <div class="summary-item">
          <span>{{ $t("checkout.subtotal") }}</span>
          <span>¥{{ subtotal.toFixed(2) }}</span>
        </div>
        <div class="summary-item">
          <span>{{ $t("checkout.shipping") }}</span>
          <span>¥{{ shipping.toFixed(2) }}</span>
        </div>
        <div class="summary-item total">
          <span>{{ $t("checkout.total") }}</span>
          <span>¥{{ total.toFixed(2) }}</span>
        </div>
        <el-button
          type="primary"
          size="large"
          class="submit-button"
          :disabled="!canSubmit"
          :loading="submitting"
          @click="handleSubmit"
        >
          {{ $t("checkout.placeOrder") }}
        </el-button>
      </el-card>
    </div>

    <!-- 添加地址对话框 -->
    <el-dialog
      v-model="addressDialogVisible"
      :title="$t('checkout.addAddress')"
      width="500px"
    >
      <el-form
        ref="addressForm"
        :model="addressForm"
        :rules="addressRules"
        label-width="100px"
      >
        <el-form-item :label="$t('checkout.name')" prop="name">
          <el-input v-model="addressForm.name" />
        </el-form-item>
        <el-form-item :label="$t('checkout.phone')" prop="phone">
          <el-input v-model="addressForm.phone" />
        </el-form-item>
        <el-form-item :label="$t('checkout.region')" required>
          <el-select
            v-model="addressForm.province"
            class="region-select"
            :placeholder="$t('checkout.selectProvince')"
          >
            <el-option
              v-for="item in provinces"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select
            v-model="addressForm.city"
            class="region-select"
            :placeholder="$t('checkout.selectCity')"
          >
            <el-option
              v-for="item in cities"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select
            v-model="addressForm.district"
            class="region-select"
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
        <el-form-item :label="$t('checkout.address')" prop="address">
          <el-input v-model="addressForm.address" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addressDialogVisible = false">
          {{ $t("common.cancel") }}
        </el-button>
        <el-button type="primary" @click="handleAddAddress">
          {{ $t("common.confirm") }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  specs?: Record<string, string>;
}

interface Address {
  id: number;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  address: string;
}

const router = useRouter();
const { t } = useI18n();

const loading = ref(false);
const submitting = ref(false);
const addressDialogVisible = ref(false);

// 订单商品（模拟数据）
const orderItems = ref<OrderItem[]>([
  {
    id: 1,
    name: "示例商品1",
    price: 99.99,
    quantity: 1,
    image: "https://via.placeholder.com/100",
    specs: {
      颜色: "红色",
      尺寸: "M",
    },
  },
  {
    id: 2,
    name: "示例商品2",
    price: 199.99,
    quantity: 2,
    image: "https://via.placeholder.com/100",
  },
]);

// 收货地址（模拟数据）
const addresses = ref<Address[]>([
  {
    id: 1,
    name: "张三",
    phone: "13800138000",
    province: "广东省",
    city: "深圳市",
    district: "南山区",
    address: "科技园路1号",
  },
]);

// 地址表单
const addressForm = ref({
  name: "",
  phone: "",
  province: "",
  city: "",
  district: "",
  address: "",
});

// 地址表单验证规则
const addressRules = {
  name: [
    { required: true, message: t("checkout.nameRequired"), trigger: "blur" },
  ],
  phone: [
    { required: true, message: t("checkout.phoneRequired"), trigger: "blur" },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: t("checkout.phoneInvalid"),
      trigger: "blur",
    },
  ],
  address: [
    { required: true, message: t("checkout.addressRequired"), trigger: "blur" },
  ],
};

// 地区选项（模拟数据）
const provinces = ref([
  { value: "广东省", label: "广东省" },
  { value: "北京市", label: "北京市" },
]);

const cities = ref([
  { value: "深圳市", label: "深圳市" },
  { value: "广州市", label: "广州市" },
]);

const districts = ref([
  { value: "南山区", label: "南山区" },
  { value: "福田区", label: "福田区" },
]);

const selectedAddressId = ref(addresses.value[0]?.id);
const paymentMethod = ref("alipay");

// 计算商品总价
const subtotal = computed(() => {
  return orderItems.value.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
});

// 运费（模拟固定运费）
const shipping = computed(() => 10);

// 订单总价
const total = computed(() => subtotal.value + shipping.value);

// 是否可以提交订单
const canSubmit = computed(
  () =>
    selectedAddressId.value &&
    paymentMethod.value &&
    orderItems.value.length > 0
);

// 显示添加地址对话框
const showAddressDialog = () => {
  addressDialogVisible.value = true;
};

// 处理添加地址
const handleAddAddress = async () => {
  const addressFormEl = ref<FormInstance>();
  if (!addressFormEl.value) return;

  await addressFormEl.value.validate((valid, fields) => {
    if (valid) {
      // 这里应该调用实际的API
      const newAddress: Address = {
        id: addresses.value.length + 1,
        ...addressForm.value,
      };
      addresses.value.push(newAddress);
      selectedAddressId.value = newAddress.id;
      addressDialogVisible.value = false;
      ElMessage.success(t("checkout.addressAddSuccess"));
    }
  });
};

// 提交订单
const handleSubmit = async () => {
  if (!canSubmit.value) return;

  submitting.value = true;
  try {
    // 这里应该调用实际的API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    ElMessage.success(t("checkout.orderSuccess"));
    router.push("/orders");
  } catch (error) {
    ElMessage.error(t("checkout.orderFailed"));
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.checkout {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.checkout-header {
  margin-bottom: 20px;
}

.checkout-header h1 {
  margin-bottom: 10px;
  font-size: 24px;
  color: #333;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.address-section,
.order-items,
.payment-section,
.order-summary {
  margin-bottom: 20px;
}

.address-list {
  margin-bottom: 20px;
}

.address-item {
  padding: 15px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  margin-bottom: 10px;
}

.address-item:hover {
  border-color: #409eff;
}

.address-info {
  margin-left: 30px;
}

.contact {
  margin-bottom: 5px;
}

.name {
  font-weight: 500;
  margin-right: 20px;
}

.phone {
  color: #666;
}

.location {
  color: #666;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.product-details {
  flex: 1;
}

.product-name {
  margin-bottom: 8px;
  color: #333;
}

.product-specs {
  font-size: 12px;
  color: #666;
}

.product-specs span {
  margin-right: 10px;
}

.price,
.subtotal {
  color: #f56c6c;
  font-weight: 500;
}

.payment-section :deep(.el-radio) {
  display: block;
  height: 40px;
  line-height: 40px;
  margin: 0;
  padding: 0 20px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  margin-bottom: 10px;
}

.payment-section :deep(.el-radio.is-checked) {
  border-color: #409eff;
}

.payment-icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  margin-right: 8px;
  vertical-align: middle;
  background-size: contain;
  background-repeat: no-repeat;
}

.payment-icon.alipay {
  background-image: url("@/assets/alipay.png");
}

.payment-icon.wechat {
  background-image: url("@/assets/wechat.png");
}

.payment-icon.credit-card {
  background-image: url("@/assets/credit-card.png");
}

.order-summary {
  position: sticky;
  bottom: 20px;
  background-color: #fff;
  z-index: 1;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
}

.summary-item.total {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #dcdfe6;
  font-size: 18px;
  font-weight: 500;
}

.submit-button {
  width: 100%;
  margin-top: 20px;
}

.region-select {
  width: 120px;
  margin-right: 10px;
}

@media (max-width: 768px) {
  .checkout {
    padding: 10px;
  }

  .checkout-header h1 {
    font-size: 20px;
  }

  .product-info {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }

  .region-select {
    width: 100%;
    margin-right: 0;
    margin-bottom: 10px;
  }
}
</style>
