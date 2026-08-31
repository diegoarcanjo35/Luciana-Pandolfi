import type { Metadata } from "next";
import AdminLayoutClient from "./AdminLayoutClient";

export const metadata: Metadata = {
  title: "Painel administrativo",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
