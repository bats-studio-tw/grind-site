"use client";

import Image from "next/image";
import { useAccount } from "wagmi";
import { StartGameButton } from "@/components/ui/StartGameButton";
import { UnityResponsiveLayout } from "@/components/layout/UnityResponsiveLayout";
import { useState, useEffect } from "react";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { getUserData } from "@/lib/api";

export default function Home() {
  const { status } = useAccount();
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(
    null
  );
  const scale = useSelector((state: RootState) => state.unityScale.scale);
  const isLoading = status === "connecting" || status === "reconnecting";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: userData } = await getUserData();
        if (userData) {
          setSelectedCharacter(userData.character);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    if (status === "connected") {
      fetchUserData();
    }
  }, [status]);

  return (
    <UnityResponsiveLayout aspectRatio={1170 / 2137} isLoading={isLoading}>
      <Image
        src="/character-background.png"
        alt="Loading"
        fill
        className="absolute z-0 inset-0"
        draggable="false"
      />
      <div className="absolute z-10 flex flex-col items-center justify-top inset-0 gap-4 pt-[25vh]">
        <div
          className="text-white font-bold"
          style={{
            marginBottom: `calc(30vh * ${scale})`,
            fontSize: `${80 * scale}px`,
          }}
        >
          Choose Your Character
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex items-end justify-center gap-2">
            <Image
              src="/grind.png"
              alt="grind"
              width={400 * scale}
              height={100 * scale}
              className={`cursor-pointer transition-all duration-300 select-none ${
                selectedCharacter === 1
                  ? "brightness-100 scale-110"
                  : "brightness-50 grayscale hover:brightness-75"
              }`}
              onClick={() => setSelectedCharacter(1)}
              draggable="false"
            />
            <Image
              src="/bearish.png"
              alt="bearish"
              width={400 * scale}
              height={100 * scale}
              className={`cursor-pointer transition-all duration-300 select-none ${
                selectedCharacter === 0
                  ? "brightness-100 scale-110"
                  : "brightness-50 grayscale hover:brightness-75"
              }`}
              onClick={() => setSelectedCharacter(0)}
              draggable="false"
            />
          </div>
          <StartGameButton selectedCharacter={selectedCharacter} />
        </div>
      </div>
    </UnityResponsiveLayout>
  );
}
