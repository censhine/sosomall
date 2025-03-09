<template>
  <div class="product-list">
    <div class="list-header">
      <h1>{{ $t("product.allProducts") }}</h1>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">{{
          $t("nav.home")
        }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ $t("nav.products") }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 筛选器 -->
    <div class="filters">
      <el-card>
        <!-- 分类筛选 -->
        <div class="filter-item">
          <h3>{{ $t("product.categories") }}</h3>
          <el-select v-model="filters.categoryId" clearable>
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </div>

        <!-- 品牌筛选 -->
        <div class="filter-item">
          <h3>{{ $t("product.brands") }}</h3>
          <el-select v-model="filters.brandId" clearable>
            <el-option
              v-for="brand in brands"
              :key="brand.id"
              :label="brand.name"
              :value="brand.id"
            />
          </el-select>
        </div>

        <!-- 价格范围 -->
        <div class="filter-item">
          <h3>{{ $t("product.priceRange") }}</h3>
          <el-slider
            v-model="filters.priceRange"
            range
            :min="0"
            :max="10000"
            :step="100"
          />
          <div class="price-inputs">
            <el-input-number
              v-model="filters.priceRange[0]"
              :min="0"
              :max="filters.priceRange[1]"
              size="small"
            />
            <span>-</span>
            <el-input-number
              v-model="filters.priceRange[1]"
              :min="filters.priceRange[0]"
              :max="10000"
              size="small"
            />
          </div>
        </div>

        <!-- 排序方式 -->
        <div class="filter-item">
          <h3>{{ $t("product.sortBy") }}</h3>
          <el-radio-group v-model="filters.sortBy">
            <el-radio-button label="default">{{
              $t("product.sortDefault")
            }}</el-radio-button>
            <el-radio-button label="price-asc">{{
              $t("product.sortPriceAsc")
            }}</el-radio-button>
            <el-radio-button label="price-desc">{{
              $t("product.sortPriceDesc")
            }}</el-radio-button>
            <el-radio-button label="sales">{{
              $t("product.sortBySales")
            }}</el-radio-button>
          </el-radio-group>
        </div>

        <!-- 操作按钮 -->
        <div class="filter-actions">
          <el-button type="primary" @click="handleFilter">{{
            $t("common.search")
          }}</el-button>
          <el-button @click="resetFilter">{{ $t("common.reset") }}</el-button>
        </div>
      </el-card>
    </div>

    <!-- 商品列表 -->
    <div class="products" v-loading="loading">
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "@vue/runtime-core";
import { useI18n } from "vue-i18n";
import ProductCard from "@/components/ProductCard.vue";
import {
  products as mockProducts,
  categories as mockCategories,
  brands as mockBrands,
} from "@/api/mock";
import { getMockImage } from "@/utils/mockImages";
import type { Product, Category, Brand } from "@/types";

const { t } = useI18n();

const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(12);
const total = ref(0);

const filters = ref({
  categoryId: "",
  brandId: "",
  priceRange: [0, 10000],
  sortBy: "default",
});

const products = ref<Product[]>([]);
const categories = ref<Category[]>([]);
const brands = ref<Brand[]>([]);

// 获取所有商品
const fetchProducts = async () => {
  loading.value = true;
  try {
    const filteredProducts = mockProducts.filter((product: Product) => {
      if (
        filters.value.categoryId &&
        product.categoryId !== filters.value.categoryId
      ) {
        return false;
      }
      if (filters.value.brandId && product.brandId !== filters.value.brandId) {
        return false;
      }
      if (
        product.price < filters.value.priceRange[0] ||
        product.price > filters.value.priceRange[1]
      ) {
        return false;
      }
      return true;
    });

    // 排序
    const sortedProducts = [...filteredProducts].sort((a, b) => {
      switch (filters.value.sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "sales":
          return b.sales - a.sales;
        default:
          return 0;
      }
    });

    total.value = sortedProducts.length;
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    products.value = sortedProducts.slice(start, end);
  } catch (error) {
    console.error("Failed to fetch products:", error);
  } finally {
    loading.value = false;
  }
};

// 获取分类列表
const fetchCategories = () => {
  categories.value = mockCategories;
};

// 获取品牌列表
const fetchBrands = () => {
  brands.value = mockBrands;
};

// 处理筛选
const handleFilter = () => {
  currentPage.value = 1;
  fetchProducts();
};

// 重置筛选
const resetFilter = () => {
  filters.value = {
    categoryId: "",
    brandId: "",
    priceRange: [0, 10000],
    sortBy: "default",
  };
  handleFilter();
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

// 监听筛选条件变化
watch(
  () => filters.value,
  () => {
    handleFilter();
  },
  { deep: true }
);

onMounted(() => {
  fetchCategories();
  fetchBrands();
  fetchProducts();
});
</script>

<style scoped>
.product-list {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.list-header {
  margin-bottom: 20px;
}

.list-header h1 {
  margin-bottom: 10px;
  font-size: 24px;
  color: #333;
}

.filters {
  margin-bottom: 20px;
}

.filter-item {
  margin-bottom: 20px;
}

.filter-item:last-child {
  margin-bottom: 0;
}

.filter-item h3 {
  margin-bottom: 10px;
  font-size: 16px;
  color: #333;
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.filter-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.products {
  min-height: 400px;
}

.pagination {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .product-list {
    padding: 10px;
  }

  .list-header h1 {
    font-size: 20px;
  }

  .filter-item h3 {
    font-size: 14px;
  }

  .filter-actions {
    flex-direction: column;
  }
}
</style>
