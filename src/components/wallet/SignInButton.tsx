import React from "react";
import Image from "next/image";
import { useLoginWithAbstract } from "@abstract-foundation/agw-react";

export function SignInButton() {
  const { login } = useLoginWithAbstract();

  return (
    <button
      className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] hover:text-white hover:cursor-pointer dark:hover:bg-[#e0e0e0] dark:hover:text-black text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 font-[family-name:var(--font-roobert)]"
      onClick={login}
    >
      <Image
        className="dark:invert"
        src="/abs.svg"
        alt="Abstract logomark"
        width={20}
        height={20}
        style={{ filter: "brightness(0)" }}
      />
      Sign in with Abstract
    </button>
  );
}
