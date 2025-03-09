<template>
  <div class="product" v-loading="loading">
    <div class="product-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">{{
          $t("nav.home")
        }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ $t("nav.products") }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ product?.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="product-content" v-if="product">
      <div class="product-gallery">
        <el-image
          :src="product.image"
          :alt="product.name"
          fit="contain"
          :preview-src-list="[product.image]"
        />
      </div>

      <div class="product-info">
        <h1>{{ product.name }}</h1>
        <div class="product-price">
          <span class="currency">¥</span>
          <span class="amount">{{ product.price.toFixed(2) }}</span>
        </div>

        <div class="product-meta">
          <span>{{ $t("product.stock", { count: product.stock }) }}</span>
          <span>{{ $t("product.monthSales", { count: product.sales }) }}</span>
        </div>

        <div class="product-actions">
          <el-input-number
            v-model="quantity"
            :min="1"
            :max="product.stock"
            size="large"
            :placeholder="$t('product.quantity')"
          />
          <el-button type="primary" size="large" @click="addToCart">
            {{ $t("product.addToCart") }}
          </el-button>
          <el-button type="danger" size="large" @click="buyNow">
            {{ $t("product.buyNow") }}
          </el-button>
        </div>
      </div>
    </div>

    <div class="product-tabs">
      <el-tabs>
        <el-tab-pane :label="$t('product.description')">
          <div class="product-description">
            {{ product?.description }}
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('product.specifications')">
          <div class="product-specs">
            <el-descriptions :column="1" border>
              <el-descriptions-item
                v-for="(value, key) in product?.specifications"
                :key="key"
                :label="key"
              >
                {{ value }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('product.reviews')">
          <div class="product-reviews">
            <!-- 评价列表将在后续实现 -->
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "@vue/runtime-core";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
import { products } from "@/api/mock";
import { getMockImage, getMockImages } from "@/utils/mockImages";
import type { Product } from "@/types";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const loading = ref(false);
const product = ref<Product | null>(null);
const quantity = ref(1);

// 获取商品详情
const fetchProduct = async () => {
  loading.value = true;
  try {
    const productId = Number(route.params.id);
    const foundProduct = products.find((p) => p.id === productId);

    if (foundProduct) {
      product.value = {
        ...foundProduct,
        image: getMockImage("product", `product_${foundProduct.id}`),
        images: getMockImages("product", 4, `product_${foundProduct.id}`),
      };
    } else {
      ElMessage.error(t("product.notFound"));
      router.push("/products");
    }
  } catch (error) {
    console.error("Failed to fetch product:", error);
    ElMessage.error(t("common.error"));
  } finally {
    loading.value = false;
  }
};

// 添加到购物车
const addToCart = () => {
  // 这里应该调用实际的API
  ElMessage.success(t("cart.addSuccess"));
};

// 立即购买
const buyNow = () => {
  // 这里应该调用实际的API并跳转到结算页面
  router.push({ name: "checkout" });
};

onMounted(() => {
  fetchProduct();
});
</script>

<style scoped>
.product {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.product-header {
  margin-bottom: 20px;
}

.product-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
}

.product-gallery {
  text-align: center;
}

.product-gallery :deep(.el-image) {
  width: 100%;
  max-width: 500px;
}

.product-info h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

.product-price {
  font-size: 28px;
  color: #f56c6c;
  margin-bottom: 20px;
}

.product-price .currency {
  font-size: 20px;
  margin-right: 4px;
}

.product-meta {
  display: flex;
  gap: 20px;
  color: #666;
  margin-bottom: 20px;
}

.product-actions {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.product-tabs {
  margin-top: 40px;
}

.product-description,
.product-specs {
  padding: 20px 0;
}

@media (max-width: 768px) {
  .product {
    padding: 10px;
  }

  .product-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .product-info h1 {
    font-size: 20px;
  }

  .product-price {
    font-size: 24px;
  }

  .product-actions {
    flex-direction: column;
  }
}
</style>
