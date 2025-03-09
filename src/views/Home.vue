<template>
  <div class="home">
    <!-- 轮播图部分 -->
    <el-carousel height="400px">
      <el-carousel-item v-for="banner in banners" :key="banner.id">
        <img :src="banner.image" :alt="banner.title" class="banner-image" />
      </el-carousel-item>
    </el-carousel>

    <!-- 热卖商品 -->
    <section class="hot-products">
      <h2>{{ $t("home.hotProducts") }}</h2>
      <el-row :gutter="20">
        <el-col
          :xs="12"
          :sm="8"
          :md="6"
          :lg="4"
          v-for="product in hotProducts"
          :key="product.id"
        >
          <product-card :product="product" />
        </el-col>
      </el-row>
    </section>

    <!-- 新品上架 -->
    <section class="new-products">
      <h2>{{ $t("home.newProducts") }}</h2>
      <el-row :gutter="20">
        <el-col
          :xs="12"
          :sm="8"
          :md="6"
          :lg="4"
          v-for="product in newProducts"
          :key="product.id"
        >
          <product-card :product="product" />
        </el-col>
      </el-row>
    </section>

    <!-- 商品分类 -->
    <section class="product-categories">
      <h2>{{ $t("home.categories") }}</h2>
      <el-row :gutter="20">
        <el-col
          :xs="12"
          :sm="8"
          :md="6"
          v-for="category in categories"
          :key="category.id"
        >
          <el-card
            class="category-card"
            :body-style="{ padding: '0px' }"
            @click="goToCategory(category.id)"
          >
            <img
              :src="category.image"
              :alt="category.name"
              class="category-image"
            />
            <div class="category-info">
              <h3>{{ category.name }}</h3>
              <p>{{ category.description }}</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <!-- 品牌展示 -->
    <section class="brands">
      <h2>{{ $t("home.brands") }}</h2>
      <el-row :gutter="20">
        <el-col :xs="8" :sm="6" :md="4" v-for="brand in brands" :key="brand.id">
          <el-card
            class="brand-card"
            :body-style="{ padding: '10px' }"
            @click="goToBrand(brand.id)"
          >
            <img :src="brand.logo" :alt="brand.name" class="brand-logo" />
          </el-card>
        </el-col>
      </el-row>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "@vue/runtime-core";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import ProductCard from "@/components/ProductCard.vue";
import { getMockImage, getMockImages } from "@/utils/mockImages";
import {
  getBannersMock as getBanners,
  getHotProductsMock as getHotProducts,
  getNewProductsMock as getNewProducts,
  getCategoriesMock as getCategories,
  getBrandsMock as getBrands,
} from "@/api/home";

interface Banner {
  id: number;
  title: string;
  image: string;
  link: string;
}

interface ApiProduct {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  description?: string;
  stock?: number;
  sales?: number;
  rating: number;
  specs?: {
    Color: string;
    Size: string;
  };
  categoryId?: number;
  brandId?: number;
}

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  description: string;
  images: string[];
  stock: number;
  sales: number;
  rating: number;
  specs: {
    Color: string;
    Size: string;
  };
  categoryId: number;
  brandId: number;
}

interface Category {
  id: number;
  name: string;
  image: string;
  description: string;
}

interface Brand {
  id: number;
  name: string;
  logo: string;
}

const router = useRouter();
const { t } = useI18n();

const banners = ref<Banner[]>([]);
const hotProducts = ref<Product[]>([]);
const newProducts = ref<Product[]>([]);
const categories = ref<Category[]>([]);
const brands = ref<Brand[]>([]);

// 获取轮播图数据
const fetchBanners = async () => {
  try {
    const res = await getBanners();
    banners.value = res.data.map((banner) => ({
      ...banner,
      image: getMockImage("banner", `banner_${banner.id}`),
    }));
  } catch (error) {
    console.error("Failed to fetch banners:", error);
  }
};

// 获取热卖商品
const fetchHotProducts = async () => {
  try {
    const res = await getHotProducts();
    // 显示前12个热卖商品
    hotProducts.value = res.data.slice(0, 12).map((product: ApiProduct) => ({
      id: product.id,
      name: product.name,
      image: getMockImage("product", `product_${product.id}`),
      price: product.price,
      originalPrice: product.originalPrice || product.price * 1.2,
      description: product.description || `Description for ${product.name}`,
      images: getMockImages("product", 4, `product_${product.id}`),
      stock: product.stock || 100,
      sales: product.sales || Math.floor(Math.random() * 1000),
      rating: product.rating,
      specs: product.specs || {
        Color: ["Red", "Blue", "Black"][Math.floor(Math.random() * 3)],
        Size: ["S", "M", "L", "XL"][Math.floor(Math.random() * 4)],
      },
      categoryId: product.categoryId || Math.floor(Math.random() * 10) + 1,
      brandId: product.brandId || Math.floor(Math.random() * 10) + 1,
    }));
  } catch (error) {
    console.error("Failed to fetch hot products:", error);
  }
};

// 获取新品上架
const fetchNewProducts = async () => {
  try {
    const res = await getNewProducts();
    // 显示前12个新品
    newProducts.value = res.data.slice(0, 12).map((product: ApiProduct) => ({
      id: product.id,
      name: product.name,
      image: getMockImage("product", `product_${product.id}`),
      price: product.price,
      originalPrice: product.originalPrice || product.price * 1.2,
      description: product.description || `Description for ${product.name}`,
      images: getMockImages("product", 4, `product_${product.id}`),
      stock: product.stock || 100,
      sales: product.sales || Math.floor(Math.random() * 1000),
      rating: product.rating,
      specs: product.specs || {
        Color: ["Red", "Blue", "Black"][Math.floor(Math.random() * 3)],
        Size: ["S", "M", "L", "XL"][Math.floor(Math.random() * 4)],
      },
      categoryId: product.categoryId || Math.floor(Math.random() * 10) + 1,
      brandId: product.brandId || Math.floor(Math.random() * 10) + 1,
    }));
  } catch (error) {
    console.error("Failed to fetch new products:", error);
  }
};

// 获取商品分类
const fetchCategories = async () => {
  try {
    const res = await getCategories();
    categories.value = res.data.map((category) => ({
      ...category,
      image: getMockImage("product", `category_${category.id}`),
    }));
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }
};

// 获取品牌数据
const fetchBrands = async () => {
  try {
    const res = await getBrands();
    brands.value = res.data.map((brand) => ({
      ...brand,
      logo: getMockImage("logo", `brand_${brand.id}`),
    }));
  } catch (error) {
    console.error("Failed to fetch brands:", error);
  }
};

// 跳转到分类页面
const goToCategory = (id: number) => {
  router.push(`/category/${id}`);
};

// 跳转到品牌页面
const goToBrand = (id: number) => {
  router.push(`/brand/${id}`);
};

onMounted(() => {
  fetchBanners();
  fetchHotProducts();
  fetchNewProducts();
  fetchCategories();
  fetchBrands();
});
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.el-carousel {
  margin-bottom: 40px;
  border-radius: 8px;
  overflow: hidden;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

section {
  margin: 40px 0;
}

h2 {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
  color: var(--el-text-color-primary);
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

.brand-logo {
  width: 100%;
  height: 60px;
  object-fit: contain;
}

@media (max-width: 768px) {
  .el-carousel {
    height: 200px;
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

  h2 {
    font-size: 20px;
  }
}
</style>
