import type { Metadata } from "next";
import "./globals.css";
import { CrmProvider } from "@/context/CrmContext";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Inmobiliaria Nsoft — CRM Inmobiliario",
  description:
    "CRM inmobiliario simple e intuitivo: inmuebles, clientes, actividades, visitas y pipeline de ventas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-white text-gray-900">
        <CrmProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 min-w-0 bg-white px-6 py-5 lg:px-10 lg:py-6">
              {children}
            </main>
          </div>
        </CrmProvider>
      </body>
    </html>
  );
}
