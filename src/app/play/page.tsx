"use client";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Unity, useUnityContext } from "react-unity-webgl";
import { UnityResponsiveLayout } from "@/components/layout/UnityResponsiveLayout";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getUserEquipments, getItems, updateUserData } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function PlayPage() {
  const router = useRouter();
  const { address, userName, character, clickedCount, remainingGiftBox } =
    useSelector((state: RootState) => state.user);

  // Track if event listener is registered
  const [isListenerRegistered, setIsListenerRegistered] = useState(false);

  // Unity context setup
  const { unityProvider, isLoaded, loadingProgression, sendMessage } =
    useUnityContext({
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
    (async () => {
      try {
        const { data: equipments } = await getUserEquipments();
        const hatEquipment = equipments.find((e) => e.slot === "Hat");
        const faceEquipment = equipments.find((e) => e.slot === "Face");

        const userData = {
          address: address || "",
          userName: userName || "",
          character: character || 0,
          clickedCount: clickedCount || 0,
          currentClickTarget: Math.max(clickedCount, 1) * 1.5,
          nextClickTarget: Math.max(clickedCount, 1) * 1.5 * 1.5,
          remainingGiftBox: remainingGiftBox || 0,
          hat: hatEquipment ? hatEquipment.itemId : "None",
          face: faceEquipment ? faceEquipment.itemId : "None",
        };

        sendMessage("GameRoot", "ReceiveUserData", JSON.stringify(userData));
      } catch (error) {
        console.error("Error sending user data to Unity", error);
      }
    })();

    return "ok";
  }, [address, userName, character, clickedCount, remainingGiftBox]);

  const handleGetInventoryItem = useCallback(() => {
    (async () => {
      const { data: items } = await getItems();

      const inventoryItem = items.reduce<Record<string, string[]>>(
        (acc, curr) => {
          if (!acc[curr.slot]) {
            acc[curr.slot] = [];
          }
          acc[curr.slot].push(`${curr.slot}${curr.name}`);
          return acc;
        },
        {}
      );

      console.log("inventoryItem", inventoryItem);

      sendMessage(
        "GameRoot",
        "ReceiveInventoryItem",
        JSON.stringify(inventoryItem)
      );
    })();
  }, []);

  const handleUpdateClickCount = useCallback((value: string) => {
    (async () => {
      try {
        const clickCount = parseInt(value);
        if (isNaN(clickCount)) {
          console.error("Invalid click count value:", value);
          return;
        }

        await updateUserData({ clickedCount: clickCount });
      } catch (error) {
        console.error("Error updating click count:", error);
      }
    })();
  }, []);

  // Register event listener only when Unity is loaded
  useEffect(() => {
    let messageHandler: ((event: MessageEvent) => void) | null = null;

    // Only set up event listeners when Unity is fully loaded
    if (isLoaded && !isListenerRegistered) {
      console.log("Unity loaded - registering GetUserData event listener");

      // Add a message event listener to catch all messages
      messageHandler = (event: MessageEvent) => {
        console.log("Received message:", event.data);
        if (!event.data) return;
        switch (event.data.type) {
          case "GetUserData":
            handleGetUserData();
            break;
          case "GetInventoryItem":
            handleGetInventoryItem();
            break;
          case "UpdateClickCount":
            handleUpdateClickCount(event.data.data);
            break;
          default:
            break;
        }
      };

      window.addEventListener("message", messageHandler);

      // Register the event listener
      setIsListenerRegistered(true);
    }

    // Cleanup
    return () => {
      if (messageHandler && isListenerRegistered) {
        window.removeEventListener("message", messageHandler);
        setIsListenerRegistered(false);
      }
    };
  }, [isLoaded, isListenerRegistered, handleGetUserData]);

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
