"use client";

import React, { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useCrm } from "@/context/CrmContext";
import { TopBar } from "@/components/TopBar";
import { KpiCard } from "@/components/KpiCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Modal } from "@/components/Modal";
import { Property, PropertyStatus, PropertyType } from "@/types/crm";

const propertyStatuses: PropertyStatus[] = [
  "Captado",
  "Publicado",
  "Visitado",
  "Oferta",
  "Vendido",
];

const propertyTypes: PropertyType[] = [
  "Casa",
  "Departamento",
  "Terreno",
  "Local comercial",
  "Oficina",
];

export default function InmueblesPage() {
  const {
    properties,
    users,
    clients,
    addProperty,
    updatePropertyStatus,
  } = useCrm();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Todos");
  const [typeFilter, setTypeFilter] = useState<string>("Todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );

  // Form state for new property capture
  const [title, setTitle] = useState("");
  const [type, setType] = useState<PropertyType>("Casa");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [agentId, setAgentId] = useState(users[2]?.id ?? users[0]?.id ?? "");
  const [ownerId, setOwnerId] = useState(clients[0]?.id ?? "");
  const [description, setDescription] = useState("");

  const filtered = properties.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.address.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "Todos" || p.status === statusFilter;
    const matchesType = typeFilter === "Todos" || p.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getAgent = (id: string) => users.find((u) => u.id === id);
  const getOwner = (id: string) => clients.find((c) => c.id === id);

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    }).format(amount);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !address.trim() || !price) return;

    addProperty({
      title: title.trim(),
      type,
      address: address.trim(),
      price: Number(price),
      status: "Captado",
      photoUrl:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&q=80",
      description: description.trim() || "Propiedad captada recientemente.",
      agentId,
      ownerId,
    });

    setTitle("");
    setAddress("");
    setPrice("");
    setDescription("");
    setIsModalOpen(false);
  };

  const countByStatus = (s: PropertyStatus) =>
    properties.filter((p) => p.status === s).length;

  return (
    <div>
      <TopBar
        breadcrumb="Inmuebles"
        title="Lista de Inmuebles"
        subtitle="Aquí puedes consultar, captar y actualizar el estado de todas tus propiedades."
        actionLabel="Captar Inmueble"
        onAction={() => setIsModalOpen(true)}
      />

      {/* 4 KPI cards matching diseño.png */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total Inmuebles"
          value={properties.length}
          caption="Cartera total registrada"
          accent="teal"
        />
        <KpiCard
          label="Publicados"
          value={countByStatus("Publicado")}
          caption="Activos en promoción"
          accent="amber"
        />
        <KpiCard
          label="En Oferta"
          value={countByStatus("Oferta")}
          caption="Con propuesta activa"
          accent="blue"
        />
        <KpiCard
          label="Vendidos"
          value={countByStatus("Vendido")}
          caption="Operaciones cerradas"
          accent="red"
        />
      </div>

      {/* Main Table Card matching diseño.png */}
      <div className="mt-6 rounded-xl border border-[#EAECEB] bg-white">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-[#EAECEB] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, dirección o ID..."
              className="w-full rounded-lg border border-[#E5E7EB] bg-white py-2 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#249F83] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-gray-700 focus:border-[#249F83] focus:outline-none"
            >
              <option value="Todos">Todos los estados</option>
              {propertyStatuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <div className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-gray-700">
              <SlidersHorizontal className="h-3.5 w-3.5 text-gray-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-transparent focus:outline-none"
              >
                <option value="Todos">Todos los tipos</option>
                {propertyTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#EAECEB] bg-[#FAFAFA] text-xs font-medium text-gray-500">
              <tr>
                <th className="px-5 py-3.5">Inmueble</th>
                <th className="px-4 py-3.5">Agente</th>
                <th className="px-4 py-3.5">Código</th>
                <th className="px-4 py-3.5">Precio</th>
                <th className="px-4 py-3.5">Estado</th>
                <th className="px-5 py-3.5 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAECEB]">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-sm text-gray-500"
                  >
                    No se encontraron inmuebles con esos filtros.
                  </td>
                </tr>
              ) : (
                filtered.map((prop) => {
                  const agent = getAgent(prop.agentId);
                  return (
                    <tr
                      key={prop.id}
                      className="transition-colors hover:bg-gray-50/70"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={prop.photoUrl}
                            alt={prop.title}
                            className="h-10 w-10 rounded-lg object-cover border border-gray-100"
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              {prop.title}
                            </p>
                            <p className="text-xs text-gray-400">
                              {prop.type} · {prop.address}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E8F6F2] text-xs font-semibold text-[#249F83]">
                            {agent?.avatarInitials ?? "AG"}
                          </span>
                          <div>
                            <p className="font-medium text-gray-800">
                              {agent?.name ?? "Sin asignar"}
                            </p>
                            <p className="text-xs text-gray-400">
                              {agent?.role ?? "Agente"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-gray-800">{prop.code}</p>
                        <p className="text-xs text-gray-400">
                          {prop.capturedAt}
                        </p>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-gray-900">
                          {formatPrice(prop.price)}
                        </p>
                        <p className="text-xs text-gray-400">Venta</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge label={prop.status} />
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedProperty(prop)}
                          className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Detalles
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Captar Inmueble */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Captar nuevo inmueble"
        subtitle="Registra los datos básicos para iniciar el seguimiento."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Título del inmueble
            </label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Casa Jardines del Pedregal"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#249F83] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as PropertyType)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#249F83] focus:outline-none"
              >
                {propertyTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Precio (MXN)
              </label>
              <input
                required
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="4500000"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#249F83] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Dirección
            </label>
            <input
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Calle, número y colonia"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#249F83] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Agente responsable
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
                Propietario
              </label>
              <select
                value={ownerId}
                onChange={(e) => setOwnerId(e.target.value)}
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
              Descripción
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Características principales, metros, recámaras..."
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
              Guardar Captación
            </button>
          </div>
        </form>
      </Modal>

      {/* Drawer: Detalles del inmueble */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
          <div className="h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-medium text-[#249F83]">
                  {selectedProperty.code}
                </span>
                <h2 className="mt-1 text-lg font-bold text-gray-900">
                  {selectedProperty.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProperty(null)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <img
              src={selectedProperty.photoUrl}
              alt={selectedProperty.title}
              className="mt-4 h-44 w-full rounded-xl object-cover border border-gray-100"
            />

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Precio</span>
                <span className="font-semibold text-gray-900">
                  {formatPrice(selectedProperty.price)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tipo</span>
                <span className="font-medium text-gray-800">
                  {selectedProperty.type}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Dirección</span>
                <span className="font-medium text-gray-800 text-right">
                  {selectedProperty.address}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Propietario</span>
                <span className="font-medium text-gray-800">
                  {getOwner(selectedProperty.ownerId)?.name ?? "No registrado"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Agente</span>
                <span className="font-medium text-gray-800">
                  {getAgent(selectedProperty.agentId)?.name ?? "Sin asignar"}
                </span>
              </div>
            </div>

            <div className="mt-5 border-t border-gray-100 pt-4">
              <p className="text-xs font-medium text-gray-500 mb-1">
                Descripción
              </p>
              <p className="text-sm text-gray-700">
                {selectedProperty.description}
              </p>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-4">
              <p className="text-xs font-medium text-gray-500 mb-2">
                Cambiar estado del inmueble
              </p>
              <div className="flex flex-wrap gap-2">
                {propertyStatuses.map((st) => {
                  const active = selectedProperty.status === st;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        updatePropertyStatus(selectedProperty.id, st);
                        setSelectedProperty({
                          ...selectedProperty,
                          status: st,
                        });
                      }}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors ${
                        active
                          ? "border-[#249F83] bg-[#E8F6F2] text-[#249F83]"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {st}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
