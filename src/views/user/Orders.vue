<template>
  <div class="orders-container">
    <el-card class="orders-card">
      <template #header>
        <div class="card-header">
          <span>{{ $t("user.orders.title") }}</span>
          <el-select v-model="orderStatus" class="status-filter">
            <el-option
              v-for="item in orderStatusOptions"
              :key="item.value"
              :label="$t(`user.orders.status.${item.label}`)"
              :value="item.value"
            />
          </el-select>
        </div>
      </template>

      <el-table v-loading="loading" :data="orders" style="width: 100%">
        <el-table-column
          prop="orderNumber"
          :label="$t('user.orders.orderNumber')"
          width="180"
        />
        <el-table-column
          prop="createTime"
          :label="$t('user.orders.createTime')"
          width="180"
        >
          <template #default="scope">
            {{ formatDate(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="totalAmount"
          :label="$t('user.orders.totalAmount')"
          width="120"
        >
          <template #default="scope">
            ¥{{ scope.row.totalAmount.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          :label="$t('user.orders.status.label')"
          width="120"
        >
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ $t(`user.orders.status.${scope.row.status}`) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('common.actions')"
          width="200"
          fixed="right"
        >
          <template #default="scope">
            <el-button
              v-if="scope.row.status === 'pending'"
              type="primary"
              size="small"
              @click="handlePay(scope.row)"
            >
              {{ $t("user.orders.actions.pay") }}
            </el-button>
            <el-button
              v-if="scope.row.status === 'pending'"
              type="danger"
              size="small"
              @click="handleCancel(scope.row)"
            >
              {{ $t("user.orders.actions.cancel") }}
            </el-button>
            <el-button
              v-if="scope.row.status === 'shipped'"
              type="success"
              size="small"
              @click="handleConfirm(scope.row)"
            >
              {{ $t("user.orders.actions.confirm") }}
            </el-button>
            <el-button
              v-if="scope.row.status === 'completed'"
              type="info"
              size="small"
              @click="handleReview(scope.row)"
            >
              {{ $t("user.orders.actions.review") }}
            </el-button>
            <el-button size="small" @click="handleDetails(scope.row)">
              {{ $t("user.orders.actions.details") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 订单详情对话框 -->
    <el-dialog
      v-model="detailsVisible"
      :title="$t('user.orders.details.title')"
      width="70%"
    >
      <el-descriptions v-if="currentOrder" :column="2" border>
        <el-descriptions-item :label="$t('user.orders.orderNumber')">
          {{ currentOrder.orderNumber }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('user.orders.createTime')">
          {{ formatDate(currentOrder.createTime) }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('user.orders.status.label')">
          <el-tag :type="getStatusType(currentOrder.status)">
            {{ $t(`user.orders.status.${currentOrder.status}`) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('user.orders.totalAmount')">
          ¥{{ currentOrder.totalAmount.toFixed(2) }}
        </el-descriptions-item>
      </el-descriptions>

      <el-table
        v-if="currentOrder"
        :data="currentOrder.items"
        style="margin-top: 20px"
      >
        <el-table-column
          prop="productName"
          :label="$t('user.orders.details.productName')"
        />
        <el-table-column
          prop="quantity"
          :label="$t('user.orders.details.quantity')"
          width="100"
        />
        <el-table-column
          prop="price"
          :label="$t('user.orders.details.price')"
          width="120"
        >
          <template #default="scope">
            ¥{{ scope.row.price.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('user.orders.details.subtotal')"
          width="120"
        >
          <template #default="scope">
            ¥{{ (scope.row.price * scope.row.quantity).toFixed(2) }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
import type { Order } from "@/types/order";

const { t } = useI18n();

// 状态和数据
const loading = ref(false);
const orders = ref<Order[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const orderStatus = ref("");
const detailsVisible = ref(false);
const currentOrder = ref<Order | null>(null);

// 订单状态选项
const orderStatusOptions = [
  { value: "", label: "all" },
  { value: "pending", label: "pending" },
  { value: "paid", label: "paid" },
  { value: "shipped", label: "shipped" },
  { value: "completed", label: "completed" },
  { value: "cancelled", label: "cancelled" },
];

// 获取订单列表
const fetchOrders = async () => {
  loading.value = true;
  try {
    const response = await fetch(
      `/api/orders?page=${currentPage.value}&pageSize=${pageSize.value}&status=${orderStatus.value}`
    );
    const data = await response.json();
    orders.value = data.items;
    total.value = data.total;
  } catch (error) {
    ElMessage.error(t("common.error.fetchFailed"));
  } finally {
    loading.value = false;
  }
};

// 格式化日期
const formatDate = (date: string) => {
  return new Date(date).toLocaleString();
};

// 获取状态标签类型
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

// 处理支付
const handlePay = async (order: Order) => {
  try {
    await fetch(`/api/orders/${order.id}/pay`, { method: "POST" });
    ElMessage.success(t("user.orders.messages.paySuccess"));
    fetchOrders();
  } catch (error) {
    ElMessage.error(t("user.orders.messages.payFailed"));
  }
};

// 处理取消
const handleCancel = async (order: Order) => {
  try {
    const confirmed = await ElMessageBox.confirm(
      t("user.orders.messages.cancelConfirm"),
      t("common.warning"),
      {
        confirmButtonText: t("common.confirm"),
        cancelButtonText: t("common.cancel"),
        type: "warning",
      }
    );
    if (confirmed) {
      await fetch(`/api/orders/${order.id}/cancel`, { method: "POST" });
      ElMessage.success(t("user.orders.messages.cancelSuccess"));
      fetchOrders();
    }
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error(t("user.orders.messages.cancelFailed"));
    }
  }
};

// 处理确认收货
const handleConfirm = async (order: Order) => {
  try {
    const confirmed = await ElMessageBox.confirm(
      t("user.orders.messages.confirmReceiptConfirm"),
      t("common.warning"),
      {
        confirmButtonText: t("common.confirm"),
        cancelButtonText: t("common.cancel"),
        type: "warning",
      }
    );
    if (confirmed) {
      await fetch(`/api/orders/${order.id}/confirm`, { method: "POST" });
      ElMessage.success(t("user.orders.messages.confirmReceiptSuccess"));
      fetchOrders();
    }
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error(t("user.orders.messages.confirmReceiptFailed"));
    }
  }
};

// 处理评价
const handleReview = (order: Order) => {
  // 实现评价逻辑
};

// 查看订单详情
const handleDetails = (order: Order) => {
  currentOrder.value = order;
  detailsVisible.value = true;
};

// 分页处理
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  fetchOrders();
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  fetchOrders();
};

// 监听状态变化
watch(orderStatus, () => {
  currentPage.value = 1;
  fetchOrders();
});

// 初始化
onMounted(() => {
  fetchOrders();
});
</script>

<style scoped lang="scss">
.orders-container {
  padding: 20px;

  .orders-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .status-filter {
      width: 150px;
    }
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
