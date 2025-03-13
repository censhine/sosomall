import request from "@/utils/request";
import type { ApiResponse } from "@/types/home";
import type { ProductReview } from "@/api/product";

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    [key: number]: number; // 1-5星对应的评论数量
  };
  withImages: number;
  withReplies: number;
}

export interface ReviewQueryParams {
  productId: number;
  rating?: 1 | 2 | 3 | 4 | 5;
  hasImages?: boolean;
  hasReplies?: boolean;
  sortBy?: "newest" | "rating" | "helpful";
  page?: number;
  limit?: number;
}

export interface ReviewReply {
  id: number;
  reviewId: number;
  content: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    avatar: string;
    isSeller: boolean;
  };
}

export interface ReviewHelpful {
  helpful: number;
  unhelpful: number;
  userVote?: "helpful" | "unhelpful";
}

/**
 * 获取商品评论统计数据
 */
export function getReviewStats(productId: number) {
  return request.get<any, ApiResponse<ReviewStats>>(
    `/products/${productId}/review-stats`
  );
}

/**
 * 获取评论列表（带筛选和分页）
 */
export function getReviews(params: ReviewQueryParams) {
  return request.get<
    any,
    ApiResponse<{
      items: (ProductReview & {
        replies: ReviewReply[];
        helpful: ReviewHelpful;
      })[];
      total: number;
    }>
  >("/reviews", { params });
}

/**
 * 回复评论
 */
export function replyToReview(reviewId: number, content: string) {
  return request.post<any, ApiResponse<ReviewReply>>(
    `/reviews/${reviewId}/replies`,
    {
      content,
    }
  );
}

/**
 * 标记评论有帮助/无帮助
 */
export function voteReview(reviewId: number, vote: "helpful" | "unhelpful") {
  return request.post<any, ApiResponse<ReviewHelpful>>(
    `/reviews/${reviewId}/vote`,
    {
      vote,
    }
  );
}

/**
 * 删除评论（用户只能删除自己的评论）
 */
export function deleteReview(reviewId: number) {
  return request.delete<any, ApiResponse<null>>(`/reviews/${reviewId}`);
}

/**
 * 删除评论回复（用户只能删除自己的回复）
 */
export function deleteReviewReply(reviewId: number, replyId: number) {
  return request.delete<any, ApiResponse<null>>(
    `/reviews/${reviewId}/replies/${replyId}`
  );
}

/**
 * 举报评论
 */
export interface ReportReviewParams {
  reviewId: number;
  reason: "spam" | "inappropriate" | "fake" | "other";
  description?: string;
}

export function reportReview(data: ReportReviewParams) {
  return request.post<any, ApiResponse<null>>("/reviews/report", data);
}

/**
 * 获取评论图片上传地址
 */
export function getReviewImageUploadUrl() {
  return request.get<
    any,
    ApiResponse<{
      uploadUrl: string;
      headers: Record<string, string>;
    }>
  >("/reviews/image-upload-url");
}
