"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { useCrm } from "@/context/CrmContext";
import { TopBar } from "@/components/TopBar";
import { KpiCard } from "@/components/KpiCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Modal } from "@/components/Modal";
import { ClientType } from "@/types/crm";

const clientTypes: ClientType[] = ["Propietario", "Comprador", "Inquilino"];

export default function ClientesPage() {
  const { clients, addClient } = useCrm();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("Todos");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [type, setType] = useState<ClientType>("Comprador");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [rfcNif, setRfcNif] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const filtered = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "Todos" || c.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    addClient({
      name: name.trim(),
      type,
      phone: phone.trim(),
      email: email.trim(),
      rfcNif: rfcNif.trim(),
      address: address.trim(),
      notes: notes.trim(),
    });
    setName("");
    setPhone("");
    setEmail("");
    setRfcNif("");
    setAddress("");
    setNotes("");
    setIsModalOpen(false);
  };

  const countByType = (t: ClientType) =>
    clients.filter((c) => c.type === t).length;

  return (
    <div>
      <TopBar
        breadcrumb="Clientes"
        title="Directorio de Clientes"
        subtitle="Administra propietarios, compradores e inquilinos en un solo lugar."
        actionLabel="Nuevo Cliente"
        onAction={() => setIsModalOpen(true)}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total Clientes"
          value={clients.length}
          caption="Base de contactos"
          accent="teal"
        />
        <KpiCard
          label="Propietarios"
          value={countByType("Propietario")}
          caption="Dueños de inmuebles"
          accent="blue"
        />
        <KpiCard
          label="Compradores"
          value={countByType("Comprador")}
          caption="Interesados en compra"
          accent="amber"
        />
        <KpiCard
          label="Inquilinos"
          value={countByType("Inquilino")}
          caption="Interesados en renta"
          accent="teal"
        />
      </div>

      <div className="mt-6 rounded-xl border border-[#EAECEB] bg-white">
        <div className="flex flex-col gap-3 border-b border-[#EAECEB] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, correo o teléfono..."
              className="w-full rounded-lg border border-[#E5E7EB] bg-white py-2 pl-9 pr-3 text-sm text-gray-700 focus:border-[#249F83] focus:outline-none"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-gray-700 focus:border-[#249F83] focus:outline-none"
          >
            <option value="Todos">Todos los perfiles</option>
            {clientTypes.map((t) => (
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
                <th className="px-5 py-3.5">Nombre</th>
                <th className="px-4 py-3.5">Contacto</th>
                <th className="px-4 py-3.5">RFC / NIF</th>
                <th className="px-4 py-3.5">Notas</th>
                <th className="px-5 py-3.5">Tipo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAECEB]">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/70">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-900">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.address || "—"}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-gray-800">{c.phone}</p>
                    <p className="text-xs text-gray-400">{c.email}</p>
                  </td>
                  <td className="px-4 py-3.5 text-gray-600">
                    {c.rfcNif || "—"}
                  </td>
                  <td className="px-4 py-3.5 max-w-xs truncate text-xs text-gray-500">
                    {c.notes || "Sin notas"}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge label={c.type} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registrar nuevo cliente"
        subtitle="Guarda los datos de contacto y perfil."
      >
        <form onSubmit={handleCreate} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#249F83] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Tipo de cliente
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ClientType)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#249F83] focus:outline-none"
              >
                {clientTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
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
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#249F83] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                RFC / NIF
              </label>
              <input
                value={rfcNif}
                onChange={(e) => setRfcNif(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#249F83] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#249F83] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Notas
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
              Guardar Cliente
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
