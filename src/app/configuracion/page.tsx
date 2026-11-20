"use client";

import React, { useState } from "react";
import { RotateCcw, Check } from "lucide-react";
import { useCrm } from "@/context/CrmContext";
import { TopBar } from "@/components/TopBar";

export default function ConfiguracionPage() {
  const { agencyName, setAgencyName, resetDemoData } = useCrm();
  const [nameInput, setNameInput] = useState(agencyName);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    setAgencyName(nameInput.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <TopBar
        breadcrumb="Configuración"
        title="Configuración de la Inmobiliaria"
        subtitle="Personaliza el nombre de tu agencia o restablece los datos de demostración."
      />

      <div className="max-w-xl space-y-6">
        <form
          onSubmit={handleSave}
          className="rounded-xl border border-[#EAECEB] bg-white p-6 space-y-4"
        >
          <h2 className="text-base font-semibold text-gray-900">
            Identidad de la aplicación
          </h2>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Nombre visible en la barra lateral
            </label>
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#249F83] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-[#249F83] px-4 py-2 text-sm font-medium text-white hover:bg-[#1E876F]"
          >
            {saved ? <Check className="h-4 w-4" /> : null}
            <span>{saved ? "Guardado" : "Guardar cambios"}</span>
          </button>
        </form>

        <div className="rounded-xl border border-[#EAECEB] bg-white p-6">
          <h2 className="text-base font-semibold text-gray-900">
            Datos de demostración
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Todos los registros que crees se guardan en tu navegador. Si quieres
            volver al estado inicial de ejemplo, usa este botón.
          </p>
          <button
            type="button"
            onClick={resetDemoData}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Restablecer datos de ejemplo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
