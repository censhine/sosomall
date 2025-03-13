import { mockHomeAPI } from "./home";

// 模拟网络延迟
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 拦截 fetch 请求
const originalFetch = window.fetch;
window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  if (typeof input !== "string") {
    return originalFetch(input, init);
  }

  // 添加随机延迟
  await delay(Math.random() * 300 + 200);

  // 处理首页相关的请求
  if (input.startsWith("/api")) {
    const path = input.substring(4);

    // 轮播图
    if (path === "/banners") {
      return new Response(JSON.stringify(mockHomeAPI.getBanners()), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 热门商品
    if (path === "/products/hot") {
      return new Response(JSON.stringify(mockHomeAPI.getHotProducts()), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 新品
    if (path === "/products/new") {
      return new Response(JSON.stringify(mockHomeAPI.getNewProducts()), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 分类
    if (path === "/categories") {
      return new Response(JSON.stringify(mockHomeAPI.getCategories()), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 品牌
    if (path === "/brands") {
      return new Response(JSON.stringify(mockHomeAPI.getBrands()), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // 其他请求走原始fetch
  return originalFetch(input, init);
};
