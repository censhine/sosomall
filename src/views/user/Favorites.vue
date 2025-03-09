<template>
  <el-card class="favorites-card">
    <template #header>
      <div class="card-header">
        <h2>{{ $t("user.favorites") }}</h2>
        <el-button
          v-if="selectedItems.length > 0"
          type="danger"
          @click="handleBatchDelete"
        >
          {{ $t("common.delete") }} ({{ selectedItems.length }})
        </el-button>
      </div>
    </template>

    <div v-loading="loading" class="favorites-list">
      <el-empty
        v-if="!loading && favorites.length === 0"
        :description="$t('favorites.empty')"
      />

      <el-table
        v-else
        ref="tableRef"
        :data="favorites"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <!-- 选择列 -->
        <el-table-column type="selection" width="55" />

        <!-- 商品信息列 -->
        <el-table-column :label="$t('product.title')" min-width="400">
          <template #default="{ row }">
            <div class="product-info">
              <el-image
                :src="row.image"
                :alt="row.name"
                class="product-image"
                @click="handleProductClick(row)"
              />
              <div class="product-details">
                <h3 class="product-name" @click="handleProductClick(row)">
                  {{ row.name }}
                </h3>
                <p class="product-price">
                  ¥{{ row.price }}
                  <span v-if="row.originalPrice" class="original-price">
                    ¥{{ row.originalPrice }}
                  </span>
                </p>
              </div>
            </div>
          </template>
        </el-table-column>

        <!-- 库存列 -->
        <el-table-column :label="$t('product.stock')" width="120">
          <template #default="{ row }">
            <span :class="{ 'low-stock': row.stock < 10 }">
              {{ row.stock }}
            </span>
          </template>
        </el-table-column>

        <!-- 操作列 -->
        <el-table-column
          :label="$t('common.actions')"
          width="200"
          fixed="right"
        >
          <template #default="{ row }">
            <el-button-group>
              <el-button type="primary" @click="handleAddToCart(row)">
                {{ $t("product.addToCart") }}
              </el-button>
              <el-button type="danger" @click="handleDelete(row)">
                {{ $t("common.delete") }}
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from "@vue/runtime-core";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import type { Product } from "@/types";

const router = useRouter();

// 状态变量
const loading = ref(false);
const favorites = ref<Product[]>([]);
const selectedItems = ref<Product[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 获取收藏列表
const fetchFavorites = async () => {
  loading.value = true;
  try {
    const response = await fetch("/api/favorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        page: currentPage.value,
        pageSize: pageSize.value,
      }),
    });
    const data = await response.json();
    favorites.value = data.items;
    total.value = data.total;
  } catch (error) {
    ElMessage.error("Failed to fetch favorites");
  } finally {
    loading.value = false;
  }
};

// 处理选择变化
const handleSelectionChange = (items: Product[]) => {
  selectedItems.value = items;
};

// 处理商品点击
const handleProductClick = (product: Product) => {
  router.push(`/products/${product.id}`);
};

// 添加到购物车
const handleAddToCart = async (product: Product) => {
  try {
    await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: product.id,
        quantity: 1,
      }),
    });
    ElMessage.success("cart.addSuccess");
  } catch (error) {
    ElMessage.error("Failed to add to cart");
  }
};

// 删除单个收藏
const handleDelete = async (product: Product) => {
  try {
    await ElMessageBox.confirm("common.deleteConfirm", "common.warning", {
      type: "warning",
    });
    await fetch(`/api/favorites/${product.id}`, { method: "DELETE" });
    ElMessage.success("Removed from favorites");
    fetchFavorites();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("Failed to remove from favorites");
    }
  }
};

// 批量删除
const handleBatchDelete = async () => {
  if (selectedItems.value.length === 0) return;

  try {
    await ElMessageBox.confirm("common.deleteConfirm", "common.warning", {
      type: "warning",
    });
    await fetch("/api/favorites/batch", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ids: selectedItems.value.map((item) => item.id),
      }),
    });
    ElMessage.success("Removed from favorites");
    fetchFavorites();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("Failed to remove from favorites");
    }
  }
};

// 分页处理
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  currentPage.value = 1;
  fetchFavorites();
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  fetchFavorites();
};

onMounted(() => {
  fetchFavorites();
});
</script>

<style scoped>
.favorites-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
}

.product-details {
  flex: 1;
}

.product-name {
  margin: 0 0 8px;
  font-size: 14px;
  cursor: pointer;
  color: var(--el-text-color-primary);
}

.product-name:hover {
  color: var(--el-color-primary);
}

.product-price {
  margin: 0;
  color: var(--el-color-danger);
  font-size: 16px;
  font-weight: bold;
}

.original-price {
  margin-left: 8px;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  text-decoration: line-through;
  font-weight: normal;
}

.low-stock {
  color: var(--el-color-danger);
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
