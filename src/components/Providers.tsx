"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import NextAbstractWalletProvider from "@/components/NextAbstractWalletProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextAbstractWalletProvider>
      <Provider store={store}>{children}</Provider>
    </NextAbstractWalletProvider>
  );
}
