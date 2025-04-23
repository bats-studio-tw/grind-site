import axios from "axios";
import { UserData, Item, UserEquipment } from "@/types";
import { store } from "@/store";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 添加請求攔截器來設置 token
api.interceptors.request.use((config) => {
  const token = store.getState().user.token;
  if (!token) {
    console.log("No token found in store");
    return config;
  }

  const formattedToken = token.startsWith("Bearer ")
    ? token
    : `Bearer ${token}`;
  config.headers.Authorization = formattedToken;

  return config;
});

// 添加響應攔截器來處理 token 無效的情況
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      console.log("Token is invalid");
      // 不再使用localStorage，改用store
      store.dispatch({ type: "user/setToken", payload: null });
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
