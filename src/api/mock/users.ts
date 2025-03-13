import { User } from "@/types";
import { getMockImage } from "./utils";

// 模拟用户数据存储
const users: User[] = [
  {
    id: 1,
    email: "demo@example.com",
    password: "123456", // 实际项目中应该使用加密密码
    username: "demo",
    nickname: "Demo User",
    avatar: getMockImage("avatar", 200),
    phone: "13800138000",
    createdAt: "2024-01-01",
  },
];

// 模拟延迟
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 模拟登录
export const login = async (email: string, password: string): Promise<User> => {
  await delay(1000); // 模拟网络延迟

  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// 模拟注册
export const register = async (userData: {
  email: string;
  password: string;
  username: string;
  phone: string;
}): Promise<User> => {
  await delay(1000); // 模拟网络延迟

  // 检查邮箱是否已存在
  if (users.some((u) => u.email === userData.email)) {
    throw new Error("Email already exists");
  }

  // 检查用户名是否已存在
  if (users.some((u) => u.username === userData.username)) {
    throw new Error("Username already exists");
  }

  const newUser: User = {
    id: users.length + 1,
    email: userData.email,
    password: userData.password,
    username: userData.username,
    nickname: userData.username,
    avatar: getMockImage("avatar", 200),
    phone: userData.phone,
    createdAt: new Date().toISOString().split("T")[0],
  };

  users.push(newUser);

  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

// 模拟检查邮箱是否存在
export const checkEmailExists = async (email: string): Promise<boolean> => {
  await delay(500);
  return users.some((u) => u.email === email);
};

// 模拟检查用户名是否存在
export const checkUsernameExists = async (
  username: string
): Promise<boolean> => {
  await delay(500);
  return users.some((u) => u.username === username);
};
