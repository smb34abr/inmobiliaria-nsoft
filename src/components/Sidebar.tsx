"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  CalendarCheck,
  ChevronDown,
  ChevronRight,
  GitBranch,
  Home,
  MessageSquareText,
  Search,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useCrm } from "@/context/CrmContext";

export function Sidebar() {
  const pathname = usePathname();
  const { agencyName } = useCrm();
  const [groupOpen, setGroupOpen] = useState(true);
  const [quickQuery, setQuickQuery] = useState("");

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const mainLinks = [
    { href: "/", label: "Dashboard", icon: Home },
  ];

  const inmobiliariaLinks = [
    { href: "/inmuebles", label: "Inmuebles", icon: Building2 },
    { href: "/clientes", label: "Clientes", icon: Users },
    { href: "/pipeline", label: "Pipeline", icon: GitBranch },
  ];

  const operationalLinks = [
    { href: "/actividades", label: "Actividades", icon: MessageSquareText },
    { href: "/visitas", label: "Visitas", icon: CalendarCheck },
  ];

  const adminLinks = [
    { href: "/usuarios", label: "Usuarios", icon: ShieldCheck },
    { href: "/configuracion", label: "Configuración", icon: Settings },
  ];

  const allNavItems = [
    ...mainLinks,
    ...inmobiliariaLinks,
    ...operationalLinks,
    ...adminLinks,
  ];

  const filteredItems = quickQuery.trim()
    ? allNavItems.filter((item) =>
        item.label.toLowerCase().includes(quickQuery.toLowerCase())
      )
    : null;

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col border-r border-[#EAECEB] bg-[#F7F8F7] px-4 py-5 select-none">
      {/* Brand */}
      <Link href="/" className="flex items-center gap-2.5 px-2 mb-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#249F83] text-white shadow-sm">
          <Building2 className="h-4 w-4" />
        </div>
        <span className="text-lg font-bold tracking-tight text-gray-900">
          {agencyName}
        </span>
      </Link>

      {/* Search bar matching diseño.png */}
      <div className="relative mb-6">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={quickQuery}
          onChange={(e) => setQuickQuery(e.target.value)}
          placeholder="Buscar módulo..."
          className="w-full rounded-lg border border-[#E5E7EB] bg-white py-2 pl-9 pr-12 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#249F83] focus:outline-none"
        />
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[11px] font-medium text-gray-400">
          ⌘ S
        </span>
      </div>

      {filteredItems ? (
        <div className="space-y-1">
          <p className="px-2 pb-1 text-xs font-medium text-gray-400">
            Resultados
          </p>
          {filteredItems.length === 0 ? (
            <p className="px-2 py-2 text-xs text-gray-500">Sin coincidencias</p>
          ) : (
            filteredItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setQuickQuery("")}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive(item.href)
                      ? "bg-[#ECEEED] font-semibold text-gray-900"
                      : "text-gray-600 hover:bg-[#EFEFEF] hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-4 w-4 text-gray-500" />
                  <span>{item.label}</span>
                </Link>
              );
            })
          )}
        </div>
      ) : (
        <nav className="flex-1 space-y-6">
          {/* Main Menu */}
          <div>
            <p className="px-2 pb-2 text-xs font-medium text-gray-400">
              Menú Principal
            </p>
            <div className="space-y-1">
              {mainLinks.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                      active
                        ? "bg-[#ECEEED] font-semibold text-gray-900"
                        : "text-gray-600 hover:bg-[#EFEFEF] hover:text-gray-900"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${
                        active ? "text-[#249F83]" : "text-gray-500"
                      }`}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* Collapsible Group: Inmobiliaria (like "My Shop" in diseño.png) */}
              <div>
                <button
                  type="button"
                  onClick={() => setGroupOpen((v) => !v)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-[#EFEFEF]"
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    <Building2 className="h-4 w-4 text-[#249F83]" />
                    <span>Inmobiliaria</span>
                  </span>
                  {groupOpen ? (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  )}
                </button>

                {groupOpen && (
                  <div className="mt-1 ml-4 space-y-1 border-l border-gray-200 pl-3">
                    {inmobiliariaLinks.map((item) => {
                      const active = isActive(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`block rounded-lg px-3 py-1.5 text-sm transition-colors ${
                            active
                              ? "bg-[#ECEEED] font-semibold text-gray-900"
                              : "text-gray-600 hover:bg-[#EFEFEF] hover:text-gray-900"
                          }`}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {operationalLinks.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                      active
                        ? "bg-[#ECEEED] font-semibold text-gray-900"
                        : "text-gray-600 hover:bg-[#EFEFEF] hover:text-gray-900"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${
                        active ? "text-[#249F83]" : "text-gray-500"
                      }`}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Others */}
          <div>
            <p className="px-2 pb-2 text-xs font-medium text-gray-400">
              Administración
            </p>
            <div className="space-y-1">
              {adminLinks.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                      active
                        ? "bg-[#ECEEED] font-semibold text-gray-900"
                        : "text-gray-600 hover:bg-[#EFEFEF] hover:text-gray-900"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${
                        active ? "text-[#249F83]" : "text-gray-500"
                      }`}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      )}
    </aside>
  );
}
