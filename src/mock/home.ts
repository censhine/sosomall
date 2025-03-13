import { faker } from "@faker-js/faker/locale/zh_CN";
import type { Banner, Product, Category, Brand } from "@/types/home";

// 生成轮播图数据
export const generateBanners = (count: number = 20): Banner[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: faker.string.uuid(),
    title: faker.commerce.productName(),
    image: faker.image.urlLoremFlickr({
      category: "fashion",
      width: 1200,
      height: 400,
    }),
    link: `/product/${faker.string.uuid()}`,
    sort: index + 1,
  }));
};

// 生成商品数据
export const generateProducts = (
  count: number = 20,
  options: { isHot?: boolean; isNew?: boolean } = {}
): Product[] => {
  return Array.from({ length: count }, () => {
    const price = parseFloat(faker.commerce.price());
    return {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price,
      originalPrice: price * 1.2,
      image: faker.image.urlLoremFlickr({
        category: "product",
        width: 300,
        height: 300,
      }),
      sales: faker.number.int({ min: 0, max: 9999 }),
      rating: faker.number.float({ min: 0, max: 5, fractionDigits: 1 }),
      category: faker.commerce.department(),
      tags: faker.helpers.arrayElements(["新品", "热卖", "推荐", "限时"], {
        min: 1,
        max: 3,
      }),
      ...(options.isHot && { isHot: true }),
      ...(options.isNew && { isNew: true }),
    };
  });
};

// 生成分类数据
export const generateCategories = (count: number = 20): Category[] => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    name: faker.commerce.department(),
    icon: faker.helpers.arrayElement([
      "Goods",
      "ShoppingBag",
      "Present",
      "Collection",
      "Shop",
      "ShoppingCart",
    ]),
    image: faker.image.urlLoremFlickr({
      category: "fashion",
      width: 200,
      height: 200,
    }),
    description: faker.commerce.productDescription(),
    productCount: faker.number.int({ min: 100, max: 9999 }),
  }));
};

// 生成品牌数据
export const generateBrands = (count: number = 20): Brand[] => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    name: faker.company.name(),
    logo: faker.image.urlLoremFlickr({
      category: "business",
      width: 200,
      height: 100,
    }),
    description: faker.company.catchPhrase(),
    productCount: faker.number.int({ min: 100, max: 9999 }),
  }));
};

// Mock API 响应
export const mockHomeAPI = {
  // 获取轮播图
  getBanners: () => ({
    code: 200,
    message: "success",
    items: generateBanners(),
    total: 20,
  }),

  // 获取热门商品
  getHotProducts: () => ({
    code: 200,
    message: "success",
    items: generateProducts(20, { isHot: true }),
    total: 20,
  }),

  // 获取新品
  getNewProducts: () => ({
    code: 200,
    message: "success",
    items: generateProducts(20, { isNew: true }),
    total: 20,
  }),

  // 获取分类
  getCategories: () => ({
    code: 200,
    message: "success",
    items: generateCategories(),
    total: 20,
  }),

  // 获取品牌
  getBrands: () => ({
    code: 200,
    message: "success",
    items: generateBrands(),
    total: 20,
  }),
};
