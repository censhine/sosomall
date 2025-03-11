<template>
  <div class="home-container">
    <!-- 轮播图 -->
    <div class="banner-section">
      <el-carousel height="400px" :interval="5000" arrow="hover">
        <el-carousel-item v-for="banner in banners" :key="banner.id">
          <el-image :src="banner.image" fit="cover" class="banner-image">
            <template #error>
              <div class="image-slot">
                <el-icon><Picture /></el-icon>
              </div>
            </template>
          </el-image>
          <div class="banner-content">
            <h2>{{ banner.title }}</h2>
            <el-button type="primary" @click="handleBannerClick(banner)">
              {{ $t("home.banner.viewMore") }}
            </el-button>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 商品分类 -->
    <div class="section categories-section">
      <div class="section-header">
        <h2>{{ $t("home.categories.title") }}</h2>
        <el-button text @click="$router.push('/categories')">
          {{ $t("common.viewAll") }}
          <el-icon class="el-icon--right"><ArrowRight /></el-icon>
        </el-button>
      </div>
      <el-row :gutter="20">
        <el-col
          v-for="category in categories"
          :key="category.id"
          :xs="12"
          :sm="8"
          :md="6"
          :lg="4"
        >
          <el-card
            shadow="hover"
            class="category-card"
            @click="handleCategoryClick(category)"
          >
            <div class="category-icon">
              <el-icon>
                <component :is="category.icon" />
              </el-icon>
            </div>
            <h3>{{ category.name }}</h3>
            <p>
              {{ category.productCount }} {{ $t("home.categories.products") }}
            </p>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 热门商品 -->
    <div class="section hot-products-section">
      <div class="section-header">
        <h2>{{ $t("home.hotProducts.title") }}</h2>
        <el-button text @click="$router.push('/products?sort=hot')">
          {{ $t("common.viewAll") }}
          <el-icon class="el-icon--right"><ArrowRight /></el-icon>
        </el-button>
      </div>
      <el-row :gutter="20">
        <el-col
          v-for="product in hotProducts"
          :key="product.id"
          :xs="12"
          :sm="8"
          :md="6"
          :lg="4"
        >
          <product-card :product="product" />
        </el-col>
      </el-row>
    </div>

    <!-- 新品上市 -->
    <div class="section new-products-section">
      <div class="section-header">
        <h2>{{ $t("home.newProducts.title") }}</h2>
        <el-button text @click="$router.push('/products?sort=new')">
          {{ $t("common.viewAll") }}
          <el-icon class="el-icon--right"><ArrowRight /></el-icon>
        </el-button>
      </div>
      <el-row :gutter="20">
        <el-col
          v-for="product in newProducts"
          :key="product.id"
          :xs="12"
          :sm="8"
          :md="6"
          :lg="3"
        >
          <product-card :product="product" />
        </el-col>
      </el-row>
    </div>

    <!-- 品牌展示 -->
    <div class="section brands-section">
      <div class="section-header">
        <h2>{{ $t("home.brands.title") }}</h2>
        <el-button text @click="$router.push('/brands')">
          {{ $t("common.viewAll") }}
          <el-icon class="el-icon--right"><ArrowRight /></el-icon>
        </el-button>
      </div>
      <el-row :gutter="20">
        <el-col
          v-for="brand in brands"
          :key="brand.id"
          :xs="12"
          :sm="8"
          :md="6"
          :lg="2.4"
        >
          <el-card
            shadow="hover"
            class="brand-card"
            @click="handleBrandClick(brand)"
          >
            <el-image :src="brand.logo" class="brand-logo" fit="contain">
              <template #error>
                <div class="image-slot">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
            <h3>{{ brand.name }}</h3>
            <p>{{ brand.productCount }} {{ $t("home.brands.products") }}</p>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { Picture, ArrowRight } from "@element-plus/icons-vue";
