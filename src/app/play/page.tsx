"use client";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Unity, useUnityContext } from "react-unity-webgl";
import { UnityResponsiveLayout } from "@/components/layout/UnityResponsiveLayout";
import { useRouter } from "next/navigation";
import { getUserEquipments, getItems, getUserData, api } from "@/lib/api";
import { calculateCurrentClickTarget } from "@/lib/gameUtils";

export default function PlayPage() {
  const router = useRouter();

  // Track if event listener is registered
  const [isListenerRegistered, setIsListenerRegistered] = useState(false);
  const version = "1.0.1";
  const versionSuffix = `?v=${version}`;

  // Unity context setup
  const { unityProvider, isLoaded, loadingProgression, sendMessage } =
    useUnityContext({
      loaderUrl: "game/TapTapTake.loader.js" + versionSuffix,
      dataUrl: "game/TapTapTake.data" + versionSuffix,
      frameworkUrl: "game/TapTapTake.framework.js" + versionSuffix,
      codeUrl: "game/TapTapTake.wasm" + versionSuffix,
    });

  // 檢查用戶是否已登錄
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await getUserData();
        if (!data) {
          console.log("No user found, redirecting to login page");
          router.push("/");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/");
      }
    };
    checkAuth();
  }, [router]);

  // 獲取用戶數據
  const handleGetUserData = useCallback(() => {
    (async () => {
      try {
        if (!isLoaded) {
          console.log("Unity not loaded yet, skipping user data send");
          return;
        }

        const { data: currentUserData } = await getUserData();

        if (!currentUserData) {
          console.error("Failed to get current user data");
          return;
        }

        const { data: equipments } = await getUserEquipments();

        const hatEquipment = equipments.find((e) => e.slot === "Hat");
        const faceEquipment = equipments.find((e) => e.slot === "Face");
        const { currentClickTarget, nextClickTarget } =
          calculateCurrentClickTarget(currentUserData.clickedCount);

        const userData = {
          address: currentUserData.address || "",
          userName: currentUserData.userName || "",
          character: currentUserData.character || 0,
          clickedCount: currentUserData.clickedCount || 0,
          currentClickTarget,
          nextClickTarget,
          remainingGiftBox: currentUserData.remainingGiftBox || 0,
          hat: hatEquipment
            ? `${hatEquipment.slot}${hatEquipment.item?.name}`
            : "HatNone",
          face: faceEquipment
            ? `${faceEquipment.slot}${faceEquipment.item?.name}`
            : "FaceNone",
        };

        sendMessage("GameRoot", "ReceiveUserData", JSON.stringify(userData));
      } catch (error) {
        console.error("Error sending user data to Unity", error);
      }
    })();

    return "ok";
  }, [isLoaded, sendMessage]);

  const handleGetInventoryItem = useCallback(() => {
    (async () => {
      const { data: items } = await getItems();

      const inventoryItem: { [key: string]: string[] } = {
        Hat: ["HatNone"],
        Face: ["FaceNone"],
      };

      items.forEach((item) => {
        inventoryItem[item.slot].push(`${item.slot}${item.name}`);
      });

      sendMessage(
        "GameRoot",
        "ReceiveInventoryItem",
        JSON.stringify(inventoryItem)
      );
    })();
  }, [sendMessage]);

  const handleUpdateClickCount = useCallback(
    (value: string) => {
      (async () => {
        try {
          const clickCount = parseInt(value);
          if (isNaN(clickCount)) {
            console.error("Invalid click count value:", value);
            return;
          }

          const response = await api.post("/user/click", { clickCount });
          if (response.status !== 200) {
            console.error(
              "Failed to update click count:",
              response.data.message
            );
            return;
          }

          const { shouldReward, currentClickTarget, nextClickTarget } =
            response.data;

          if (shouldReward) {
            const gameStateData = {
              currentClickTarget,
              nextClickTarget,
              remainingGiftBox: response.data.remainingGiftBox,
            };

            sendMessage(
              "GameRoot",
              "ReceiveNextClickTarget",
              JSON.stringify(gameStateData)
            );
          }
        } catch (error) {
          console.error("Error updating click count:", error);
        }
      })();
    },
    [sendMessage]
  );

  const handleUpdateWearItem = useCallback((data: string) => {
    (async () => {
      try {
        const parsedData = JSON.parse(data);
        console.log("Updating wear items - parsed data:", parsedData);

        await api.post("/user/equip", parsedData);
      } catch (error) {
        console.error("Error updating wear items:", error);
        if (error instanceof Error) {
          console.error("Error details:", {
            message: error.message,
            stack: error.stack,
          });
        }
      }
    })();
  }, []);

  const handleGetGiftBoxResult = useCallback(() => {
    (async () => {
      try {
        const { data: currentUserData } = await getUserData();
        if (!currentUserData) {
          console.error("Failed to get current user data");
          return;
        }

        if (currentUserData.remainingGiftBox <= 0) {
          console.error("No gift box available");
          return;
        }

        // Call the gift box API
        const response = await api.post("/user/gift-box");
        if (response.status !== 200) {
          console.error("Failed to open gift box:", response.data.message);
          return;
        }

        const { item, remainingGiftBox } = response.data;

        sendMessage(
          "GameRoot",
          "ReceiveGiftBoxResult",
          JSON.stringify({
            itemName: `${item.slot}${item.name}`,
            remainingGiftBox,
          })
        );
      } catch (error) {
        console.error("Error opening gift box:", error);
      }
    })();
  }, [sendMessage]);

  // Register event listener only when Unity is loaded
  useEffect(() => {
    let messageHandler: ((event: MessageEvent) => void) | null = null;

    // Only set up event listeners when Unity is fully loaded
    if (isLoaded && !isListenerRegistered) {
      // Add a message event listener to catch all messages
      messageHandler = (event: MessageEvent) => {
        console.log("Received message:", event.data);
        if (!event.data) return;

        switch (event.data.type) {
          case "GetUserData":
            console.log("GetUserData");
            handleGetUserData();
            break;
          case "GetInventoryItem":
            handleGetInventoryItem();
            break;
          case "UpdateClickCount":
            handleUpdateClickCount(event.data.data);
            break;
          case "UpdateWearItem":
            handleUpdateWearItem(event.data.data);
            break;
          case "GetGiftBoxResult":
            handleGetGiftBoxResult();
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
  }, [
    isLoaded,
    isListenerRegistered,
    handleGetUserData,
    handleGetInventoryItem,
    handleUpdateClickCount,
    handleUpdateWearItem,
    handleGetGiftBoxResult,
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
