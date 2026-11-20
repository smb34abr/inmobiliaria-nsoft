"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useCrm } from "@/context/CrmContext";
import { TopBar } from "@/components/TopBar";
import { StatusBadge } from "@/components/StatusBadge";
import { Modal } from "@/components/Modal";
import { LeadOrigin, LeadStage } from "@/types/crm";

const stages: LeadStage[] = [
  "Nuevo",
  "Contactado",
  "Interesado",
  "Visita programada",
  "Oferta realizada",
  "Cerrado",
];

const origins: LeadOrigin[] = [
  "Portal inmobiliario",
  "Facebook",
  "Instagram",
  "Referido",
  "Página web",
  "Llamada directa",
];

export default function PipelinePage() {
  const { leads, properties, users, addLead, updateLeadStage } = useCrm();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [clientName, setClientName] = useState("");
  const [phone, setPhone] = useState("");
  const [origin, setOrigin] = useState<LeadOrigin>("Portal inmobiliario");
  const [propertyId, setPropertyId] = useState(properties[0]?.id ?? "");
  const [agentId, setAgentId] = useState(users[2]?.id ?? users[0]?.id ?? "");
  const [estimatedValue, setEstimatedValue] = useState("4500000");

  const getPropertyTitle = (id: string) =>
    properties.find((p) => p.id === id)?.title ?? "Inmueble";
  const getAgentName = (id: string) =>
    users.find((u) => u.id === id)?.name ?? "Agente";

  const formatPrice = (v: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    }).format(v);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;
    addLead({
      clientName: clientName.trim(),
      phone: phone.trim(),
      origin,
      propertyId,
      agentId,
      stage: "Nuevo",
      estimatedValue: Number(estimatedValue) || 0,
    });
    setClientName("");
    setPhone("");
    setIsModalOpen(false);
  };

  const advanceStage = (id: string, current: LeadStage) => {
    const idx = stages.indexOf(current);
    if (idx >= 0 && idx < stages.length - 1) {
      updateLeadStage(id, stages[idx + 1]);
    }
  };

  return (
    <div>
      <TopBar
        breadcrumb="Pipeline"
        title="Pipeline de Ventas"
        subtitle="Visualiza y avanza cada oportunidad comercial desde el primer contacto hasta el cierre."
        actionLabel="Nuevo Prospecto"
        onAction={() => setIsModalOpen(true)}
      />

      {/* 2 filas x 3 columnas Kanban grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stages.map((stage) => {
          const stageLeads = leads.filter((l) => l.stage === stage);
          return (
            <div
              key={stage}
              className="rounded-xl border border-[#EAECEB] bg-[#F7F8F7] p-3.5"
            >
              <div className="mb-3 flex items-center justify-between">
                <StatusBadge label={stage} />
                <span className="text-xs font-semibold text-gray-500">
                  {stageLeads.length}
                </span>
              </div>

              <div className="space-y-3">
                {stageLeads.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-gray-200 bg-white/60 p-4 text-center text-xs text-gray-400">
                    Sin prospectos en esta etapa
                  </p>
                ) : (
                  stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="rounded-lg border border-[#EAECEB] bg-white p-3.5 shadow-2xs"
                    >
                      <p className="font-semibold text-sm text-gray-900">
                        {lead.clientName}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {getPropertyTitle(lead.propertyId)}
                      </p>

                      <div className="mt-2.5 flex items-center justify-between text-xs">
                        <span className="font-semibold text-gray-800">
                          {formatPrice(lead.estimatedValue)}
                        </span>
                        <span className="text-gray-400">{lead.origin}</span>
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2.5">
                        <span className="text-[11px] text-gray-400">
                          {getAgentName(lead.agentId)}
                        </span>

                        {stage !== "Cerrado" && (
                          <button
                            type="button"
                            onClick={() => advanceStage(lead.id, stage)}
                            className="inline-flex items-center gap-1 rounded-md bg-[#E8F6F2] px-2 py-1 text-[11px] font-medium text-[#249F83] hover:bg-[#d5efe8]"
                          >
                            <span>Avanzar</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Agregar prospecto al pipeline"
        subtitle="Registra un nuevo interesado y su inmueble."
      >
        <form onSubmit={handleCreate} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Nombre del prospecto
              </label>
              <input
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#249F83] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#249F83] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Origen
              </label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value as LeadOrigin)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#249F83] focus:outline-none"
              >
                {origins.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Valor estimado (MXN)
              </label>
              <input
                type="number"
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#249F83] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Inmueble de interés
              </label>
              <select
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#249F83] focus:outline-none"
              >
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Agente asignado
              </label>
              <select
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#249F83] focus:outline-none"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#249F83] px-4 py-2 text-sm font-medium text-white hover:bg-[#1E876F]"
            >
              Agregar al Pipeline
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