import { useI18n } from "vue-i18n";
import ProductCard from "@/components/ProductCard.vue";
import type { Banner, Product, Category, Brand } from "@/types/home";

const router = useRouter();
const { t } = useI18n();

// 数据状态
const banners = ref<Banner[]>([]);
const categories = ref<Category[]>([]);
const hotProducts = ref<Product[]>([]);
const newProducts = ref<Product[]>([]);
const brands = ref<Brand[]>([]);

// 获取轮播图数据
const fetchBanners = async () => {
  try {
    const response = await fetch("/api/banners");
    const data = await response.json();
    banners.value = data.items.slice(0, 5); // 只显示前5张
  } catch (error) {
    ElMessage.error(t("common.error.fetchFailed"));
  }
};

// 获取分类数据
const fetchCategories = async () => {
  try {
    const response = await fetch("/api/categories");
    const data = await response.json();
    categories.value = data.items.slice(0, 6); // 只显示前6个
  } catch (error) {
    ElMessage.error(t("common.error.fetchFailed"));
  }
};

// 获取热门商品
const fetchHotProducts = async () => {
  try {
    const response = await fetch("/api/products/hot");
    const data = await response.json();
    hotProducts.value = data.items.slice(0, 6); // 只显示前6个
  } catch (error) {
    ElMessage.error(t("common.error.fetchFailed"));
  }
};

// 获取新品
const fetchNewProducts = async () => {
  try {
    const response = await fetch("/api/products/new");
    const data = await response.json();
    newProducts.value = data.items.slice(0, 8); // 只显示前8个
  } catch (error) {
    ElMessage.error(t("common.error.fetchFailed"));
  }
};

// 获取品牌数据
const fetchBrands = async () => {
  try {
    const response = await fetch("/api/brands");
    const data = await response.json();
    brands.value = data.items.slice(0, 10); // 只显示前10个
  } catch (error) {
    ElMessage.error(t("common.error.fetchFailed"));
  }
};

// 点击处理函数
const handleBannerClick = (banner: Banner) => {
  if (banner.link) {
    router.push(banner.link);
  }
};

const handleCategoryClick = (category: Category) => {
  router.push(`/products?category=${category.id}`);
};

const handleBrandClick = (brand: Brand) => {
  router.push(`/products?brand=${brand.id}`);
};

// 初始化
onMounted(() => {
  fetchBanners();
  fetchCategories();
  fetchHotProducts();
  fetchNewProducts();
  fetchBrands();
});
</script>

<style scoped lang="scss">
.home-container {
  .banner-section {
    margin-bottom: 40px;

    .banner-image {
      width: 100%;
      height: 100%;
    }

    .banner-content {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      color: #fff;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);

      h2 {
        margin-bottom: 20px;
        font-size: 32px;
      }
    }
  }

  .section {
    margin-bottom: 40px;

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      h2 {
        margin: 0;
        font-size: 24px;
        color: var(--el-text-color-primary);
      }
    }
  }

  .category-card {
    cursor: pointer;
    text-align: center;
    padding: 20px;
    transition: transform 0.3s;

    &:hover {
      transform: translateY(-5px);
    }

    .category-icon {
      font-size: 40px;
      color: var(--el-color-primary);
      margin-bottom: 12px;
    }

    h3 {
      margin: 0 0 8px;
      font-size: 16px;
      color: var(--el-text-color-primary);
    }

    p {
      margin: 0;
      color: var(--el-text-color-secondary);
      font-size: 14px;
    }
  }

  .brand-card {
    cursor: pointer;
    text-align: center;
    padding: 20px;
    transition: transform 0.3s;

    &:hover {
      transform: translateY(-5px);
    }

    .brand-logo {
      width: 120px;
      height: 60px;
      margin-bottom: 12px;
    }

    h3 {
      margin: 0 0 8px;
      font-size: 16px;
      color: var(--el-text-color-primary);
    }

    p {
      margin: 0;
      color: var(--el-text-color-secondary);
      font-size: 14px;
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
