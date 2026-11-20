"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { useCrm } from "@/context/CrmContext";
import { TopBar } from "@/components/TopBar";
import { Modal } from "@/components/Modal";
import { ActivityType } from "@/types/crm";

const activityTypes: ActivityType[] = [
  "Llamada",
  "WhatsApp",
  "Correo",
  "Reunión",
  "Visita",
];

export default function ActividadesPage() {
  const { activities, users, clients, properties, addActivity } = useCrm();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [type, setType] = useState<ActivityType>("Llamada");
  const [date, setDate] = useState("2026-11-20 12:00");
  const [agentId, setAgentId] = useState(users[2]?.id ?? users[0]?.id ?? "");
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [propertyId, setPropertyId] = useState(properties[0]?.id ?? "");
  const [notes, setNotes] = useState("");

  const getUserName = (id: string) =>
    users.find((u) => u.id === id)?.name ?? "Agente";
  const getClientName = (id?: string) =>
    clients.find((c) => c.id === id)?.name ?? "—";
  const getPropertyTitle = (id?: string) =>
    properties.find((p) => p.id === id)?.title ?? "—";

  const filtered = activities.filter((a) => {
    const matchesSearch = a.notes
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesType = typeFilter === "Todos" || a.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;
    addActivity({
      type,
      date,
      agentId,
      clientId: clientId || undefined,
      propertyId: propertyId || undefined,
      notes: notes.trim(),
    });
    setNotes("");
    setIsModalOpen(false);
  };

  return (
    <div>
      <TopBar
        breadcrumb="Actividades"
        title="Bitácora de Actividades"
        subtitle="Registra llamadas, mensajes de WhatsApp, correos y reuniones con clientes."
        actionLabel="Registrar Actividad"
        onAction={() => setIsModalOpen(true)}
      />

      <div className="rounded-xl border border-[#EAECEB] bg-white">
        <div className="flex flex-col gap-3 border-b border-[#EAECEB] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar en observaciones..."
              className="w-full rounded-lg border border-[#E5E7EB] bg-white py-2 pl-9 pr-3 text-sm focus:border-[#249F83] focus:outline-none"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-gray-700 focus:border-[#249F83] focus:outline-none"
          >
            <option value="Todos">Todos los tipos</option>
            {activityTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#EAECEB] bg-[#FAFAFA] text-xs font-medium text-gray-500">
              <tr>
                <th className="px-5 py-3.5">Tipo</th>
                <th className="px-4 py-3.5">Fecha</th>
                <th className="px-4 py-3.5">Responsable</th>
                <th className="px-4 py-3.5">Cliente / Inmueble</th>
                <th className="px-5 py-3.5">Observaciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAECEB]">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50/70">
                  <td className="px-5 py-3.5 font-medium text-gray-900">
                    {a.type}
                  </td>
                  <td className="px-4 py-3.5 text-gray-500">{a.date}</td>
                  <td className="px-4 py-3.5 text-gray-800">
                    {getUserName(a.agentId)}
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-gray-800">{getClientName(a.clientId)}</p>
                    <p className="text-xs text-gray-400">
                      {getPropertyTitle(a.propertyId)}
                    </p>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600">{a.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registrar actividad comercial"
      >
        <form onSubmit={handleCreate} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Tipo de actividad
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ActivityType)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#249F83] focus:outline-none"
              >
                {activityTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Fecha y hora
              </label>
              <input
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#249F83] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Responsable
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
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Inmueble relacionado
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
              Observaciones
            </label>
            <textarea
              required
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Resumen de la llamada, acuerdos o siguientes pasos..."
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
              Guardar Actividad
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
