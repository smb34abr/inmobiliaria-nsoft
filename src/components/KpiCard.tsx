import React from "react";

type AccentColor = "teal" | "amber" | "blue" | "red";

const barColorMap: Record<AccentColor, string> = {
  teal: "bg-[#249F83]",
  amber: "bg-[#F59E0B]",
  blue: "bg-[#3B82F6]",
  red: "bg-[#EF4444]",
};

interface KpiCardProps {
  label: string;
  value: string | number;
  caption: string;
  accent?: AccentColor;
}

export function KpiCard({
  label,
  value,
  caption,
  accent = "teal",
}: KpiCardProps) {
  return (
    <div className="rounded-xl border border-[#EAECEB] bg-white px-5 py-4">
      <p className="text-xs font-medium text-gray-600">{label}</p>
      <div className="mt-2 flex items-center gap-2.5">
        <span className="text-2xl font-bold tracking-tight text-gray-900">
          {value}
        </span>
        <span
          className={`inline-block h-1 w-3 rounded-full ${barColorMap[accent]}`}
        />
      </div>
      <p className="mt-1.5 text-xs text-gray-400">{caption}</p>
    </div>
  );
}
