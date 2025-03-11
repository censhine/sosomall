export interface UserInfo {
  id?: string;
  nickname: string;
  email: string;
  phone: string;
  avatar: string;
  gender: "male" | "female" | "other";
  birthday: string;
  bio: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserState {
  userInfo: UserInfo | null;
  isLoggedIn: boolean;
  token: string | null;
}
