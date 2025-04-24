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
  const growthFactor = 1.1;
  const baseTarget = 100;

  let currentClickTarget = baseTarget;

  // 用迴圈找出目前點擊數在哪個門檻區間
  while (currentClickCount >= currentClickTarget) {
    currentClickTarget =
      Math.ceil((currentClickTarget * growthFactor) / 10) * 10;
  }

  // 下一個目標 = 下一階段的門檻
  const nextClickTarget =
    Math.ceil((currentClickTarget * growthFactor) / 10) * 10;

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
  prevClickCount: number
): boolean => {
  const { currentClickTarget } = calculateCurrentClickTarget(prevClickCount);

  return currentClickCount >= currentClickTarget;
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
