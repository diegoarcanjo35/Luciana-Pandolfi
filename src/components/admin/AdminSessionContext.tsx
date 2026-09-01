"use client";

import { createContext, useContext } from "react";

export interface AdminSession {
  role: "superadmin" | "admin";
  name: string;
  isLegacy: boolean;
  mustChangePassword: boolean;
}

export const AdminSessionContext = createContext<AdminSession | null>(null);

export function useAdminSession(): AdminSession {
  const ctx = useContext(AdminSessionContext);
  if (!ctx) throw new Error("useAdminSession usado fora do AdminSessionContext.");
  return ctx;
}
