<template>
  <div class="orders">
    <div class="orders-header">
      <h1>{{ $t("nav.orders") }}</h1>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">{{
          $t("nav.home")
        }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ $t("nav.orders") }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="orders-content" v-loading="loading">
      <!-- 订单筛选 -->
      <el-card class="filter-section">
        <el-form :inline="true" :model="filterForm">
          <el-form-item :label="$t('order.status')">
            <el-select v-model="filterForm.status" clearable>
              <el-option
                v-for="(value, key) in $t('order.orderStatus')"
                :key="key"
                :label="value"
                :value="key"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('order.dateRange')">
            <el-date-picker
              v-model="filterForm.dateRange"
              type="daterange"
              :start-placeholder="$t('common.startDate')"
              :end-placeholder="$t('common.endDate')"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              {{ $t("common.search") }}
            </el-button>
            <el-button @click="handleReset">
              {{ $t("common.reset") }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 订单列表 -->
      <el-card v-if="orders.length">
        <div v-for="order in orders" :key="order.id" class="order-item">
          <div class="order-header">
            <div class="order-info">
              <span class="order-id">{{ $t("order.id") }}: {{ order.id }}</span>
              <span class="order-date">
                {{ formatDate(order.createdAt) }}
              </span>
            </div>
            <el-tag :type="getStatusType(order.status)">
              {{ $t(`order.orderStatus.${order.status}`) }}
            </el-tag>
          </div>

          <div class="order-products">
            <div
              v-for="product in order.products"
              :key="product.id"
              class="product-item"
            >
              <el-image
                :src="product.image"
                :alt="product.name"
                class="product-image"
              />
              <div class="product-info">
                <div class="product-name">{{ product.name }}</div>
                <div class="product-specs" v-if="product.specs">
                  <span v-for="(value, key) in product.specs" :key="key">
                    {{ key }}: {{ value }}
                  </span>
                </div>
                <div class="product-price-qty">
                  <span class="price">¥{{ product.price.toFixed(2) }}</span>
                  <span class="quantity">× {{ product.quantity }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="order-footer">
            <div class="order-total">
              {{ $t("order.total") }}:
              <span class="total-price">¥{{ order.total.toFixed(2) }}</span>
            </div>
            <div class="order-actions">
              <el-button
                v-if="order.status === 'pending'"
                type="primary"
                @click="handlePay(order)"
              >
                {{ $t("order.pay") }}
              </el-button>
              <el-button
                v-if="order.status === 'pending'"
                type="danger"
                @click="handleCancel(order)"
              >
                {{ $t("order.cancel") }}
              </el-button>
              <el-button
                v-if="order.status === 'shipped'"
                type="success"
                @click="handleConfirm(order)"
              >
                {{ $t("order.confirm") }}
              </el-button>
              <el-button
                v-if="order.status === 'completed'"
                type="primary"
                @click="handleReview(order)"
              >
                {{ $t("order.review") }}
              </el-button>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 30, 50]"
            :total="total"
            layout="total, sizes, prev, pager, next"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>

      <el-empty v-else :description="$t('order.noOrders')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "@vue/runtime-core";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { ElMessage, ElMessageBox } from "element-plus";
import type { Order } from "@/types";

const router = useRouter();
const { t } = useI18n();

const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 订单状态列表
const orderStatuses = ["pending", "paid", "shipped", "completed", "cancelled"];

// 筛选表单
const filterForm = ref({
  status: "",
  dateRange: [] as string[],
});

// 订单列表（模拟数据）
const orders = ref<Order[]>([
  {
    id: "202401010001",
    products: [
      {
        id: 1,
        name: "商品1",
        price: 99.99,
        quantity: 1,
        image: "https://via.placeholder.com/100",
        specs: {
          颜色: "红色",
          尺寸: "M",
        },
      },
      {
        id: 2,
        name: "商品2",
        price: 199.99,
        quantity: 2,
        image: "https://via.placeholder.com/100",
      },
    ],
    total: 499.97,
    status: "pending",
    createdAt: "2024-01-01",
  },
]);

// 获取订单列表
const fetchOrders = async () => {
  loading.value = true;
  try {
    // TODO: 调用获取订单列表的 API
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        page: currentPage.value,
        pageSize: pageSize.value,
        status: filterForm.value.status,
        startDate: filterForm.value.dateRange[0],
        endDate: filterForm.value.dateRange[1],
      }),
    });
    const data = await response.json();
    orders.value = data.orders;
    total.value = data.total;
  } catch (error) {
    ElMessage.error("Failed to fetch orders");
  } finally {
    loading.value = false;
  }
};

