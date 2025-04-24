"use client";

import React from "react";
import { useLoginWithAbstract } from "@abstract-foundation/agw-react";
import { SyStemButtom } from "@/components/ui/SyStemButtom";
import { updateUserData } from "@/lib/api";
import { useRouter } from "next/navigation";

interface StartGameButtonProps {
  selectedCharacter: number | null;
}

export function StartGameButton({ selectedCharacter }: StartGameButtonProps) {
  const { login } = useLoginWithAbstract();
  const router = useRouter();

  const handleClick = async () => {
    if (selectedCharacter === null) {
      alert("請先選擇角色");
      return;
    }

    try {
      // 更新用戶角色數據
      const { error } = await updateUserData({ character: selectedCharacter });

      if (error) {
        console.error("Failed to update character:", error);
        alert("更新角色失敗，請重試");
        return;
      }

      router.push("/play");
    } catch (error) {
      console.error("Error updating character:", error);
      alert("更新角色時發生錯誤，請重試");
    }
  };

  return (
    <SyStemButtom
      onClick={handleClick}
      topColor="bg-[#FDE613]"
      bottomColor="bg-[#DE8316]"
      textColor="text-[#7E2200]"
      rightSlot="Start Game"
    />
  );
}
