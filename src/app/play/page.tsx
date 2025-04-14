"use client";

import React, { useEffect, useRef } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

export default function PlayPage() {
  const { unityProvider, isLoaded, loadingProgression } = useUnityContext({
    loaderUrl: "game/Build/Farplanter.loader.js",
    dataUrl: "game/Build/Farplanter.data.unityweb",
    frameworkUrl: "game/Build/Farplanter.framework.js.unityweb",
    codeUrl: "game/Build/Farplanter.wasm.unityweb",
    streamingAssetsUrl: "game/StreamingAssets",
  });

  // 參考原本 HTML 的 .unity-desktop
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 取原本的 setCanvasSize() 函式：
    function setCanvasSize() {
      const body = document.body;
      const unityDesktop = containerRef.current;
      if (!unityDesktop) return;

      const bodyStyle = getComputedStyle(body);
      const paddingLeftRight =
        parseFloat(bodyStyle.paddingLeft) + parseFloat(bodyStyle.paddingRight);
      const paddingTopBottom =
        parseFloat(bodyStyle.paddingTop) + parseFloat(bodyStyle.paddingBottom);

      const availableWidth = body.clientWidth - paddingLeftRight;
      const availableHeight = body.clientHeight - paddingTopBottom;

      const aspectRatio = 1170 / 2137; // 你的固定比例

      // 根據可用空間動態計算
      if (availableWidth / availableHeight > aspectRatio) {
        // 高度為主
        unityDesktop.style.height = availableHeight + "px";
        unityDesktop.style.width = availableHeight * aspectRatio + "px";
      } else {
        // 寬度為主
        unityDesktop.style.width = availableWidth + "px";
        unityDesktop.style.height = availableWidth / aspectRatio + "px";
      }
    }

    // 監聽視窗resize
    window.addEventListener("resize", setCanvasSize);
    // 首次執行
    setCanvasSize();

    return () => {
      window.removeEventListener("resize", setCanvasSize);
    };
  }, []);

  return (
    <>
      {/* 最外層模仿你原本的 body，禁止捲軸 */}
      <div
        style={{
          background: "#379b5f",
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: 0,
          width: "100dvw",
          height: "100dvh",
          overflow: "hidden", // 不要出現捲軸
        }}
      >
        {/* 此處 ref 就是原本的 .unity-desktop */}
        <div
          ref={containerRef}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            // 預設給個背景，以觀察範圍 (可自行拿掉)
            background: "#379b5f",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {!isLoaded && (
            <div
              style={{
                backgroundColor: "#379b5f",
                position: "absolute",
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#fff",
              }}
            >
              <p>Loading... ({Math.round(loadingProgression * 100)}%)</p>
            </div>
          )}
          {/* Unity 畫面：置滿容器 */}
          <Unity
            unityProvider={unityProvider}
            style={{
              width: "100%",
              height: "100%",
              background: "#379b5f",
            }}
          />
        </div>
      </div>
    </>
  );
}