// 处理筛选
const handleSearch = () => {
  currentPage.value = 1;
  fetchOrders();
};

// 重置筛选
const handleReset = () => {
  filterForm.value = {
    status: "",
    dateRange: [],
  };
  handleSearch();
};

// 处理页码变化
const handleCurrentChange = (page: number) => {
  fetchOrders();
};

// 处理每页数量变化
const handleSizeChange = (size: number) => {
  currentPage.value = 1;
  fetchOrders();
};

// 处理支付
const handlePay = async (order: Order) => {
  // TODO: 实现支付功能
  try {
    await fetch(`/api/orders/${order.id}/pay`, { method: "POST" });
    ElMessage.success("order.paySuccess");
    fetchOrders();
  } catch (error) {
    ElMessage.error("order.payFailed");
  }
};

// 处理取消
const handleCancel = async (order: Order) => {
  try {
    await ElMessageBox.confirm("order.cancelConfirm", "common.warning", {
      type: "warning",
    });
    await fetch(`/api/orders/${order.id}/cancel`, { method: "POST" });
    ElMessage.success("order.cancelSuccess");
    fetchOrders();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("order.cancelFailed");
    }
  }
};

// 处理确认收货
const handleConfirm = async (order: Order) => {
  try {
    await ElMessageBox.confirm(
      "order.confirmReceiptConfirm",
      "common.confirm",
      {
        type: "info",
      }
    );
    await fetch(`/api/orders/${order.id}/confirm`, { method: "POST" });
    ElMessage.success("order.confirmSuccess");
    fetchOrders();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("order.confirmFailed");
    }
  }
};

// 处理评价
const handleReview = (order: Order) => {
  // TODO: 实现评价功能，可能需要跳转到评价页面或打开评价对话框
};

// 获取订单状态对应的标签类型
const getStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: "warning",
    paid: "info",
    shipped: "primary",
    completed: "success",
    cancelled: "danger",
  };
  return statusMap[status] || "info";
};

// 格式化日期
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

onMounted(() => {
  fetchOrders();
});
</script>

<style scoped>
.orders {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.orders-header {
  margin-bottom: 20px;
}

.orders-header h1 {
  margin-bottom: 10px;
  font-size: 24px;
  color: #333;
}

.filter-section {
  margin-bottom: 20px;
}

.order-item {
  padding: 20px;
  border-bottom: 1px solid #ebeef5;
}

.order-item:last-child {
  border-bottom: none;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.order-info {
  display: flex;
  gap: 20px;
  color: #666;
}

.order-id {
  font-weight: 500;
}

.order-products {
  margin-bottom: 20px;
}

.product-item {
  display: flex;
  gap: 20px;
  padding: 10px 0;
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.product-info {
  flex: 1;
}

.product-name {
  margin-bottom: 8px;
  color: #333;
}

.product-specs {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.product-specs span {
  margin-right: 10px;
}

.product-price-qty {
  color: #666;
}

.price {
  color: #f56c6c;
  font-weight: 500;
  margin-right: 10px;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.total-price {
  color: #f56c6c;
  font-size: 20px;
  font-weight: 500;
  margin-left: 10px;
}

.order-actions {
  display: flex;
  gap: 10px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .orders {
    padding: 10px;
  }

  .orders-header h1 {
    font-size: 20px;
  }

  .order-header,
  .order-footer {
    flex-direction: column;
    gap: 10px;
  }

  .order-info {
    flex-direction: column;
    gap: 5px;
  }

  .product-item {
    flex-direction: column;
    text-align: center;
  }

  .product-image {
    margin: 0 auto;
  }

  .order-actions {
    width: 100%;
  }

  .order-actions .el-button {
    flex: 1;
  }
}
</style>
