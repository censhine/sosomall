export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  orderUpdates: boolean;
  promotions: boolean;
}

export interface PrivacySettings {
  profileVisibility: "public" | "friends" | "private";
  searchable: boolean;
  activityVisible: boolean;
}

export interface LocaleSettings {
  language: string;
  timezone: string;
  currency: string;
}

export interface ThemeSettings {
  mode: "light" | "dark" | "system";
  primaryColor: string;
  fontSize: number;
}
