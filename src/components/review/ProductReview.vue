<template>
  <div class="product-review">
    <h3 class="text-lg font-semibold mb-4">{{ $t('review.title') }}</h3>

    <!-- 评价统计 -->
    <div class="review-stats p-4 bg-gray-50 rounded-lg mb-6">
      <div class="flex items-center gap-8">
        <div class="rating-overview">
          <div class="text-3xl font-bold text-primary mb-1">{{ stats.averageRating.toFixed(1) }}</div>
          <div class="flex items-center gap-1">
            <el-rate v-model="stats.averageRating" disabled />
            <span class="text-sm text-gray-500">({{ stats.totalReviews }})</span>
          </div>
        </div>

        <div class="rating-distribution flex-1">
          <div v-for="i in 5" :key="i" class="flex items-center gap-2 mb-1">
            <span class="text-sm">{{ i }}星</span>
            <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                class="h-full bg-primary"
                :style="{
                  width: `${(stats.ratingDistribution[i] / stats.totalReviews) * 100}%`
                }"
              ></div>
            </div>
            <span class="text-sm text-gray-500">{{ stats.ratingDistribution[i] || 0 }}</span>
          </div>
        </div>

        <div class="review-filters">
          <div class="flex flex-col gap-2">
            <el-button
              :class="{ 'is-active': filters.hasImages }"
              @click="toggleFilter('hasImages')"
            >
              <i class="fas fa-image mr-2"></i>
              {{ $t('review.withImages') }} ({{ stats.withImages }})
            </el-button>
            <el-button
              :class="{ 'is-active': filters.hasReplies }"
              @click="toggleFilter('hasReplies')"
            >
              <i class="fas fa-comment mr-2"></i>
              {{ $t('review.withReplies') }} ({{ stats.withReplies }})
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 评价列表 -->
    <div class="review-list space-y-6">
      <div
        v-for="review in reviews"
        :key="review.id"
        class="review-item p-4 border rounded-lg"
      >
        <div class="flex items-start gap-4">
          <el-avatar :src="review.user.avatar" :size="40" />
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <span class="font-medium">{{ review.user.name }}</span>
              <el-rate v-model="review.rating" disabled />
              <span class="text-sm text-gray-500">{{ formatDate(review.createdAt) }}</span>
            </div>

            <p class="text-gray-700 mb-4">{{ review.content }}</p>

            <!-- 评价图片 -->
            <div v-if="review.images?.length" class="review-images grid grid-cols-5 gap-2 mb-4">
              <div
                v-for="(image, index) in review.images"
                :key="index"
                class="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
                @click="previewImage(review.images, index)"
              >
                <img :src="image" class="w-full h-full object-cover" />
              </div>
            </div>

            <!-- 商家回复 -->
            <div
              v-if="review.replies?.length"
              class="review-replies bg-gray-50 p-3 rounded-lg mb-4"
            >
              <div
                v-for="reply in review.replies"
                :key="reply.id"
                class="reply-item mb-2 last:mb-0"
              >
                <div class="flex items-start gap-2">
                  <el-avatar :src="reply.user.avatar" :size="24" />
                  <div class="flex-1">
                    <div class="flex items-center gap-1 mb-1">
                      <span class="text-sm font-medium">{{ reply.user.name }}</span>
                      <span
                        v-if="reply.user.isSeller"
                        class="text-xs text-primary bg-primary/10 px-1 rounded"
                      >{{ $t('review.seller') }}</span>
                    </div>
                    <p class="text-sm text-gray-600">{{ reply.content }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 评价操作 -->
            <div class="review-actions flex items-center gap-4 text-sm text-gray-500">
              <button
                class="flex items-center gap-1 hover:text-primary transition-colors"
                @click="toggleHelpful(review.id, 'helpful')"
              >
                <i
                  class="fas"
                  :class="{
                    'fa-thumbs-up': review.helpful?.userVote !== 'helpful',
                    'fa-thumbs-up text-primary': review.helpful?.userVote === 'helpful'
                  }"
                ></i>
                {{ review.helpful?.helpful || 0 }}
              </button>
              <button
                class="flex items-center gap-1 hover:text-primary transition-colors"
                @click="toggleHelpful(review.id, 'unhelpful')"
              >
                <i
                  class="fas"
                  :class="{
                    'fa-thumbs-down': review.helpful?.userVote !== 'unhelpful',
                    'fa-thumbs-down text-primary': review.helpful?.userVote === 'unhelpful'
                  }"
                ></i>
                {{ review.helpful?.unhelpful || 0 }}
              </button>
              <button
                class="hover:text-primary transition-colors"
                @click="showReplyForm(review.id)"
              >
                <i class="fas fa-reply mr-1"></i>
                {{ $t('review.reply') }}
              </button>
              <button
                class="hover:text-primary transition-colors"
                @click="showReportDialog(review.id)"
              >
                <i class="fas fa-flag mr-1"></i>
                {{ $t('review.report') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="flex justify-center mt-6">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        @current-change="handlePageChange"
      />
    </div>

    <!-- 回复弹窗 -->
    <el-dialog
      v-model="showReplyDialog"
      :title="$t('review.replyTitle')"
      width="500px"
    >
      <el-form :model="replyForm">
        <el-form-item :label="$t('review.content')">
          <el-input
            v-model="replyForm.content"
            type="textarea"
            :rows="3"
            :placeholder="$t('review.replyPlaceholder')"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showReplyDialog = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="submitReply">{{ $t('common.confirm') }}</el-button>
      </template>
    </el-dialog>

    <!-- 举报弹窗 -->
    <el-dialog
      v-model="showReportDialog"
      :title="$t('review.reportTitle')"
      width="500px"
    >
      <el-form :model="reportForm">
        <el-form-item :label="$t('review.reportReason')">
          <el-radio-group v-model="reportForm.reason">
            <el-radio label="spam">{{ $t('review.reportReasons.spam') }}</el-radio>
            <el-radio label="inappropriate">{{ $t('review.reportReasons.inappropriate') }}</el-radio>
            <el-radio label="fake">{{ $t('review.reportReasons.fake') }}</el-radio>
            <el-radio label="other">{{ $t('review.reportReasons.other') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="reportForm.reason === 'other'"
          :label="$t('review.reportDescription')"
        >
          <el-input
            v-model="reportForm.description"
            type="textarea"
            :rows="3"
            :placeholder="$t('review.reportDescriptionPlaceholder')"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showReportDialog = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="submitReport">{{ $t('common.confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getReviewStats,
  getReviews,
  replyToReview,
  voteReview,
  reportReview
} from '@/api/components/productReviews'
import type { ReviewStats, ProductReview, ReviewReply } from '@/api/components/productReviews'

const props = defineProps<{
  productId: number
}>()

// 评价统计数据
const stats = ref<ReviewStats>({
  averageRating: 0,
  totalReviews: 0,
  ratingDistribution: {},
  withImages: 0,
  withReplies: 0
})

// 评价列表数据
const reviews = ref<(ProductReview & { replies: ReviewReply[] })[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 筛选条件
const filters = ref({
  rating: null as number | null,
  hasImages: false,
  hasReplies: false,
  sortBy: 'newest' as 'newest' | 'rating' | 'helpful'
})

// 回复相关
const showReplyDialog = ref(false)
const currentReviewId = ref<number | null>(null)
const replyForm = ref({
  content: ''
})

// 举报相关
const showReportDialog = ref(false)
const reportForm = ref({
  reviewId: null as number | null,
  reason: 'spam' as 'spam' | 'inappropriate' | 'fake' | 'other',
  description: ''
})

// 获取评价统计数据
const fetchReviewStats = async () => {
  try {
    const { data } = await getReviewStats(props.productId)
    stats.value = data
  } catch (error) {
    console.error('Failed to fetch review stats:', error)
  }
}

// 获取评价列表
const fetchReviews = async () => {
  try {
    const { data } = await getReviews({
      productId: props.productId,
      rating: filters.value.rating,
      hasImages: filters.value.hasImages,
      hasReplies: filters.value.hasReplies,
      sortBy: filters.value.sortBy,
      page: currentPage.value,
      limit: pageSize.value
    })
    reviews.value = data.items
    total.value = data.total
  } catch (error) {
    console.error('Failed to fetch reviews:', error)
  }
}

// 切换筛选条件
const toggleFilter = (key: keyof typeof filters.value) => {
  if (typeof filters.value[key] === 'boolean') {
    filters.value[key] = !filters.value[key]
    currentPage.value = 1
    fetchReviews()
  }
}

// 处理分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchReviews()
}

// 显示回复表单
const showReplyForm = (reviewId: number) => {
  currentReviewId.value = reviewId
  replyForm.value.content = ''
  showReplyDialog.value = true
}

// 提交回复
const submitReply = async () => {
  if (!currentReviewId.value || !replyForm.value.content.trim()) return

  try {
    await replyToReview(currentReviewId.value, replyForm.value.content)
    ElMessage.success('回复成功')
    showReplyDialog.value = false
    fetchReviews()
  } catch (error) {
    console.error('Failed to submit reply:', error)
    ElMessage.error('回复失败，请重试')
  }
}

// 切换有用/无用
const toggleHelpful = async (reviewId: number, vote: 'helpful' | 'unhelpful') => {
  try {
    await voteReview(reviewId, vote)
    fetchReviews()
  } catch (error) {
    console.error('Failed to vote review:', error)
    ElMessage.error('操作失败，请重试')
  }
}

// 显示举报弹窗
const showReportForm = (reviewId: number) => {
  reportForm.value = {
    reviewId,
    reason: 'spam',
    description: ''
  }
  showReportDialog.value = true
}

// 提交举报
const submitReport = async () => {