"use client";

import React from "react";
import { useLoginWithAbstract } from "@abstract-foundation/agw-react";
import { SyStemButtom } from "@/components/ui/SyStemButtom";
import { AbstractLogo } from "@/components/ui/AbstractLogo";

export function SignInButton() {
  const { login } = useLoginWithAbstract();

  return (
    <SyStemButtom
      onClick={login}
      topColor="bg-[#FDE613]"
      bottomColor="bg-[#DE8316]"
      textColor="text-[#7E2200]"
    >
      <div className="flex items-center justify-center gap-5">
        <AbstractLogo size={50} color="#7E2200" />
        Connect
      </div>
    </SyStemButtom>
  );
}
