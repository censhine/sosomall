<template>
  <div class="product-reviews">
    <!-- 评论统计 -->
    <div class="review-stats" v-if="stats">
      <div class="rating-overview">
        <div class="average-rating">
          <span class="rating-number">{{
            stats.averageRating.toFixed(1)
          }}</span>
          <el-rate v-model="stats.averageRating" disabled />
          <span class="total-reviews">{{ stats.totalReviews }} 条评论</span>
        </div>
        <div class="rating-distribution">
          <div v-for="rating in 5" :key="rating" class="rating-bar">
            <span class="stars">{{ rating }}星</span>
            <el-progress
              :percentage="
                (stats.ratingDistribution[rating] / stats.totalReviews) * 100
              "
            />
            <span class="count">{{ stats.ratingDistribution[rating] }}</span>
          </div>
        </div>
      </div>
      <div class="review-filters">
        <el-radio-group v-model="currentFilter" @change="handleFilterChange">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="images"
            >有图 ({{ stats.withImages }})</el-radio-button
          >
          <el-radio-button label="replies"
            >有回复 ({{ stats.withReplies }})</el-radio-button
          >
        </el-radio-group>
      </div>
    </div>

    <!-- 评论列表 -->
    <div class="review-list">
      <div v-for="review in reviews" :key="review.id" class="review-item">
        <div class="review-header">
          <img
            :src="review.user.avatar"
            :alt="review.user.name"
            class="user-avatar"
          />
          <div class="review-info">
            <div class="user-name">{{ review.user.name }}</div>
            <div class="review-meta">
              <el-rate v-model="review.rating" disabled />
              <span class="review-date">{{
                formatDate(review.createdAt)
              }}</span>
            </div>
          </div>
        </div>
        <div class="review-content">
          <p>{{ review.content }}</p>
          <div v-if="review.images?.length" class="review-images">
            <el-image
              v-for="image in review.images"
              :key="image"
              :src="image"
              :preview-src-list="review.images"
            />
          </div>
        </div>
        <div class="review-footer">
          <div class="review-actions">
            <el-button
              :type="
                review.helpful.userVote === 'helpful' ? 'primary' : 'default'
              "
              size="small"
              @click="handleVote(review.id, 'helpful')"
            >
              有帮助 ({{ review.helpful.helpful }})
            </el-button>
            <el-button
              :type="
                review.helpful.userVote === 'unhelpful' ? 'primary' : 'default'
              "
              size="small"
              @click="handleVote(review.id, 'unhelpful')"
            >
              没帮助 ({{ review.helpful.unhelpful }})
            </el-button>
            <el-button
              v-if="canReply"
              size="small"
              @click="showReplyDialog(review.id)"
            >
              回复
            </el-button>
            <el-dropdown v-if="canManageReview(review)" trigger="click">
              <el-button size="small">
                更多<el-icon><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleDeleteReview(review.id)">
                    删除评论
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <!-- 评论回复 -->
          <div v-if="review.replies?.length" class="review-replies">
            <div
              v-for="reply in review.replies"
              :key="reply.id"
              class="reply-item"
            >
              <div class="reply-header">
                <img
                  :src="reply.user.avatar"
                  :alt="reply.user.name"
                  class="user-avatar"
                />
                <div class="reply-info">
                  <div class="user-name">
                    {{ reply.user.name }}
                    <el-tag
                      v-if="reply.user.isSeller"
                      size="small"
                      type="success"
                    >
                      卖家
                    </el-tag>
                  </div>
                  <div class="reply-date">
                    {{ formatDate(reply.createdAt) }}
                  </div>
                </div>
              </div>
              <div class="reply-content">{{ reply.content }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="review-pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        @current-change="handlePageChange"
      />
    </div>

    <!-- 回复对话框 -->
    <el-dialog v-model="replyDialogVisible" title="回复评论" width="500px">
      <el-form :model="replyForm" @submit.prevent="handleSubmitReply">
        <el-form-item>
          <el-input
            v-model="replyForm.content"
            type="textarea"
            :rows="4"
            placeholder="请输入回复内容"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmitReply"
            >提交回复</el-button
          >
          <el-button @click="replyDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ArrowDown } from "@element-plus/icons-vue";
import type { ProductReview } from "@/api/product";
import type {
  ReviewStats,
  ReviewQueryParams,
} from "@/api/components/productReviews";
import {
  getReviewStats,
  getReviews,
  voteReview,
  replyToReview,
  deleteReview,
} from "@/api/components/productReviews";

defineProps<{
  productId: number;
  canReply?: boolean;
  userId?: number;
}>();

// 状态
const stats = ref<ReviewStats>();
const reviews = ref<ProductReview[]>([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const currentFilter = ref("all");
const replyDialogVisible = ref(false);
const replyForm = ref({
  reviewId: 0,
  content: "",
});

// 计算属性
const canManageReview = computed(() => {
  return (review: ProductReview) => review.user.id === props.userId;
});

// 方法
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

const fetchReviewStats = async () => {
  try {
    const res = await getReviewStats(props.productId);
    stats.value = res.data;
  } catch (error) {
    ElMessage.error("获取评论统计失败");
  }
};

const fetchReviews = async () => {
  try {
    const params: ReviewQueryParams = {
      productId: props.productId,
      page: currentPage.value,
      limit: pageSize.value,
    };

    if (currentFilter.value === "images") {
      params.hasImages = true;
    } else if (currentFilter.value === "replies") {
      params.hasReplies = true;
    }

    const res = await getReviews(params);
    reviews.value = res.data.items;
    total.value = res.data.total;
  } catch (error) {
    ElMessage.error("获取评论列表失败");
  }
};

const handleFilterChange = () => {
  currentPage.value = 1;
  fetchReviews();
};

const handlePageChange = () => {
  fetchReviews();
};

const handleVote = async (reviewId: number, vote: "helpful" | "unhelpful") => {
  try {
    const res = await voteReview(reviewId, vote);
    const review = reviews.value.find((r) => r.id === reviewId);
    if (review) {
      review.helpful = res.data;
    }
    ElMessage.success("投票成功");
  } catch (error) {
    ElMessage.error("投票失败");
  }
};

const showReplyDialog = (reviewId: number) => {
  replyForm.value.reviewId = reviewId;
  replyForm.value.content = "";
  replyDialogVisible.value = true;
};

const handleSubmitReply = async () => {
  try {
    const res = await replyToReview(
      replyForm.value.reviewId,
      replyForm.value.content
    );
    const review = reviews.value.find((r) => r.id === replyForm.value.reviewId);
    if (review) {
      review.replies = review.replies || [];
      review.replies.push(res.data);
    }
    replyDialogVisible.value = false;
    ElMessage.success("回复成功");
  } catch (error) {
    ElMessage.error("回复失败");
  }
};

const handleDeleteReview = async (reviewId: number) => {
  try {
    await deleteReview(reviewId);
    reviews.value = reviews.value.filter((r) => r.id !== reviewId);
    ElMessage.success("删除成功");
    fetchReviewStats(); // 更新统计数据
  } catch (error) {
    ElMessage.error("删除失败");
  }
};

// 生命周期
onMounted(() => {
  fetchReviewStats();
  fetchReviews();
});
</script>

<style scoped>
.product-reviews {
  padding: 20px;
}

.review-stats {
  margin-bottom: 30px;
}

.rating-overview {
  display: flex;
  gap: 40px;
  margin-bottom: 20px;
}

.average-rating {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 200px;
}

.rating-number {
  font-size: 36px;
  font-weight: bold;
  color: #f56c6c;
}

.total-reviews {
  color: #666;
  margin-top: 5px;
}

.rating-distribution {
  flex: 1;
}

.rating-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
}

.stars {
  width: 40px;
}

.count {
  width: 40px;
  text-align: right;
}

.review-filters {
  margin-bottom: 20px;
}

.review-item {
  border-bottom: 1px solid #eee;
  padding: 20px 0;
}

.review-header {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.review-info {
  flex: 1;
}

.user-name {
  font-weight: 500;
  margin-bottom: 5px;
}

.review-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.review-date {
  color: #999;
  font-size: 14px;
}

.review-content {
  margin-bottom: 15px;
}

.review-images {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.review-images .el-image {
  width: 100px;
  height: 100px;
  border-radius: 4px;
}

.review-footer {
  margin-top: 15px;
}

.review-actions {
  display: flex;
  gap: 10px;
}

.review-replies {
  margin-top: 15px;
  padding-left: 55px;
}

.reply-item {
  background: #f8f9fa;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 10px;
}

.reply-header {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.reply-info {
  flex: 1;
}

.reply-date {
  font-size: 12px;
  color: #999;
  margin-top: 3px;
}

.review-pagination {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}
</style>
