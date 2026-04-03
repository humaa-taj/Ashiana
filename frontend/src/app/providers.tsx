"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, localStorageManager } from "@chakra-ui/react";
import theme from "./theme/theme";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme} colorModeManager={localStorageManager}>
        {children}
      </ChakraProvider>
    </CacheProvider>
  );
}