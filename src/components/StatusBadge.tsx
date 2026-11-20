import React from "react";

type Tone = "green" | "amber" | "blue" | "red" | "gray";

const toneStyles: Record<Tone, { bg: string; text: string; dot: string }> = {
  green: {
    bg: "bg-[#E6F6EC]",
    text: "text-[#1D7A46]",
    dot: "bg-[#22C55E]",
  },
  amber: {
    bg: "bg-[#FEF3E6]",
    text: "text-[#B45309]",
    dot: "bg-[#F59E0B]",
  },
  blue: {
    bg: "bg-[#E8F3FE]",
    text: "text-[#1D4ED8]",
    dot: "bg-[#3B82F6]",
  },
  red: {
    bg: "bg-[#FEECEB]",
    text: "text-[#B91C1C]",
    dot: "bg-[#EF4444]",
  },
  gray: {
    bg: "bg-[#F3F4F6]",
    text: "text-[#374151]",
    dot: "bg-[#6B7280]",
  },
};

const statusToneMap: Record<string, Tone> = {
  Captado: "blue",
  Publicado: "green",
  Visitado: "amber",
  Oferta: "blue",
  Vendido: "gray",
  Realizada: "green",
  Programada: "amber",
  Cancelada: "red",
  Activo: "green",
  Inactivo: "red",
  Propietario: "blue",
  Comprador: "green",
  Inquilino: "amber",
  Nuevo: "blue",
  Contactado: "amber",
  Interesado: "amber",
  "Visita programada": "blue",
  "Oferta realizada": "green",
  Cerrado: "green",
  Perdido: "red",
};

export function StatusBadge({ label }: { label: string }) {
  const tone = statusToneMap[label] ?? "gray";
  const s = toneStyles[tone];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${s.bg} ${s.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {label}
    </span>
  );
}
