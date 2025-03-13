<template>
  <div class="address-selector">
    <h3 class="text-lg font-semibold mb-4">{{ $t('checkout.address.title') }}</h3>
    
    <div class="address-list grid gap-4">
      <div
        v-for="address in addresses"
        :key="address.id"
        class="address-item p-4 border rounded-lg cursor-pointer transition-all"
        :class="{
          'border-primary bg-primary/5': selectedAddress?.id === address.id,
          'border-gray-200 hover:border-primary/50': selectedAddress?.id !== address.id
        }"
        @click="selectAddress(address)"
      >
        <div class="flex items-start gap-3">
          <div class="address-info flex-1">
            <div class="flex items-center gap-2 mb-1">
              <h4 class="font-medium">{{ address.name }}</h4>
              <span class="text-sm text-gray-500">{{ address.phone }}</span>
              <span
                v-if="address.isDefault"
                class="px-2 py-0.5 text-xs text-primary bg-primary/10 rounded"
              >{{ $t('checkout.address.default') }}</span>
            </div>
            <p class="text-sm text-gray-600">
              {{ formatAddress(address) }}
            </p>
          </div>
          
          <div class="address-actions flex items-center gap-2">
            <button
              class="p-2 text-gray-500 hover:text-primary transition-colors"
              @click.stop="editAddress(address)"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button
              v-if="!address.isDefault"
              class="p-2 text-gray-500 hover:text-primary transition-colors"
              @click.stop="deleteAddress(address.id)"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- 添加新地址按钮 -->
      <div
        class="add-address p-4 border border-dashed rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
        @click="showAddressForm()"
      >
        <i class="fas fa-plus text-primary"></i>
        <span class="text-primary">{{ $t('checkout.address.add') }}</span>
      </div>
    </div>

    <!-- 地址表单弹窗 -->
    <el-dialog
      v-model="showDialog"
      :title="editingAddress ? $t('checkout.address.edit') : $t('checkout.address.add')"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="addressForm"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item :label="$t('checkout.address.name')" prop="name">
          <el-input v-model="addressForm.name" />
        </el-form-item>
        
        <el-form-item :label="$t('checkout.address.phone')" prop="phone">
          <el-input v-model="addressForm.phone" />
        </el-form-item>
        
        <el-form-item :label="$t('checkout.address.region')" required>
          <el-cascader
            v-model="region"
            :options="regionOptions"
            :props="{
              value: 'code',
              label: 'name',
              children: 'children'
            }"
            @change="handleRegionChange"
          />
        </el-form-item>
        
        <el-form-item :label="$t('checkout.address.detail')" prop="address">
          <el-input
            v-model="addressForm.address"
            type="textarea"
            :rows="2"
          />
        </el-form-item>
        
        <el-form-item>
          <el-checkbox
            v-model="addressForm.isDefault"
          >{{ $t('checkout.address.setDefault') }}</el-checkbox>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showDialog = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="submitForm">{{ $t('common.confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getAddressList,
  addAddress,
  updateAddress,
  deleteAddress as removeAddress,
  setDefaultAddress
} from '@/api/checkout'
import type { Address } from '@/api/checkout'

const props = defineProps<{
  modelValue?: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const addresses = ref<Address[]>([])
const selectedAddress = ref<Address | null>(null)
const showDialog = ref(false)
const editingAddress = ref<Address | null>(null)
const region = ref<string[]>([])

// 表单相关
const formRef = ref()
const addressForm = ref({
  name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  address: '',
  isDefault: false
})

// 表单验证规则
const formRules = {
  name: [{ required: true, message: '请输入收货人姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
}

// 获取地址列表
const fetchAddresses = async () => {
  try {
    const { data } = await getAddressList()
    addresses.value = data
    
    // 如果有默认选中的地址，设置选中状态
    if (props.modelValue) {
      const address = data.find(a => a.id === props.modelValue)
      if (address) {
        selectedAddress.value = address
      }
    } else if (data.length > 0) {
      // 默认选中第一个地址
      selectedAddress.value = data[0]
      emit('update:modelValue', data[0].id)
    }
  } catch (error) {
    console.error('Failed to fetch addresses:', error)
  }
}

// 选择地址
const selectAddress = (address: Address) => {
  selectedAddress.value = address
  emit('update:modelValue', address.id)
}

// 格式化地址
const formatAddress = (address: Address) => {
  return `${address.province} ${address.city} ${address.district} ${address.address}`
}

// 显示地址表单
const showAddressForm = (address?: Address) => {
  if (address) {
    editingAddress.value = address
    addressForm.value = { ...address }
    region.value = [address.province, address.city, address.district]
  } else {
    editingAddress.value = null
    addressForm.value = {
      name: '',
      phone: '',
      province: '',
      city: '',
      district: '',
      address: '',
      isDefault: false
    }
    region.value = []
  }
  showDialog.value = true
}

// 处理地区选择变化
const handleRegionChange = (value: string[]) => {
  if (value.length === 3) {
    const [province, city, district] = value
    addressForm.value.province = province
    addressForm.value.city = city
    addressForm.value.district = district
  }
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        if (editingAddress.value) {
          // 更新地址
          await updateAddress(editingAddress.value.id, addressForm.value)
          ElMessage.success('地址更新成功')
        } else {
          // 添加新地址
          await addAddress(addressForm.value)
          ElMessage.success('地址添加成功')
        }
        
        // 刷新地址列表
        await fetchAddresses()
        showDialog.value = false
      } catch (error) {
        console.error('Failed to save address:', error)
        ElMessage.error('保存地址失败，请重试')
      }
    }
  })
}

// 删除地址
const deleteAddress = async (id: number) => {
  try {
    await removeAddress(id)
    ElMessage.success('地址删除成功')
    await fetchAddresses()
  } catch (error) {
    console.error('Failed to delete address:', error)
    ElMessage.error('删除地址失败，请重试')
  }
}

// 编辑地址
const editAddress = (address: Address) => {
  showAddressForm(address)
}

onMounted(() => {
  fetchAddresses()
})
</script>

<style scoped>
.address-selector {
  @apply w-full;
}

.address-item {
  @apply relative;
}

.address-item:hover {
  @apply shadow-sm;
}

.add-address {
  @apply min-h-[100px];
}
</style>