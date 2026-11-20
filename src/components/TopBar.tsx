"use client";

import React from "react";
import Link from "next/link";
import { Home, Plus } from "lucide-react";

interface TopBarProps {
  breadcrumb: string;
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryAction?: React.ReactNode;
}

export function TopBar({
  breadcrumb,
  title,
  subtitle,
  actionLabel,
  onAction,
  secondaryAction,
}: TopBarProps) {
  return (
    <div className="mb-6">
      {/* Breadcrumb matching diseño.png */}
      <div className="mb-4 flex items-center gap-2 text-sm text-gray-400">
        <Link href="/" className="hover:text-gray-600 transition-colors">
          <Home className="h-4 w-4" />
        </Link>
        <span>/</span>
        <span className="font-medium text-[#249F83]">{breadcrumb}</span>
      </div>

      {/* Header row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {title}
          </h1>
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2.5">
          {actionLabel && onAction && (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center gap-2 rounded-lg bg-[#249F83] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#1E876F]"
            >
              <Plus className="h-4 w-4" />
              <span>{actionLabel}</span>
            </button>
          )}
          {secondaryAction}
        </div>
      </div>
    </div>
  );
}
