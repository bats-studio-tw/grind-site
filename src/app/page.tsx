"use client";

import Image from "next/image";
import { useAccount } from "wagmi";
import { ConnectedState } from "@/components/wallet/ConnectedState";
import { SignInButton } from "@/components/wallet/SignInButton";
import { UnityResponsiveLayout } from "@/components/layout/UnityResponsiveLayout";

export default function Home() {
  const { status, address } = useAccount();

  const isLoading = status === "connecting" || status === "reconnecting";

  return (
    <UnityResponsiveLayout aspectRatio={1170 / 2137} isLoading={isLoading}>
      <Image
        src="/home-background.png"
        alt="Loading"
        fill
        className="absolute z-0"
      />
      {!isLoading && (
        <div className="absolute z-10 flex flex-col items-center justify-center inset-0 gap-4">
          {address ? <ConnectedState /> : <SignInButton />}
        </div>
      )}
    </UnityResponsiveLayout>
  );
}
