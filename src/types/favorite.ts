export interface FavoriteItem {
  id: string;
  type: "product" | "store" | "brand";
  name: string;
  image: string;
  price?: number;
  originalPrice?: number;
  description?: string;
  createTime: string;
  updateTime: string;
  // 商品特有属性
  productId?: string;
  specs?: Record<string, string>;
  stock?: number;
  // 店铺特有属性
  storeId?: string;
  storeName?: string;
  storeRating?: number;
  // 品牌特有属性
  brandId?: string;
  brandName?: string;
  brandLogo?: string;
}
