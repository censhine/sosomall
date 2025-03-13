// 默认图片尺寸
const DEFAULT_SIZES = {
  banner: { width: 1200, height: 400 },
  product: { width: 300, height: 300 },
  avatar: { width: 100, height: 100 },
  logo: { width: 100, height: 100 },
  thumbnail: { width: 80, height: 80 },
};

// 生成随机图片URL
export const getMockImage = (
  type: keyof typeof DEFAULT_SIZES,
  seed?: string | number
) => {
  const { width, height } = DEFAULT_SIZES[type];
  const imageSeed = seed || Math.random().toString(36).substring(7);
  return `https://picsum.photos/seed/${imageSeed}/${width}/${height}`;
};

// 生成多张随机图片URL
export const getMockImages = (
  type: keyof typeof DEFAULT_SIZES,
  count: number,
  baseSeed?: string | number
) => {
  return Array.from({ length: count }, (_, index) => {
    const seed = baseSeed ? `${baseSeed}_${index}` : undefined;
    return getMockImage(type, seed);
  });
};

// 备用图片URL（以防picsum.photos无法访问）
export const FALLBACK_IMAGES = {
  banner: "https://via.placeholder.com/1200x400",
  product: "https://via.placeholder.com/300x300",
  avatar: "https://via.placeholder.com/100x100",
  logo: "https://via.placeholder.com/100x100",
  thumbnail: "https://via.placeholder.com/80x80",
};
