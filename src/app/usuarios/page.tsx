"use client";

import React, { useState } from "react";
import { useCrm } from "@/context/CrmContext";
import { TopBar } from "@/components/TopBar";
import { StatusBadge } from "@/components/StatusBadge";
import { Modal } from "@/components/Modal";
import { UserRole } from "@/types/crm";

const roles: UserRole[] = ["Administrador", "Gerente", "Agente inmobiliario"];

export default function UsuariosPage() {
  const { users, addUser, toggleUserActive } = useCrm();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<UserRole>("Agente inmobiliario");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    addUser({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role,
      active: true,
    });
    setName("");
    setEmail("");
    setPhone("");
    setIsModalOpen(false);
  };

  return (
    <div>
      <TopBar
        breadcrumb="Usuarios"
        title="Equipo y Roles"
        subtitle="Gestiona administradores, gerentes y agentes inmobiliarios."
        actionLabel="Nuevo Usuario"
        onAction={() => setIsModalOpen(true)}
      />

      <div className="rounded-xl border border-[#EAECEB] bg-white overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#EAECEB] bg-[#FAFAFA] text-xs font-medium text-gray-500">
            <tr>
              <th className="px-5 py-3.5">Usuario</th>
              <th className="px-4 py-3.5">Teléfono</th>
              <th className="px-4 py-3.5">Rol</th>
              <th className="px-4 py-3.5">Estado</th>
              <th className="px-5 py-3.5 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAECEB]">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50/70">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8F6F2] text-xs font-semibold text-[#249F83]">
                      {u.avatarInitials}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{u.name}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-gray-600">{u.phone || "—"}</td>
                <td className="px-4 py-3.5 font-medium text-gray-800">
                  {u.role}
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge label={u.active ? "Activo" : "Inactivo"} />
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    type="button"
                    onClick={() => toggleUserActive(u.id)}
                    className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    {u.active ? "Desactivar" : "Activar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Agregar miembro del equipo"
      >
        <form onSubmit={handleCreate} className="space-y-3.5">
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Correo
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#249F83] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#249F83] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Rol
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#249F83] focus:outline-none"
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
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
              Guardar Usuario
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
