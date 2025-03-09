<template>
  <el-card
    class="product-card"
    :body-style="{ padding: '0' }"
    @click="goToProduct(product.id)"
  >
    <div class="product-image">
      <el-image :src="product.image" :alt="product.name" />
      <div class="discount" v-if="product.discount">
        -{{ product.discount }}%
      </div>
    </div>
    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <div class="product-price">
        <span class="current-price">¥{{ product.price.toFixed(2) }}</span>
        <span class="original-price" v-if="product.originalPrice">
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
        <span class="sales">{{ product.sales }}+ sold</span>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { defineProps } from "vue";
import { useRouter } from "vue-router";
import type { Product } from "@/api/types";

interface Props {
  product: Product;
}

const props = defineProps<Props>();
const userStore = useUserStore();
const router = useRouter();

const addToCart = () => {
  userStore.addToCart(props.product);
};

const goToProduct = (id: number) => {
  router.push(`/product/${id}`);
};
</script>

<style scoped>
.product-card {
  cursor: pointer;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  margin-bottom: 20px;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.product-image {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 100%;
}

.product-image .el-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.discount {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #f56c6c;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.product-info {
  padding: 14px;
}

.product-name {
  margin: 0 0 10px;
  font-size: 14px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
  height: 2.8em;
}

.product-price {
  margin-bottom: 10px;
}

.current-price {
  color: #f56c6c;
  font-size: 18px;
  font-weight: bold;
  margin-right: 8px;
}

.original-price {
  color: #999;
  font-size: 14px;
  text-decoration: line-through;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #999;
}

.sales {
  margin-left: 8px;
}

@media (max-width: 768px) {
  .product-name {
    font-size: 12px;
  }

  .current-price {
    font-size: 16px;
  }

  .original-price {
    font-size: 12px;
  }
}
</style>
