<template>
  <div class="favorites-container">
    <el-card class="favorites-card">
      <template #header>
        <div class="card-header">
          <span>{{ $t("user.favorites.title") }}</span>
          <el-select v-model="filterType" class="type-filter">
            <el-option
              v-for="item in filterOptions"
              :key="item.value"
              :label="$t(`user.favorites.types.${item.label}`)"
              :value="item.value"
            />
          </el-select>
        </div>
      </template>

      <el-row v-loading="loading" :gutter="20">
        <el-col
          v-for="item in favorites"
          :key="item.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
          class="favorite-item"
        >
          <el-card :body-style="{ padding: '0px' }">
            <el-image
              :src="item.image"
              :alt="item.name"
              class="item-image"
              fit="cover"
            />
            <div class="item-content">
              <h3 class="item-name" :title="item.name">{{ item.name }}</h3>
              <div class="item-price">
                <span class="current-price">¥{{ item.price.toFixed(2) }}</span>
                <span v-if="item.originalPrice" class="original-price">
                  ¥{{ item.originalPrice.toFixed(2) }}
                </span>
              </div>
              <div class="item-actions">
                <el-button
                  type="primary"
                  size="small"
                  @click="handleAddToCart(item)"
                >
                  {{ $t("user.favorites.actions.addToCart") }}
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  @click="handleRemove(item)"
                >
                  {{ $t("user.favorites.actions.remove") }}
                </el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <div v-if="!loading && favorites.length === 0" class="empty-state">
        <el-empty :description="$t('user.favorites.empty')" />
      </div>

      <div v-if="favorites.length > 0" class="pagination-container">
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
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
import type { FavoriteItem } from "@/types/favorite";

const { t } = useI18n();

// 状态
const loading = ref(false);
const favorites = ref<FavoriteItem[]>([]);
const currentPage = ref(1);
const pageSize = ref(12);
const total = ref(0);
const filterType = ref("");

// 筛选选项
const filterOptions = [
  { value: "", label: "all" },
  { value: "product", label: "product" },
  { value: "store", label: "store" },
  { value: "brand", label: "brand" },
];

// 获取收藏列表
const fetchFavorites = async () => {
  loading.value = true;
  try {
    const response = await fetch(
      `/api/favorites?page=${currentPage.value}&pageSize=${pageSize.value}&type=${filterType.value}`
    );
    const data = await response.json();
    favorites.value = data.items;
    total.value = data.total;
  } catch (error) {
    ElMessage.error(t("common.error.fetchFailed"));
  } finally {
    loading.value = false;
  }
};

// 添加到购物车
const handleAddToCart = async (item: FavoriteItem) => {
  try {
    await fetch("/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: item.id,
        quantity: 1,
      }),
    });
    ElMessage.success(t("user.favorites.messages.addToCartSuccess"));
  } catch (error) {
    ElMessage.error(t("user.favorites.messages.addToCartFailed"));
  }
};

// 移除收藏
const handleRemove = async (item: FavoriteItem) => {
  try {
    const confirmed = await ElMessageBox.confirm(
      t("user.favorites.messages.removeConfirm"),
      t("common.warning"),
      {
        confirmButtonText: t("common.confirm"),
        cancelButtonText: t("common.cancel"),
        type: "warning",
      }
    );
    if (confirmed) {
      await fetch(`/api/favorites/${item.id}`, {
        method: "DELETE",
      });
      ElMessage.success(t("user.favorites.messages.removeSuccess"));
      fetchFavorites();
    }
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error(t("user.favorites.messages.removeFailed"));
    }
  }
};

// 分页处理
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  fetchFavorites();
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  fetchFavorites();
};

// 监听筛选变化
watch(filterType, () => {
  currentPage.value = 1;
  fetchFavorites();
});

// 初始化
onMounted(() => {
  fetchFavorites();
});
</script>

<style scoped lang="scss">
.favorites-container {
  padding: 20px;

  .favorites-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .type-filter {
      width: 150px;
    }
  }

  .favorite-item {
    margin-bottom: 20px;

    .item-image {
      width: 100%;
      height: 200px;
      display: block;
    }

    .item-content {
      padding: 14px;

      .item-name {
        margin: 0;
        font-size: 14px;
        color: #333;
        line-height: 1.4;
        height: 40px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .item-price {
        margin: 8px 0;

        .current-price {
          color: var(--el-color-danger);
          font-size: 16px;
          font-weight: bold;
          margin-right: 8px;
        }

        .original-price {
          color: #999;
          font-size: 12px;
          text-decoration: line-through;
        }
      }

      .item-actions {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
      }
    }
  }

  .empty-state {
    padding: 40px 0;
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
