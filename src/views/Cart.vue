<template>
  <div class="cart">
    <div class="cart-header">
      <h1>{{ $t("cart.title") }}</h1>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">{{
          $t("nav.home")
        }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ $t("cart.title") }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="cart-content" v-loading="loading">
      <template v-if="cartItems.length">
        <el-table
          ref="multipleTable"
          :data="cartItems"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column :label="$t('cart.product')" min-width="400">
            <template #default="{ row }">
              <div class="product-info">
                <el-image
                  :src="row.product.image"
                  :alt="row.product.name"
                  class="product-image"
                  @click="router.push(`/product/${row.product.id}`)"
                />
                <div class="product-details">
                  <router-link
                    :to="{ name: 'product', params: { id: row.product.id } }"
                    class="product-name"
                  >
                    {{ row.product.name }}
                  </router-link>
                  <div class="product-specs" v-if="row.product.specs">
                    <span v-for="(value, key) in row.product.specs" :key="key">
                      {{ key }}: {{ value }}
                    </span>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('cart.price')" width="120" align="center">
            <template #default="{ row }">
              <span class="price">¥{{ row.product.price.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('cart.quantity')"
            width="150"
            align="center"
          >
            <template #default="{ row }">
              <el-input-number
                v-model="row.quantity"
                :min="1"
                :max="row.product.stock"
                size="small"
                @change="(value) => handleQuantityChange(row, value)"
              />
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('cart.subtotal')"
            width="120"
            align="center"
          >
            <template #default="{ row }">
              <span class="subtotal">
                ¥{{ (row.product.price * row.quantity).toFixed(2) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('cart.actions')"
            width="100"
            align="center"
          >
            <template #default="{ row }">
              <el-button type="danger" size="small" @click="handleRemove(row)">
                {{ $t("common.delete") }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="cart-footer">
          <div class="cart-summary">
            <span class="selected-items">
              {{ $t("cart.selectedItems", { count: selectedItems.length }) }}
            </span>
            <span class="total">
              {{ $t("cart.total") }}:
              <span class="total-price"> ¥{{ totalPrice.toFixed(2) }} </span>
            </span>
          </div>
          <div class="cart-actions">
            <el-button @click="handleClearCart">
              {{ $t("cart.clear") }}
            </el-button>
            <el-button
              type="primary"
              :disabled="!selectedItems.length"
              @click="handleCheckout"
            >
              {{ $t("cart.checkout") }}
            </el-button>
          </div>
        </div>
      </template>

      <el-empty v-else :description="$t('cart.empty')">
        <el-button type="primary" @click="$router.push('/')">
          {{ $t("cart.continueShopping") }}
        </el-button>
      </el-empty>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { ElMessage, ElMessageBox } from "element-plus";
import { cartService } from "@/api";
import type { CartItem } from "@/api/types";

const router = useRouter();
const { t } = useI18n();

const loading = ref(false);
const cartItems = ref<CartItem[]>([]);
const selectedItems = ref<CartItem[]>([]);

// 获取购物车列表
const fetchCartItems = async () => {
  loading.value = true;
  try {
    const response = await cartService.getCartItems();
    cartItems.value = response.data;
  } catch (error) {
    console.error("Failed to fetch cart items:", error);
    ElMessage.error(t("cart.fetchFailed"));
  } finally {
    loading.value = false;
  }
};

// 计算总价
const totalPrice = computed(() => {
  return selectedItems.value.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
});

// 处理选择变化
const handleSelectionChange = (items: CartItem[]) => {
  selectedItems.value = items;
};

// 处理数量变化
const handleQuantityChange = async (item: CartItem, value: number) => {
  try {
    await cartService.updateCartItem(item.product.id, value);
    ElMessage.success(t("cart.updateSuccess"));
  } catch (error) {
    ElMessage.error(t("cart.updateFailed"));
    // 恢复原数量
    item.quantity = value;
  }
};

// 处理移除商品
const handleRemove = async (item: CartItem) => {
  try {
    await ElMessageBox.confirm(t("common.deleteConfirm"), t("common.warning"), {
      type: "warning",
    });
    await cartService.removeFromCart(item.product.id);
    const index = cartItems.value.findIndex(
      (i) => i.product.id === item.product.id
    );
    if (index > -1) {
      cartItems.value.splice(index, 1);
    }
    ElMessage.success(t("cart.removeSuccess"));
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error(t("cart.removeFailed"));
    }
  }
};

// 处理清空购物车
const handleClearCart = async () => {
  try {
    await ElMessageBox.confirm(t("cart.clearConfirm"), t("common.warning"), {
      type: "warning",
    });
    await cartService.clearCart();
    cartItems.value = [];
    selectedItems.value = [];
    ElMessage.success(t("cart.clearSuccess"));
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error(t("cart.clearFailed"));
    }
  }
};

// 处理结算
const handleCheckout = () => {
  if (!selectedItems.value.length) {
    ElMessage.warning(t("cart.selectItems"));
    return;
  }
  router.push("/checkout");
};

onMounted(() => {
  fetchCartItems();
});
</script>

<style scoped>
.cart {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.cart-header {
  margin-bottom: 20px;
}

.cart-header h1 {
  margin-bottom: 10px;
  font-size: 24px;
  color: #333;
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
  cursor: pointer;
  transition: opacity 0.3s;
}

.product-image:hover {
  opacity: 0.8;
}

.product-details {
  flex: 1;
}

.product-name {
  display: block;
  margin-bottom: 8px;
  color: #333;
  text-decoration: none;
}

.product-name:hover {
  color: #409eff;
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

.cart-footer {
  margin-top: 20px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-summary {
  display: flex;
  align-items: center;
  gap: 20px;
}

.selected-items {
  color: #666;
}

.total {
  font-size: 16px;
}

.total-price {
  color: #f56c6c;
  font-size: 20px;
  font-weight: 500;
}

.cart-actions {
  display: flex;
  gap: 20px;
}

@media (max-width: 768px) {
  .cart {
    padding: 10px;
  }

  .cart-header h1 {
    font-size: 20px;
  }

  .product-info {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }

  .cart-footer {
    flex-direction: column;
    gap: 20px;
  }

  .cart-summary {
    flex-direction: column;
    gap: 10px;
  }

  .cart-actions {
    width: 100%;
  }

  .cart-actions .el-button {
    flex: 1;
  }
}
</style>
