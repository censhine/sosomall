<template>
  <div class="cart-preview">
    <el-badge :value="cartStore.count" :hidden="!cartStore.count">
      <el-button class="cart-button" @click="showDrawer = true">
        <el-icon><ShoppingCart /></el-icon>
      </el-button>
    </el-badge>

    <el-drawer
      v-model="showDrawer"
      :title="$t('cart.preview.title')"
      :size="400"
      direction="rtl"
    >
      <div class="cart-preview-content">
        <template v-if="cartStore.items.length">
          <div class="cart-items">
            <div
              v-for="item in cartStore.items"
              :key="item.id"
              class="cart-item"
            >
              <el-image
                :src="item.image"
                :alt="item.name"
                class="item-image"
                @click="router.push(`/product/${item.id}`)"
              />
              <div class="item-info">
                <h4 class="item-name">{{ item.name }}</h4>
                <div class="item-price-qty">
                  <span class="item-price">¥{{ item.price.toFixed(2) }}</span>
                  <span class="item-quantity">x {{ item.quantity }}</span>
                </div>
              </div>
              <el-button
                type="danger"
                circle
                size="small"
                @click="handleRemoveItem(item.id)"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>

          <div class="cart-preview-footer">
            <div class="cart-total">
              <span>{{ $t('cart.preview.total') }}:</span>
              <span class="total-price">¥{{ cartStore.total.toFixed(2) }}</span>
            </div>
            <div class="cart-actions">
              <el-button @click="router.push('/cart')">
                {{ $t('cart.preview.viewCart') }}
              </el-button>
              <el-button type="primary" @click="router.push('/checkout')">
                {{ $t('cart.preview.checkout') }}
              </el-button>
            </div>
          </div>
        </template>

        <div v-else class="cart-empty">
          <el-empty :description="$t('cart.preview.empty')">
            <el-button @click="router.push('/products')">
              {{ $t('cart.preview.goShopping') }}
            </el-button>
          </el-empty>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import { ShoppingCart, Delete } from '@element-plus/icons-vue';
import { useCartStore } from '@/stores/cart';

const router = useRouter();
const { t } = useI18n();
const cartStore = useCartStore();

const showDrawer = ref(false);

const handleRemoveItem = async (id: number) => {
  try {
    await cartStore.removeItem(id);
    ElMessage.success(t('cart.messages.removeSuccess'));
  } catch (error) {
    ElMessage.error(t('cart.messages.removeFailed'));
  }
};
</script>

<style scoped lang="scss">
.cart-preview {
  .cart-button {
    padding: 8px;
    height: auto;
  }

  .cart-preview-content {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .cart-items {
    flex: 1;
    overflow-y: auto;
    padding: 0 20px;
  }

  .cart-item {
    display: flex;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid var(--el-border-color-lighter);

    .item-image {
      width: 60px;
      height: 60px;
      object-fit: cover;
      margin-right: 10px;
      cursor: pointer;
    }

    .item-info {
      flex: 1;
      margin-right: 10px;

      .item-name {
        margin: 0 0 5px;
        font-size: 14px;
        line-height: 1.4;
      }

      .item-price-qty {
        color: var(--el-text-color-secondary);
        font-size: 13px;

        .item-price {
          color: var(--el-color-danger);
          margin-right: 10px;
        }
      }
    }
  }

  .cart-preview-footer {
    padding: 20px;
    border-top: 1px solid var(--el-border-color-lighter);

    .cart-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;

      .total-price {
        color: var(--el-color-danger);
        font-size: 18px;
        font-weight: bold;
      }
    }

    .cart-actions {
      display: flex;
      gap: 10px;

      .el-button {
        flex: 1;
      }
    }
  }

  .cart-empty {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>