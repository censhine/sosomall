import type {
  Product,
  Category,
  Brand,
  Banner,
  User,
  Address,
  Order,
} from "@/types";
import { getMockImage, getMockImages } from "@/utils/mockImages";

// Mock Products
export const products: Product[] = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  name: `Product ${index + 1}`,
  price: Math.floor(Math.random() * 1000) + 99,
  originalPrice: Math.floor(Math.random() * 1500) + 199,
  description: `This is a description for product ${index + 1}`,
  image: getMockImage("product", `product_${index + 1}`),
  images: getMockImages("product", 4, `product_${index + 1}`),
  stock: Math.floor(Math.random() * 100) + 1,
  sales: Math.floor(Math.random() * 1000),
  rating: Number((Math.random() * 2 + 3).toFixed(1)),
  specs: {
    Color: ["Red", "Blue", "Black"][Math.floor(Math.random() * 3)],
    Size: ["S", "M", "L", "XL"][Math.floor(Math.random() * 4)],
  },
  categoryId: Math.floor(Math.random() * 10) + 1,
  brandId: Math.floor(Math.random() * 10) + 1,
}));

// Mock Categories
export const categories: Category[] = [
  {
    id: 1,
    name: "Electronics",
    description: "Electronic devices and accessories",
    image: getMockImage("product", "category_1"),
  },
  {
    id: 2,
    name: "Clothing",
    description: "Fashion and apparel",
    image: getMockImage("product", "category_2"),
  },
  {
    id: 3,
    name: "Home & Garden",
    description: "Home improvement and garden supplies",
    image: getMockImage("product", "category_3"),
  },
  {
    id: 4,
    name: "Sports",
    description: "Sports equipment and accessories",
    image: getMockImage("product", "category_4"),
  },
  {
    id: 5,
    name: "Books",
    description: "Books and publications",
    image: getMockImage("product", "category_5"),
  },
  {
    id: 6,
    name: "Beauty",
    description: "Cosmetics and personal care",
    image: getMockImage("product", "category_6"),
  },
  {
    id: 7,
    name: "Toys",
    description: "Toys and games for all ages",
    image: getMockImage("product", "category_7"),
  },
  {
    id: 8,
    name: "Automotive",
    description: "Car parts and accessories",
    image: getMockImage("product", "category_8"),
  },
  {
    id: 9,
    name: "Food & Beverage",
    description: "Groceries and gourmet food",
    image: getMockImage("product", "category_9"),
  },
  {
    id: 10,
    name: "Health",
    description: "Health and wellness products",
    image: getMockImage("product", "category_10"),
  },
];

// Mock Brands
export const brands: Brand[] = [
  {
    id: 1,
    name: "TechPro",
    description: "Leading technology brand",
    logo: getMockImage("logo", "brand_1_logo"),
    image: getMockImage("product", "brand_1"),
  },
  {
    id: 2,
    name: "FashionStyle",
    description: "Premium fashion brand",
    logo: getMockImage("logo", "brand_2_logo"),
    image: getMockImage("product", "brand_2"),
  },
  {
    id: 3,
    name: "HomeComfort",
    description: "Quality home products",
    logo: getMockImage("logo", "brand_3_logo"),
    image: getMockImage("product", "brand_3"),
  },
  {
    id: 4,
    name: "SportMaster",
    description: "Professional sports equipment",
    logo: getMockImage("logo", "brand_4_logo"),
    image: getMockImage("product", "brand_4"),
  },
  {
    id: 5,
    name: "BookWorld",
    description: "Your reading companion",
    logo: getMockImage("logo", "brand_5_logo"),
    image: getMockImage("product", "brand_5"),
  },
  {
    id: 6,
    name: "BeautyGlow",
    description: "Premium beauty products",
    logo: getMockImage("logo", "brand_6_logo"),
    image: getMockImage("product", "brand_6"),
  },
  {
    id: 7,
    name: "ToyJoy",
    description: "Fun and educational toys",
    logo: getMockImage("logo", "brand_7_logo"),
    image: getMockImage("product", "brand_7"),
  },
  {
    id: 8,
    name: "AutoParts",
    description: "Quality automotive parts",
    logo: getMockImage("logo", "brand_8_logo"),
    image: getMockImage("product", "brand_8"),
  },
  {
    id: 9,
    name: "GourmetFood",
    description: "Premium food and beverages",
    logo: getMockImage("logo", "brand_9_logo"),
    image: getMockImage("product", "brand_9"),
  },
  {
    id: 10,
    name: "HealthPlus",
    description: "Your health partner",
    logo: getMockImage("logo", "brand_10_logo"),
    image: getMockImage("product", "brand_10"),
  },
];

// Mock Banners
export const banners: Banner[] = [
  {
    id: 1,
    title: "Summer Sale",
    description: "Up to 50% off on summer collection",
    image: getMockImage("banner", "banner_1"),
    link: "/promotions/summer-sale",
  },
  {
    id: 2,
    title: "New Arrivals",
    description: "Check out our latest products",
    image: getMockImage("banner", "banner_2"),
    link: "/new-arrivals",
  },
  {
    id: 3,
    title: "Special Offers",
    description: "Limited time deals on selected items",
    image: getMockImage("banner", "banner_3"),
    link: "/special-offers",
  },
  {
    id: 4,
    title: "Tech Gadgets",
    description: "Latest electronics and accessories",
    image: getMockImage("banner", "banner_4"),
    link: "/category/electronics",
  },
  {
    id: 5,
    title: "Fashion Week",
    description: "Trending styles and outfits",
    image: getMockImage("banner", "banner_5"),
    link: "/category/clothing",
  },
  {
    id: 6,
    title: "Home Makeover",
    description: "Transform your living space",
    image: getMockImage("banner", "banner_6"),
    link: "/category/home-garden",
  },
];

// Mock Users
export const users: User[] = [
  {
    id: 1,
    username: "john_doe",
    email: "john@example.com",
    phone: "13800138000",
    avatar: getMockImage("avatar", "user_1"),
    nickname: "John",
    createdAt: "2024-01-01",
  },
];

// Mock Addresses
export const addresses: Address[] = [
  {
    id: 1,
    userId: 1,
    name: "John Doe",
    phone: "13800138000",
    province: "Guangdong",
    city: "Shenzhen",
    district: "Nanshan",
    address: "Technology Park No. 1",
    isDefault: true,
  },
];

// Mock Orders
export const orders: Order[] = Array.from({ length: 10 }, (_, index) => ({
  id: `202401010000${index + 1}`,
  userId: 1,
  products: Array.from(
    { length: Math.floor(Math.random() * 3) + 1 },
    (_, i) => ({
      id: i + 1,
      quantity: Math.floor(Math.random() * 3) + 1,
      price: Math.floor(Math.random() * 1000) + 99,
      product: products[Math.floor(Math.random() * products.length)],
    })
  ),
  total: 0, // Will be calculated
  status: ["pending", "paid", "shipped", "completed", "cancelled"][
    Math.floor(Math.random() * 5)
  ] as Order["status"],
  address: addresses[0],
  createdAt: new Date(
    Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
  ).toISOString(),
  updatedAt: new Date().toISOString(),
})).map((order) => ({
  ...order,
  total: order.products.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  ),
}));
