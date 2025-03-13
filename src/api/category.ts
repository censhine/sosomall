import { categories, products } from "./mock";
import type { Category, Product } from "@/types";

// 模拟数据
const mockCategory = {
  id: 1,
  name: "电子产品",
  description: "最新的电子产品",
  image: "https://via.placeholder.com/300",
};

const mockProducts = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  name: `商品 ${index + 1}`,
  price: Math.floor(Math.random() * 10000) + 100,
  image: "https://via.placeholder.com/300",
  rating: (Math.random() * 2 + 3).toFixed(1),
  sales: Math.floor(Math.random() * 1000),
}));

interface GetCategoryProductsParams {
  categoryId: number;
  page: number;
  pageSize: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
}

// 获取分类详情
export const getCategoryDetail = (id: number) => {
  const category = categories.find((c) => c.id === id);
  if (!category) {
    throw new Error("Category not found");
  }
  return Promise.resolve({ data: category });
};

// 获取分类商品
export const getCategoryProducts = (params: GetCategoryProductsParams) => {
  const { categoryId, page, pageSize, minPrice, maxPrice, sortBy } = params;

  // 筛选商品
  let filteredProducts = products.filter((p) => p.categoryId === categoryId);

  // 价格筛选
  if (minPrice !== undefined) {
    filteredProducts = filteredProducts.filter((p) => p.price >= minPrice);
  }
  if (maxPrice !== undefined) {
    filteredProducts = filteredProducts.filter((p) => p.price <= maxPrice);
  }

  // 排序
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "sales":
        return b.sales - a.sales;
      default:
        return 0;
    }
  });

  // 分页
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const items = sortedProducts.slice(start, end);
  const total = sortedProducts.length;

  return Promise.resolve({ data: { items, total } });
};
