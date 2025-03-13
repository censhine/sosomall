<template>
  <div class="brand">
    <div class="brand-header">
      <h1>{{ isListView ? $t("nav.brands") : brand?.name }}</h1>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">{{
          $t("nav.home")
        }}</el-breadcrumb-item>
        <el-breadcrumb-item v-if="isListView">{{
          $t("nav.brands")
        }}</el-breadcrumb-item>
        <el-breadcrumb-item v-else :to="{ name: 'brands' }">{{
          $t("nav.brands")
        }}</el-breadcrumb-item>
        <el-breadcrumb-item v-if="!isListView">{{
          brand?.name
        }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 品牌列表视图 -->
    <template v-if="isListView">
      <el-row :gutter="20">
        <el-col :xs="12" :sm="8" :md="6" v-for="b in brands" :key="b.id">
          <el-card
            class="brand-card"
            :body-style="{ padding: '0px' }"
            @click="goToBrand(b.id)"
          >
            <div class="brand-logo-container">
              <img :src="b.logo" :alt="b.name" class="brand-logo" />
            </div>
            <div class="brand-info">
              <h3>{{ b.name }}</h3>
              <p>{{ b.description }}</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </template>

    <!-- 品牌详情视图 -->
    <template v-else>
      <!-- 品牌信息 -->
      <el-card class="brand-detail" v-if="brand">
        <div class="brand-content">
          <div class="brand-image">
            <img :src="brand.image" :alt="brand.name" />
          </div>
          <div class="brand-details">
            <h2>{{ brand.name }}</h2>
            <p>{{ brand.description }}</p>
          </div>
        </div>
      </el-card>

      <!-- 品牌商品列表 -->
      <div class="brand-products" v-loading="loading">
        <h2>{{ $t("brand.products") }}</h2>
        <el-row :gutter="20">
          <el-col
            :xs="12"
            :sm="8"
            :md="6"
            :lg="4"
            v-for="product in products"
            :key="product.id"
          >
            <product-card :product="product" />
          </el-col>
        </el-row>

        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[12, 24, 36, 48]"
            :total="total"
            layout="total, sizes, prev, pager, next"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "@vue/runtime-core";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import ProductCard from "@/components/ProductCard.vue";
import { brandService, productService } from "@/api/services";
import type { Brand, Product } from "@/api/types";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const loading = ref(false);
const brand = ref<Brand | null>(null);
const brands = ref<Brand[]>([]);
const products = ref<Product[]>([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(12);

// 是否为列表视图
const isListView = computed(() => !route.params.id);

// 获取所有品牌
const fetchBrands = async () => {
  try {
    const res = await brandService.getBrands();
    brands.value = res.data;
  } catch (error) {
    console.error("Failed to fetch brands:", error);
  }
};

// 获取品牌详情
const fetchBrandDetail = async () => {
  try {
    const res = await brandService.getBrand(Number(route.params.id));
    brand.value = res.data;
  } catch (error) {
    console.error("Failed to fetch brand:", error);
  }
};

// 获取品牌商品
const fetchProducts = async () => {
  loading.value = true;
  try {
    const res = await productService.getProducts({
      brandId: Number(route.params.id),
      page: currentPage.value,
      pageSize: pageSize.value,
    });
    products.value = res.data.items;
    total.value = res.data.total;
  } catch (error) {
    console.error("Failed to fetch products:", error);
  } finally {
    loading.value = false;
  }
};

// 跳转到品牌详情
const goToBrand = (id: number) => {
  router.push({ name: "brand", params: { id: id.toString() } });
};

// 处理页码变化
const handleCurrentChange = (page: number) => {
  fetchProducts();
};

// 处理每页数量变化
const handleSizeChange = (size: number) => {
  currentPage.value = 1;
  fetchProducts();
};

// 监听路由参数变化
watch(
  () => route.params.id,
  () => {
    if (route.params.id) {
      currentPage.value = 1;
      fetchBrandDetail();
      fetchProducts();
    } else {
      fetchBrands();
    }
  }
);

onMounted(() => {
  if (route.params.id) {
    fetchBrandDetail();
    fetchProducts();
  } else {
    fetchBrands();
  }
});
</script>

<style scoped>
.brand {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.brand-header {
  margin-bottom: 20px;
}

.brand-header h1 {
  margin-bottom: 10px;
  font-size: 24px;
  color: #333;
}

.brand-card {
  cursor: pointer;
  transition: transform 0.3s;
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.brand-card:hover {
  transform: translateY(-5px);
}

.brand-logo-container {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f5f7fa;
}

.brand-logo {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.brand-info {
  padding: 15px;
}

.brand-info h3 {
  margin: 0 0 10px;
  font-size: 18px;
  color: var(--el-text-color-primary);
}

.brand-info p {
  margin: 0;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  line-height: 1.4;
}

.brand-detail {
  margin-bottom: 30px;
}

.brand-content {
  display: flex;
  gap: 20px;
}

.brand-image {
  flex: 0 0 200px;
}

.brand-image img {
  width: 100%;
  height: auto;
  border-radius: 4px;
}

.brand-details {
  flex: 1;
}

.brand-details h2 {
  margin-bottom: 10px;
  font-size: 20px;
  color: #333;
}

.brand-products {
  min-height: 400px;
}

.brand-products h2 {
  margin-bottom: 20px;
  font-size: 20px;
  color: #333;
}

.pagination {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .brand {
    padding: 10px;
  }

  .brand-header h1 {
    font-size: 20px;
  }

  .brand-content {
    flex-direction: column;
  }

  .brand-image {
    flex: none;
    margin-bottom: 20px;
  }

  .brand-logo-container {
    height: 100px;
  }

  .brand-info h3 {
    font-size: 16px;
  }

  .brand-info p {
    font-size: 12px;
  }

  .brand-details h2,
  .brand-products h2 {
    font-size: 18px;
  }
}
</style>
