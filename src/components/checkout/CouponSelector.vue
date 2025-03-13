<template>
  <div class="coupon-selector">
    <div class="coupon-header">
      <h3>{{ $t('checkout.coupon') }}</h3>
      <el-button link @click="showCouponList = true">
        {{ hasCoupon ? $t('checkout.changeCoupon') : $t('checkout.selectCoupon') }}
      </el-button>
    </div>

    <div v-if="hasCoupon" class="selected-coupon">
      <div class="coupon-info">
        <span class="coupon-value">
          {{ selectedCoupon.type === 'percentage' ? `${selectedCoupon.value}%` : `¥${selectedCoupon.value}` }}
        </span>
        <span class="coupon-desc">{{ selectedCoupon.description }}</span>
      </div>
      <div class="coupon-validity">
        {{ $t('checkout.validUntil') }}: {{ formatDate(selectedCoupon.endDate) }}
      </div>
    </div>

    <el-dialog
      v-model="showCouponList"
      :title="$t('checkout.selectCoupon')"
      width="80%"
      class="coupon-dialog"
    >
      <div class="coupon-input">
        <el-input
          v-model="couponCode"
          :placeholder="$t('checkout.enterCouponCode')"
          clearable
        >
          <template #append>
            <el-button @click="claimCoupon">{{ $t('checkout.claim') }}</el-button>
          </template>
        </el-input>
      </div>

      <div class="coupon-list">
        <div
          v-for="coupon in availableCoupons"
          :key="coupon.id"
          class="coupon-item"
          :class="{ 'selected': selectedCouponId === coupon.id }"
          @click="selectCoupon(coupon)"
        >
          <div class="coupon-value">
            {{ coupon.type === 'percentage' ? `${coupon.value}%` : `¥${coupon.value}` }}
          </div>
          <div class="coupon-content">
            <div class="coupon-desc">{{ coupon.description }}</div>
            <div class="coupon-condition" v-if="coupon.minAmount">
              {{ $t('checkout.minAmount') }}: ¥{{ coupon.minAmount }}
            </div>
            <div class="coupon-validity">
              {{ $t('checkout.validUntil') }}: {{ formatDate(coupon.endDate) }}
            </div>
          </div>
        </div>

        <div v-if="availableCoupons.length === 0" class="no-coupons">
          {{ $t('checkout.noCoupons') }}
        </div>
      </div>

      <template #footer>
        <el-button @click="showCouponList = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="confirmCouponSelection">
          {{ $t('common.confirm') }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { getUserCoupons, claimCoupon as claimCouponApi, checkCoupon } from '@/api/user'
import type { Coupon } from '@/api/user'

const props = defineProps<{
  orderAmount: number
}>()

const emit = defineEmits<{
  (e: 'update:coupon', coupon: Coupon | null): void
}>()

const showCouponList = ref(false)
const couponCode = ref('')
const coupons = ref<Coupon[]>([])
const selectedCouponId = ref<number | null>(null)

const availableCoupons = computed(() => {
  return coupons.value.filter(coupon => 
    !coupon.used && 
    new Date(coupon.endDate) > new Date() &&
    (!coupon.minAmount || props.orderAmount >= coupon.minAmount)
  )
})

const selectedCoupon = computed(() => 
  availableCoupons.value.find(coupon => coupon.id === selectedCouponId.value)
)

const hasCoupon = computed(() => !!selectedCoupon.value)

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const loadCoupons = async () => {
  try {
    const { data } = await getUserCoupons('unused')
    coupons.value = data
  } catch (error) {
    ElMessage.error('Failed to load coupons')
  }
}

const claimCoupon = async () => {
  if (!couponCode.value) return

  try {
    const { data } = await claimCouponApi(couponCode.value)
    coupons.value.push(data)
    couponCode.value = ''
    ElMessage.success('Coupon claimed successfully')
  } catch (error) {
    ElMessage.error('Failed to claim coupon')
  }
}

const selectCoupon = (coupon: Coupon) => {
  selectedCouponId.value = coupon.id
}

const confirmCouponSelection = () => {
  emit('update:coupon', selectedCoupon.value || null)
  showCouponList.value = false
}

// 初始加载优惠券
loadCoupons()
</script>

<style scoped>
.coupon-selector {
  margin: 16px 0;
  padding: 16px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
}

.coupon-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.coupon-header h3 {
  margin: 0;
  font-size: 16px;
}

.selected-coupon {
  padding: 12px;
  background-color: var(--el-color-success-light-9);
  border-radius: 4px;
}

.coupon-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.coupon-value {
  font-size: 20px;
  font-weight: bold;
  color: var(--el-color-danger);
}

.coupon-desc {
  color: var(--el-text-color-regular);
}

.coupon-validity {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.coupon-input {
  margin-bottom: 20px;
}

.coupon-list {
  max-height: 400px;
  overflow-y: auto;
}

.coupon-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.coupon-item:hover {
  border-color: var(--el-color-primary);
}

.coupon-item.selected {
  border-color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
}

.coupon-content {
  flex: 1;
}

.coupon-condition {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin: 4px 0;
}

.no-coupons {
  text-align: center;
  color: var(--el-text-color-secondary);
  padding: 20px;
}

.coupon-dialog :deep(.el-dialog__body) {
  padding-top: 20px;
}
</style>