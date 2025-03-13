// 生成模拟图片URL
export const getMockImage = (type: string, size: number = 200): string => {
  return `https://picsum.photos/${size}?type=${type}&random=${Math.random()}`;
};

// 生成多个模拟图片URL
export const getMockImages = (
  type: string,
  count: number = 3,
  size: number = 200
): string[] => {
  return Array(count)
    .fill(0)
    .map(() => getMockImage(type, size));
};
