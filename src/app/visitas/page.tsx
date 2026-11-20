"use client";

import React, { useState } from "react";
import { useCrm } from "@/context/CrmContext";
import { TopBar } from "@/components/TopBar";
import { KpiCard } from "@/components/KpiCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Modal } from "@/components/Modal";

export default function VisitasPage() {
  const { visits, properties, clients, users, addVisit, updateVisitStatus } =
    useCrm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState("2026-11-21 11:00");
  const [propertyId, setPropertyId] = useState(properties[0]?.id ?? "");
  const [clientId, setClientId] = useState(clients[1]?.id ?? clients[0]?.id ?? "");
  const [agentId, setAgentId] = useState(users[2]?.id ?? users[0]?.id ?? "");
  const [result, setResult] = useState("Pendiente de realizar");

  const getPropertyTitle = (id: string) =>
    properties.find((p) => p.id === id)?.title ?? "Inmueble";
  const getClientName = (id: string) =>
    clients.find((c) => c.id === id)?.name ?? "Cliente";
  const getUserName = (id: string) =>
    users.find((u) => u.id === id)?.name ?? "Agente";

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addVisit({
      date,
      propertyId,
      clientId,
      agentId,
      status: "Programada",
      result,
    });
    setIsModalOpen(false);
  };

  return (
    <div>
      <TopBar
        breadcrumb="Visitas"
        title="Control de Visitas"
        subtitle="Programa recorridos con compradores o inquilinos y registra su resultado."
        actionLabel="Programar Visita"
        onAction={() => setIsModalOpen(true)}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard
          label="Total Visitas"
          value={visits.length}
          caption="Visitas registradas"
          accent="teal"
        />
        <KpiCard
          label="Programadas"
          value={visits.filter((v) => v.status === "Programada").length}
          caption="Próximas en agenda"
          accent="amber"
        />
        <KpiCard
          label="Realizadas"
          value={visits.filter((v) => v.status === "Realizada").length}
          caption="Con resultado registrado"
          accent="blue"
        />
      </div>

      <div className="mt-6 rounded-xl border border-[#EAECEB] bg-white overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#EAECEB] bg-[#FAFAFA] text-xs font-medium text-gray-500">
            <tr>
              <th className="px-5 py-3.5">Fecha</th>
              <th className="px-4 py-3.5">Inmueble</th>
              <th className="px-4 py-3.5">Cliente</th>
              <th className="px-4 py-3.5">Agente</th>
              <th className="px-4 py-3.5">Resultado</th>
              <th className="px-4 py-3.5">Estado</th>
              <th className="px-5 py-3.5 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAECEB]">
            {visits.map((v) => (
              <tr key={v.id} className="hover:bg-gray-50/70">
                <td className="px-5 py-3.5 font-medium text-gray-900">
                  {v.date}
                </td>
                <td className="px-4 py-3.5 text-gray-800">
                  {getPropertyTitle(v.propertyId)}
                </td>
                <td className="px-4 py-3.5 text-gray-700">
                  {getClientName(v.clientId)}
                </td>
                <td className="px-4 py-3.5 text-gray-600">
                  {getUserName(v.agentId)}
                </td>
                <td className="px-4 py-3.5 text-xs text-gray-500 max-w-xs">
                  {v.result}
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge label={v.status} />
                </td>
                <td className="px-5 py-3.5 text-right">
                  {v.status === "Programada" && (
                    <button
                      type="button"
                      onClick={() =>
                        updateVisitStatus(
                          v.id,
                          "Realizada",
                          "Visita completada satisfactoriamente."
                        )
                      }
                      className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-medium text-[#249F83] hover:bg-[#E8F6F2]"
                    >
                      Marcar Realizada
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Programar nueva visita"
      >
        <form onSubmit={handleCreate} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Fecha y hora
            </label>
            <input
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#249F83] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Inmueble
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Cliente
              </label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#249F83] focus:outline-none"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Agente
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

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Nota inicial
            </label>
            <input
              value={result}
              onChange={(e) => setResult(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#249F83] focus:outline-none"
            />
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
              Agendar Visita
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
