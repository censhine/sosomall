import { User } from "@/types";
import { getMockImage } from "./utils";

// 模拟用户数据存储
const users: User[] = [
  {
    id: 1,
    email: "test@test.com",
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
export const login = async (email: string, password: string) => {
  await delay(1000); // 模拟网络延迟
  console.log(email, password);
  const user = users.find((u) => u.email == email && u.password == password);
  console.log(user);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const { password: _, ...userWithoutPassword } = user;
  console.log(userWithoutPassword);
  const token = `mock_token_${Date.now()}`;
  console.log(token);
  return {
    user: userWithoutPassword,
    token,
  };
};

// 模拟注册
export const register = async (userData: {
  email: string;
  password: string;
  username: string;
  phone?: string;
}) => {
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
    phone: userData.phone || "",
    createdAt: new Date().toISOString().split("T")[0],
  };

  users.push(newUser);

  const { password: _, ...userWithoutPassword } = newUser;
  const token = `mock_token_${Date.now()}`;

  return {
    user: userWithoutPassword,
    token,
  };
};

// 模拟获取用户信息
export const getUserInfo = async (token: string) => {
  await delay(500);

  // 在实际项目中，这里应该使用JWT来验证token
  // 为了简化mock实现，我们这里只验证token是否存在
  if (!token || !token.startsWith("mock_token_")) {
    throw new Error("Invalid token");
  }

  // 从已登录用户中查找匹配的用户
  const user = users.find((u) => u.id === 1);
  if (!user) {
    throw new Error("User not found");
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// 模拟登出
export const logout = async () => {
  await delay(500);
  return true;
};
