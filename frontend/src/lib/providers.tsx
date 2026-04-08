"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/lib/auth";
import { ThemeProvider, useTheme } from "@/lib/theme";

function ThemedToaster() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style:
          resolvedTheme === "dark"
            ? {
                background: "#111827",
                color: "#f9fafb",
                borderRadius: "12px",
                border: "1px solid #374151",
                boxShadow:
                  "0 18px 40px -12px rgba(0,0,0,0.35), 0 8px 16px -8px rgba(0,0,0,0.25)",
                padding: "12px 16px",
                fontSize: "14px",
              }
            : {
                background: "white",
                color: "#111827",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                boxShadow:
                  "0 10px 30px -5px rgba(0,0,0,0.1), 0 4px 10px -2px rgba(0,0,0,0.05)",
                padding: "12px 16px",
                fontSize: "14px",
              },
        success: {
          iconTheme: { primary: "#10b981", secondary: "white" },
        },
        error: {
          iconTheme: { primary: "#ef4444", secondary: "white" },
        },
      }}
    />
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      })
  );

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {children}
          <ThemedToaster />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
