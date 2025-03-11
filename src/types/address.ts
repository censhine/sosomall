export interface Address {
  id: string;
  userId: string;
  recipient: string;
  phone: string;
  region: string[]; // 省市区编码数组
  detail: string;
  isDefault: boolean;
  tag?: string; // 标签，如"家"、"公司"等
  createTime: string;
  updateTime: string;
}
