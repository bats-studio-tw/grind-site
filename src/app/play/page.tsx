"use client";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Unity, useUnityContext } from "react-unity-webgl";
import { UnityResponsiveLayout } from "@/components/layout/UnityResponsiveLayout";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getUserEquipments } from "@/lib/api";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    handleGetUserData: () => string;
  }
}

export default function PlayPage() {
  const router = useRouter();
  const {
    address,
    userName,
    character,
    clickedCount,
    nextTarget,
    totalBoxes,
    openedBoxes,
  } = useSelector((state: RootState) => state.user);

  // Track if event listener is registered
  const [isListenerRegistered, setIsListenerRegistered] = useState(false);

  // Unity context setup
  const {
    unityProvider,
    isLoaded,
    loadingProgression,
    addEventListener,
    removeEventListener,
    sendMessage,
  } = useUnityContext({
    loaderUrl: "game/TapTapTake.loader.js",
    dataUrl: "game/TapTapTake.data",
    frameworkUrl: "game/TapTapTake.framework.js",
    codeUrl: "game/TapTapTake.wasm",
  });

  // 檢查用戶是否已登錄
  useEffect(() => {
    if (!address) {
      console.log("No user found, redirecting to login page");
      router.push("/");
    }
  }, [address, router]);

  // 獲取用戶數據
  const handleGetUserData = useCallback(() => {
    console.log("handleGetUserData called from Unity");

    (async () => {
      try {
        const { data: equipments } = await getUserEquipments();
        const hatEquipment = equipments.find((e) => e.slot === "hat");
        const faceEquipment = equipments.find((e) => e.slot === "face");

        const userData = {
          UserName: userName || "",
          Charactor: character || 0,
          ClickedCount: clickedCount || 0,
          NextTarget: nextTarget || 0,
          Hat: hatEquipment ? hatEquipment.itemId : "None",
          Face: faceEquipment ? faceEquipment.itemId : "None",
          address: address || "",
          totalBoxes: totalBoxes || 0,
          openedBoxes: openedBoxes || 0,
        };

        console.log("Sending userData to Unity:", userData);
        sendMessage("GameRoot", "ReceiveUserData", JSON.stringify(userData));
      } catch (error) {
        console.error("Error sending user data to Unity", error);
      }
    })();

    // Return string to match the expected return type of the event handler
    return "ok";
  }, [
    address,
    character,
    clickedCount,
    nextTarget,
    openedBoxes,
    sendMessage,
    totalBoxes,
    userName,
  ]);

  // Register event listener only when Unity is loaded
  useEffect(() => {
    // Only set up event listeners when Unity is fully loaded
    if (isLoaded && !isListenerRegistered) {
      console.log("Unity loaded - registering GetUserData event listener");

      // Register the event listener
      addEventListener("GetUserData", handleGetUserData);
      setIsListenerRegistered(true);
    }

    // Cleanup function to remove event listener
    return () => {
      if (isListenerRegistered) {
        console.log("Removing GetUserData event listener");
        removeEventListener("GetUserData", handleGetUserData);
        setIsListenerRegistered(false);
      }
    };
  }, [
    isLoaded,
    isListenerRegistered,
    addEventListener,
    removeEventListener,
    handleGetUserData,
  ]);

  return (
    <UnityResponsiveLayout
      aspectRatio={1170 / 2137}
      isLoading={!isLoaded}
      loadingMessage={`Loading... ${Math.round(loadingProgression * 100)}%`}
    >
      <Image
        src="/home-background.jpg"
        alt="Loading"
        fill
        className="absolute z-0 inset-0"
      />
      {/* Unity 畫面：置滿容器 */}
      <Unity
        unityProvider={unityProvider}
        style={{
          position: "absolute",
          zIndex: 10,
          width: "100%",
          height: "100%",
          background: "url('/game/TapTapTake.jpg') center / cover",
        }}
      />
    </UnityResponsiveLayout>
  );
}
