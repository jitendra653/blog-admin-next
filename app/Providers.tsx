"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import React from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  return <SessionProvider>{children}</SessionProvider>;
};
