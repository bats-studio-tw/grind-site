"use client";

import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { UnityResponsiveLayout } from "@/components/layout/UnityResponsiveLayout";
export default function PlayPage() {
  const { unityProvider, isLoaded, loadingProgression } = useUnityContext({
    loaderUrl: "game/Build/Farplanter.loader.js",
    dataUrl: "game/Build/Farplanter.data.unityweb",
    frameworkUrl: "game/Build/Farplanter.framework.js.unityweb",
    codeUrl: "game/Build/Farplanter.wasm.unityweb",
    streamingAssetsUrl: "game/StreamingAssets",
  });

  return (
    <UnityResponsiveLayout
      aspectRatio={1170 / 2137}
      isLoading={!isLoaded}
      loadingMessage={`Loading... ${Math.round(loadingProgression * 100)}%`}
    >
      {/* Unity 畫面：置滿容器 */}
      <Unity
        unityProvider={unityProvider}
        style={{
          width: "100%",
          height: "100%",
          background: "#379b5f",
        }}
      />
    </UnityResponsiveLayout>
  );
}
