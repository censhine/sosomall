<template>
  <div class="category">
    <div class="category-header">
      <h1>{{ isListView ? $t("nav.categories") : category?.name }}</h1>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">{{
          $t("nav.home")
        }}</el-breadcrumb-item>
        <el-breadcrumb-item v-if="isListView">{{
          $t("nav.categories")
        }}</el-breadcrumb-item>
        <el-breadcrumb-item v-else :to="{ name: 'categories' }">{{
          $t("nav.categories")
        }}</el-breadcrumb-item>
        <el-breadcrumb-item v-if="!isListView">{{
          category?.name
        }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 分类列表视图 -->
    <template v-if="isListView">
      <el-row :gutter="20">
        <el-col
          :xs="12"
          :sm="8"
          :md="6"
          v-for="cat in categories"
          :key="cat.id"
        >
          <el-card
            class="category-card"
            :body-style="{ padding: '0px' }"
            @click="goToCategory(cat.id)"
          >
            <img :src="cat.image" :alt="cat.name" class="category-image" />
            <div class="category-info">
              <h3>{{ cat.name }}</h3>
              <p>{{ cat.description }}</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </template>

    <!-- 分类详情视图 -->
    <template v-else>
      <!-- 筛选器 -->
      <div class="filters">
        <el-card>
          <!-- 价格范围 -->
          <div class="filter-item">
            <h3>{{ $t("product.priceRange") }}</h3>
            <el-slider
              v-model="priceRange"
              range
              :min="0"
              :max="10000"
              :step="100"
              @change="handlePriceChange"
            />
            <div class="price-inputs">
              <el-input-number
                v-model="priceRange[0]"
                :min="0"
                :max="priceRange[1]"
                size="small"
              />
              <span>-</span>
              <el-input-number
                v-model="priceRange[1]"
                :min="priceRange[0]"
                :max="10000"
                size="small"
              />
            </div>
          </div>

          <!-- 排序方式 -->
          <div class="filter-item">
            <h3>{{ $t("product.sortBy") }}</h3>
            <el-radio-group v-model="sortBy" @change="handleSortChange">
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
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "@vue/runtime-core";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import ProductCard from "@/components/ProductCard.vue";
import { categoryService, productService } from "@/api/services";
import type { Category, Product } from "@/api/types";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const loading = ref(false);
const category = ref<Category | null>(null);
const categories = ref<Category[]>([]);
const products = ref<Product[]>([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(12);
const priceRange = ref([0, 10000]);
const sortBy = ref("default");

// 是否为列表视图
const isListView = computed(() => !route.params.id);

// 获取所有分类
const fetchCategories = async () => {
  try {
    const res = await categoryService.getCategories();
    categories.value = res.data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }
};

// 获取分类详情
const fetchCategoryDetail = async () => {
  try {
    const res = await categoryService.getCategory(Number(route.params.id));
    category.value = res.data;
  } catch (error) {
    console.error("Failed to fetch category:", error);
  }
};

// 获取分类商品
const fetchProducts = async () => {
  loading.value = true;
  try {
    const res = await productService.getProducts({
      categoryId: Number(route.params.id),
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

// 跳转到分类详情
const goToCategory = (id: number) => {
  router.push({ name: "category", params: { id: id.toString() } });
};

// 处理价格范围变化
const handlePriceChange = () => {
  currentPage.value = 1;
  fetchProducts();
};

// 处理排序方式变化
const handleSortChange = () => {
  currentPage.value = 1;
  fetchProducts();
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
      fetchCategoryDetail();
      fetchProducts();
    } else {
      fetchCategories();
    }
  }
);

onMounted(() => {
  if (route.params.id) {
    fetchCategoryDetail();
    fetchProducts();
  } else {
    fetchCategories();
  }
});
</script>

<style scoped>
.category {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.category-header {
  margin-bottom: 20px;
}

.category-header h1 {
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

.products {
  min-height: 400px;
}

.pagination {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}

.category-card {
  cursor: pointer;
  transition: transform 0.3s;
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.category-card:hover {
  transform: translateY(-5px);
}

.category-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.category-info {
  padding: 15px;
}

.category-info h3 {
  margin: 0 0 10px;
  font-size: 18px;
  color: var(--el-text-color-primary);
}

.category-info p {
  margin: 0;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .category {
    padding: 10px;
  }

  .category-header h1 {
    font-size: 20px;
  }

  .filter-item h3 {
    font-size: 14px;
  }

  .category-image {
    height: 100px;
  }

  .category-info h3 {
    font-size: 16px;
  }

  .category-info p {
    font-size: 12px;
  }
}
</style>
