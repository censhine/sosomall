<template>
  <div class="section special-products-section">
    <div class="section-header">
      <h2>{{ $t("home.specialProducts.title") }}</h2>
      <el-button text @click="$router.push('/products?sort=special')">
        {{ $t("common.viewAll") }}
        <el-icon class="el-icon--right"><ArrowRight /></el-icon>
      </el-button>
    </div>
    <el-row :gutter="20">
      <el-col
        v-for="product in specialProducts"
        :key="product.id"
        :xs="12"
        :sm="12"
        :md="6"
        :lg="6"
      >
        <product-card :product="product" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { ArrowRight } from "@element-plus/icons-vue";
import { useI18n } from "vue-i18n";
import ProductCard from "@/components/ProductCard.vue";
import type { Product } from "@/types/home";

const router = useRouter();
const { t } = useI18n();

// 特价商品数据
const specialProducts = ref<Product[]>([]);

// 获取特价商品
const fetchSpecialProducts = async () => {
  try {
    const response = await fetch("/api/products/special");
    const data = await response.json();
    specialProducts.value = data.items.slice(0, 8); // 最多显示8个特价商品
  } catch (error) {
    ElMessage.error(t("common.error.fetchFailed"));
  }
};

onMounted(() => {
  fetchSpecialProducts();
});
</script>

<style scoped lang="scss">
.special-products-section {
  margin: 40px 0;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h2 {
      font-size: 24px;
      color: var(--el-text-color-primary);
      margin: 0;
    }
  }

  :deep(.el-col) {
    margin-bottom: 20px;
  }
}

@media (max-width: 768px) {
  .special-products-section {
    .section-header {
      h2 {
        font-size: 20px;
      }
    }
  }
}
</style>