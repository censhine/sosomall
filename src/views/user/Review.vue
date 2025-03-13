<template>
  <div class="review-container">
    <el-card class="review-card">
      <template #header>
        <div class="card-header">
          <h2>{{ $t("user.review.title") }}</h2>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="reviewForm"
        :rules="rules"
        label-width="120px"
        class="review-form"
      >
        <!-- 商品信息 -->
        <div class="product-info">
          <el-image :src="product.image" :alt="product.name" class="product-image" />
          <div class="product-details">
            <h3>{{ product.name }}</h3>
            <p class="specs" v-if="product.specs">
              <span v-for="(value, key) in product.specs" :key="key">
                {{ key }}: {{ value }}
              </span>
            </p>
          </div>
        </div>

        <!-- 评分 -->
        <el-form-item :label="$t('user.review.rating')" prop="rating">
          <el-rate
            v-model="reviewForm.rating"
            :texts="ratingTexts"
            show-text
          />
        </el-form-item>

        <!-- 评价内容 -->
        <el-form-item :label="$t('user.review.content')" prop="content">
          <el-input
            v-model="reviewForm.content"
            type="textarea"
            :rows="4"
            :placeholder="$t('user.review.contentPlaceholder')"
          />
        </el-form-item>

        <!-- 图片上传 -->
        <el-form-item :label="$t('user.review.images')">
          <el-upload
            v-model:file-list="fileList"
            action="/api/upload"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :before-upload="beforeUpload"
            :on-success="handleUploadSuccess"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>

          <el-dialog v-model="dialogVisible">
            <img w-full :src="dialogImageUrl" alt="Preview" />
          </el-dialog>
        </el-form-item>

        <!-- 标签选择 -->
        <el-form-item :label="$t('user.review.tags')">
          <el-checkbox-group v-model="reviewForm.tags">
            <el-checkbox
              v-for="tag in availableTags"
              :key="tag"
              :label="tag"
            >
              {{ $t(`user.review.tags.${tag}`) }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <!-- 匿名评价 -->
        <el-form-item>
          <el-checkbox v-model="reviewForm.anonymous">
            {{ $t('user.review.anonymous') }}
          </el-checkbox>
        </el-form-item>

        <!-- 提交按钮 -->
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">
            {{ $t('user.review.submit') }}
          </el-button>
          <el-button @click="handleCancel">{{ $t('common.cancel') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import type { UploadFile } from 'element-plus';
import type { OrderItem } from '@/types/order';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

// 表单数据
const reviewForm = ref({
  rating: 5,
  content: '',
  images: [] as string[],
  tags: [] as string[],
  anonymous: false
});

// 评分文案
const ratingTexts = [
  t('user.review.ratings.terrible'),
  t('user.review.ratings.bad'),
  t('user.review.ratings.normal'),
  t('user.review.ratings.good'),
  t('user.review.ratings.excellent')
];

// 可选标签
const availableTags = [
  'quality',
  'shipping',
  'service',
  'price',
  'packaging'
];

// 表单验证规则
const rules = {
  rating: [
    { required: true, message: t('user.review.validation.rating'), trigger: 'change' }
  ],
  content: [
    { required: true, message: t('user.review.validation.content'), trigger: 'blur' },
    { min: 10, message: t('user.review.validation.contentLength'), trigger: 'blur' }
  ]
};

// 图片上传相关
const fileList = ref<UploadFile[]>([]);
const dialogImageUrl = ref('');
const dialogVisible = ref(false);

// 商品信息
const product = ref<OrderItem>({
  id: '',
  productId: '',
  productName: '',
  price: 0,
  quantity: 0,
  image: ''
});

// 处理图片预览
const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!;
  dialogVisible.value = true;
};

// 处理图片移除
const handleRemove = (file: UploadFile) => {
  const index = reviewForm.value.images.indexOf(file.url!);
  if (index > -1) {
    reviewForm.value.images.splice(index, 1);
  }
};

// 上传前验证
const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/');
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isImage) {
    ElMessage.error(t('user.review.validation.imageType'));
    return false;
  }
  if (!isLt2M) {
    ElMessage.error(t('user.review.validation.imageSize'));
    return false;
  }
  return true;
};

// 上传成功回调
const handleUploadSuccess = (response: any, file: UploadFile) => {
  reviewForm.value.images.push(response.url);
};

// 提交评价
const handleSubmit = async () => {
  try {
    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        orderId: route.params.orderId,
        productId: product.value.productId,
        ...reviewForm.value
      })
    });

    if (response.ok) {
      ElMessage.success(t('user.review.success'));
      router.push('/user/orders');
    } else {
      throw new Error('Failed to submit review');
    }
  } catch (error) {
    ElMessage.error(t('user.review.error'));
  }
};

// 取消评价
const handleCancel = () => {
  router.back();
};

// 获取订单商品信息
const fetchOrderItem = async () => {
  try {
    const response = await fetch(`/api/orders/${route.params.orderId}/items/${route.params.itemId}`);
    const data = await response.json();
    product.value = data;
  } catch (error) {
    ElMessage.error(t('common.error.fetchFailed'));
    router.back();
  }
};

onMounted(() => {
  fetchOrderItem();
});
</script>

<style scoped lang="scss">
.review-container {
  max-width: 800px;
  margin: 20px auto;

  .review-card {
    .card-header {
      h2 {
        margin: 0;
        font-size: 20px;
      }
    }
  }

  .product-info {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    padding: 15px;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 4px;

    .product-image {
      width: 80px;
      height: 80px;
      object-fit: cover;
      margin-right: 15px;
    }

    .product-details {
      h3 {
        margin: 0 0 8px;
        font-size: 16px;
      }

      .specs {
        margin: 0;
        font-size: 13px;
        color: var(--el-text-color-secondary);

        span {
          margin-right: 10px;
        }
      }
    }
  }

  :deep(.el-upload--picture-card) {
    width: 100px;
    height: 100px;
    line-height: 100px;
  }

  :deep(.el-checkbox-group) {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
}
</style>