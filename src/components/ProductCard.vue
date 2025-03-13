<template>
  <el-card shadow="hover" class="product-card" @click="handleClick">
    <div class="product-image">
      <el-image :src="product.image" fit="cover">
        <template #error>
          <div class="image-slot">
            <el-icon><Picture /></el-icon>
          </div>
        </template>
      </el-image>
      <div v-if="product.isNew" class="product-tag new">
        {{ t("product.tags.new") }}
      </div>
      <div v-if="product.isHot" class="product-tag hot">
        {{ t("product.tags.hot") }}
      </div>
    </div>
    <div class="product-info">
      <h3 class="product-name" :title="product.name">{{ product.name }}</h3>
      <p class="product-description">{{ product.description }}</p>
      <div class="product-price">
        <span class="current-price">¥{{ product.price.toFixed(2) }}</span>
        <span v-if="product.originalPrice" class="original-price">
          ¥{{ product.originalPrice.toFixed(2) }}
        </span>
      </div>
      <div class="product-meta">
        <el-rate
          v-model="product.rating"
          disabled
          show-score
          text-color="#ff9900"
          score-template="{value}"
        />
        <span class="sales">{{
          t("product.sales", { count: product.sales })
        }}</span>
      </div>
      <div class="product-actions">
        <el-button type="primary" @click.stop="handleAddToCart">
          {{ t("product.actions.addToCart") }}
        </el-button>
        <el-button @click.stop="handleAddToFavorite">
          <el-icon><Star /></el-icon>
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { Picture, Star } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import type { Product } from "@/types/home";

const props = defineProps<{
  product: Product;
}>();

const router = useRouter();
const { t } = useI18n();

const handleClick = (event: MouseEvent) => {
  // 如果点击的是按钮，不进行跳转
  if (
    (event.target as HTMLElement).closest(".product-actions") ||
    (event.target as HTMLElement).closest(".el-button")
  ) {
    return;
  }
  router.push(`/product/${props.product.id}`);
};

const handleAddToCart = async () => {
  try {
    await fetch("/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: props.product.id,
        quantity: 1,
      }),
    });
    ElMessage.success(t("product.messages.addToCartSuccess"));
  } catch (error) {
    ElMessage.error(t("product.messages.addToCartFailed"));
  }
};

const handleAddToFavorite = async () => {
  try {
    await fetch("/api/favorites/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: props.product.id,
      }),
    });
    ElMessage.success(t("product.messages.addToFavoriteSuccess"));
  } catch (error) {
    ElMessage.error(t("product.messages.addToFavoriteFailed"));
  }
};
</script>

<style scoped lang="scss">
.product-card {
  height: 100%;
  cursor: pointer;
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }

  .product-image {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;

    .el-image {
      width: 100%;
      height: 100%;
    }

    .product-tag {
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      color: #fff;

      &.new {
        background-color: var(--el-color-success);
      }

      &.hot {
        background-color: var(--el-color-danger);
      }
    }
  }

  .product-info {
    padding: 14px;

    .product-name {
      margin: 0 0 8px;
      font-size: 16px;
      font-weight: 500;
      color: var(--el-text-color-primary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .product-description {
      margin: 0 0 8px;
      font-size: 14px;
      color: var(--el-text-color-secondary);
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      min-height: 40px;
    }

    .product-price {
      margin-bottom: 8px;

      .current-price {
        font-size: 18px;
        font-weight: bold;
        color: var(--el-color-danger);
        margin-right: 8px;
      }

      .original-price {
        font-size: 14px;
        color: var(--el-text-color-secondary);
        text-decoration: line-through;
      }
    }

    .product-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
      font-size: 14px;
      color: var(--el-text-color-secondary);

      .el-rate {
        display: inline-flex;
      }
    }

    .product-actions {
      display: flex;
      gap: 8px;

      .el-button {
        flex: 1;
      }
    }
  }

  .image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
    font-size: 30px;
  }
}
</style>
