import { UserData } from "@/types";

/**
 * 計算當前點擊目標值
 * @param currentClickCount 當前點擊次數
 * @returns 當前目標值
 */
export const calculateCurrentClickTarget = (
  currentClickCount: number
): {
  currentClickTarget: number;
  nextClickTarget: number;
} => {
  // 基礎難度係數（可微調）
  const growthFactor = 1.3;

  // 避免 0，並從 100 起跳
  const base = Math.max(currentClickCount, 100);

  // 計算目標，並四捨五入為 100 的倍數
  const currentClickTarget = Math.ceil(base / 100) * 100;
  const nextClickTarget =
    Math.ceil((currentClickTarget * growthFactor) / 100) * 100;

  return {
    currentClickTarget,
    nextClickTarget,
  };
};

/**
 * 檢查是否需要獎勵禮物盒
 * @param currentClickCount 當前點擊次數
 * @param currentClickTarget 當前目標值
 * @returns 是否需要獎勵禮物盒
 */
export const shouldRewardGiftBox = (
  currentClickCount: number,
  currentClickTarget: number
): boolean => {
  return currentClickCount >= currentClickTarget;
};

/**
 * 計算下一個點擊目標值
 * @param currentClickTarget 當前目標值
 * @returns 下一個目標值
 */
export const calculateNextClickTarget = (
  currentClickTarget: number
): number => {
  return currentClickTarget * 1.5;
};

/**
 * 生成遊戲狀態數據
 * @param userData 用戶數據
 * @returns 遊戲狀態數據
 */
export const generateGameStateData = (userData: UserData) => {
  const { currentClickTarget, nextClickTarget } = calculateCurrentClickTarget(
    userData.clickedCount
  );

  return {
    clickedCount: userData.clickedCount,
    currentClickTarget,
    nextClickTarget,
    remainingGiftBox: userData.remainingGiftBox || 0,
  };
};
