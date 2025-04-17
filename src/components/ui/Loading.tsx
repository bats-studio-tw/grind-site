"use client";

import Image from "next/image";

interface LoadingProps {
  message?: string;
}

export function Loading({ message }: LoadingProps) {
  return (
    <div className="flex items-center justify-center w-full h-full bg-[#379b5fAA] absolute z-10">
      <div className="flex flex-col items-center gap-2 animate-fade-in">
        <div className="animate-spin">
          <Image src="/abs.svg" alt="Loading" width={24} height={24} />
        </div>
        {message && (
          <p className="text-sm text-white opacity-80 font-[family-name:var(--font-roobert)]">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
