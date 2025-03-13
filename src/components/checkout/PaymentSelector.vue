<template>
  <div class="payment-selector">
    <h3 class="text-lg font-semibold mb-4">{{ $t('checkout.payment.title') }}</h3>
    
    <div class="payment-methods grid gap-4">
      <div
        v-for="method in paymentMethods"
        :key="method.id"
        class="payment-method-item p-4 border rounded-lg cursor-pointer transition-all"
        :class="{
          'border-primary bg-primary/5': selectedMethod?.id === method.id,
          'border-gray-200 hover:border-primary/50': selectedMethod?.id !== method.id
        }"
        @click="selectMethod(method)"
      >
        <div class="flex items-center gap-3">
          <div class="payment-icon w-12 h-12 flex items-center justify-center">
            <img :src="method.icon" :alt="method.name" class="max-w-full max-h-full object-contain" />
          </div>
          
          <div class="payment-info flex-1">
            <h4 class="font-medium">{{ method.name }}</h4>
            <p class="text-sm text-gray-500">{{ method.description }}</p>
          </div>
          
          <div class="payment-check">
            <div
              class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
              :class="{
                'border-primary': selectedMethod?.id === method.id,
                'border-gray-300': selectedMethod?.id !== method.id
              }"
            >
              <div
                v-if="selectedMethod?.id === method.id"
                class="w-3 h-3 rounded-full bg-primary"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 支付方式说明 -->
    <div v-if="selectedMethod" class="payment-info mt-4 p-4 bg-gray-50 rounded-lg">
      <h4 class="font-medium mb-2">{{ $t('checkout.payment.instructions') }}</h4>
      <div class="text-sm text-gray-600">
        {{ selectedMethod.description }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getPaymentMethods } from '@/api/checkout'
import type { PaymentMethod } from '@/api/checkout'

const props = defineProps<{
  modelValue?: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const paymentMethods = ref<PaymentMethod[]>([])
const selectedMethod = ref<PaymentMethod | null>(null)

// 获取支付方式列表
const fetchPaymentMethods = async () => {
  try {
    const { data } = await getPaymentMethods()
    paymentMethods.value = data
    
    // 如果有默认选中的支付方式，设置选中状态
    if (props.modelValue) {
      const method = data.find(m => m.id === props.modelValue)
      if (method) {
        selectedMethod.value = method
      }
    }
  } catch (error) {
    console.error('Failed to fetch payment methods:', error)
  }
}

// 选择支付方式
const selectMethod = (method: PaymentMethod) => {
  selectedMethod.value = method
  emit('update:modelValue', method.id)
}

onMounted(() => {
  fetchPaymentMethods()
})
</script>

<style scoped>
.payment-selector {
  @apply w-full;
}

.payment-method-item {
  @apply relative;
}

.payment-method-item:hover {
  @apply shadow-sm;
}
</style>