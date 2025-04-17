"use client";

import React, { useEffect, useRef, PropsWithChildren } from "react";

import { Loading } from "@/components/ui/Loading";

interface UnityResponsiveLayoutProps {
  aspectRatio: number; // 寬 / 高，例如 1170 / 2137
  isLoading?: boolean; // 是否正在載入
  loadingMessage?: string; // 載入中的訊息
}

export function UnityResponsiveLayout({
  aspectRatio,
  isLoading,
  loadingMessage,
  children,
}: PropsWithChildren<UnityResponsiveLayoutProps>) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

      if (availableWidth / availableHeight > aspectRatio) {
        // 高度優先
        unityDesktop.style.height = availableHeight + "px";
        unityDesktop.style.width = availableHeight * aspectRatio + "px";
      } else {
        // 寬度優先
        unityDesktop.style.width = availableWidth + "px";
        unityDesktop.style.height = availableWidth / aspectRatio + "px";
      }
    }

    window.addEventListener("resize", setCanvasSize);
    setCanvasSize();
    return () => {
      window.removeEventListener("resize", setCanvasSize);
    };
  }, [aspectRatio]);

  return (
    <div className="bg-[#379b5f] flex justify-center items-center m-0 w-[100dvw] h-[100dvh] overflow-hidden">
      <div
        ref={containerRef}
        className="absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] flex justify-center items-center bg-[#379b5f]"
      >
        {isLoading && <Loading message={loadingMessage} />}
        <div className="absolute inset-0 z-0 flex items-center justify-center ">
          {children}
        </div>
      </div>
    </div>
  );
}
