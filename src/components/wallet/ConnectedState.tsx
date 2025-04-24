"use client";

import React from "react";
import { useAccount } from "wagmi";
import { useLoginWithAbstract } from "@abstract-foundation/agw-react";
import { VerifyAndGetTokenButton } from "./SignInWithSignature";
import { SyStemButtom } from "@/components/ui/SyStemButtom";
import { DisconnectIcon } from "@/components/ui/DisconnectIcon";

export function ConnectedState() {
  const { address } = useAccount();
  const { logout } = useLoginWithAbstract();

  if (!address) return null;

  return (
    <>
      {/* Action Buttons */}
      <VerifyAndGetTokenButton />
      <SyStemButtom
        onClick={logout}
        topColor="bg-[#47CC89]"
        bottomColor="bg-[#1A7F6A]"
        textColor="text-[#FFF]"
        leftSlot={<DisconnectIcon size={50} color="#FFF" />}
        rightSlot="Disconnect"
      />
    </>
  );
}
