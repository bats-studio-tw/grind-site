import axios from "axios";
import { UserData, Item, UserEquipment } from "@/types";

// 創建 axios 實例
export const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 添加請求攔截器
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

// 添加響應攔截器
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // 清除 token 並跳轉到登錄頁
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export const getUserData = async (): Promise<{
  data: UserData | null;
  error: Error | null;
}> => {
  try {
    const { data } = await api.get("/user");
    return { data, error: null };
  } catch (error) {
    console.error("Get user data error:", error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
};

export const updateUserData = async (
  userData: Partial<UserData>
): Promise<{ data: UserData | null; error: Error | null }> => {
  try {
    const { data } = await api.patch("/user", userData);
    return { data, error: null };
  } catch (error) {
    console.error("Update user data error:", error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
};

export const getUserEquipments = async (): Promise<{
  data: UserEquipment[];
  error: Error | null;
}> => {
  try {
    const { data } = await api.get("/user/equipments");
    return { data, error: null };
  } catch (error) {
    console.error("Get user equipments error:", error);
    return {
      data: [],
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
};

export const equipItem = async (
  slot: string,
  itemId: string
): Promise<{ error: Error | null }> => {
  try {
    await api.post("/user/equipments", { slot, itemId });
    return { error: null };
  } catch (error) {
    console.error("Equip item error:", error);
    return {
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
};

export const unequipItem = async (
  slot: string
): Promise<{ error: Error | null }> => {
  try {
    await api.delete("/user/equipments", { data: { slot } });
    return { error: null };
  } catch (error) {
    console.error("Unequip item error:", error);
    return {
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
};

export const getItems = async (): Promise<{
  data: Item[];
  error: Error | null;
}> => {
  try {
    const { data } = await api.get("/user/items");
    return { data, error: null };
  } catch (error) {
    console.error("Get items error:", error);
    return {
      data: [],
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
};
