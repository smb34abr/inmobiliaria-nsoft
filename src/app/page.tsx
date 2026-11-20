"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CalendarCheck, MessageSquareText } from "lucide-react";
import { useCrm } from "@/context/CrmContext";
import { TopBar } from "@/components/TopBar";
import { KpiCard } from "@/components/KpiCard";
import { StatusBadge } from "@/components/StatusBadge";

export default function DashboardPage() {
  const { properties, visits, activities, users, clients } = useCrm();

  const totalCaptured = properties.length;
  const availableProperties = properties.filter(
    (p) => p.status !== "Vendido"
  ).length;
  const monthlyVisits = visits.length;
  const monthlySales = properties.filter((p) => p.status === "Vendido").length;

  const agents = users.filter((u) => u.role === "Agente inmobiliario");

  const getUserName = (id: string) =>
    users.find((u) => u.id === id)?.name ?? "Sin asignar";
  const getClientName = (id?: string) =>
    clients.find((c) => c.id === id)?.name ?? "Cliente";
  const getPropertyTitle = (id?: string) =>
    properties.find((p) => p.id === id)?.title ?? "Inmueble";

  return (
    <div>
      <TopBar
        breadcrumb="Dashboard"
        title="Resumen General"
        subtitle="Vista rápida del estado de tus inmuebles, visitas y equipo comercial."
        secondaryAction={
          <Link
            href="/inmuebles"
            className="inline-flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <span>Ver inmuebles</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      {/* 4 KPIs matching MVP Fase 1 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Inmuebles captados"
          value={totalCaptured}
          caption="Total registrado en cartera"
          accent="teal"
        />
        <KpiCard
          label="Inmuebles disponibles"
          value={availableProperties}
          caption="Listos para venta o visita"
          accent="blue"
        />
        <KpiCard
          label="Visitas del mes"
          value={monthlyVisits}
          caption="Programadas y realizadas"
          accent="amber"
        />
        <KpiCard
          label="Ventas del mes"
          value={monthlySales}
          caption="Operaciones cerradas"
          accent="teal"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Captaciones por agente */}
        <div className="rounded-xl border border-[#EAECEB] bg-white p-5">
          <h2 className="text-base font-semibold text-gray-900">
            Captaciones por agente
          </h2>
          <p className="mt-0.5 text-xs text-gray-500">
            Propiedades asignadas actualmente
          </p>

          <div className="mt-4 space-y-4">
            {agents.map((agent) => {
              const count = properties.filter(
                (p) => p.agentId === agent.id
              ).length;
              const pct =
                totalCaptured > 0
                  ? Math.round((count / totalCaptured) * 100)
                  : 0;
              return (
                <div key={agent.id}>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E8F6F2] text-xs font-semibold text-[#249F83]">
                        {agent.avatarInitials}
                      </span>
                      <span className="font-medium text-gray-800">
                        {agent.name}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {count}
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-[#249F83]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Próximas visitas */}
        <div className="rounded-xl border border-[#EAECEB] bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Visitas recientes
              </h2>
              <p className="mt-0.5 text-xs text-gray-500">
                Agenda y resultados
              </p>
            </div>
            <Link
              href="/visitas"
              className="text-xs font-medium text-[#249F83] hover:underline"
            >
              Ver todas
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {visits.slice(0, 4).map((v) => (
              <div
                key={v.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-gray-100 p-3"
              >
                <div className="flex items-start gap-2.5">
                  <CalendarCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#249F83]" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {getPropertyTitle(v.propertyId)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {getClientName(v.clientId)} · {v.date}
                    </p>
                  </div>
                </div>
                <StatusBadge label={v.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Últimas actividades */}
        <div className="rounded-xl border border-[#EAECEB] bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Actividad reciente
              </h2>
              <p className="mt-0.5 text-xs text-gray-500">
                Seguimiento del equipo
              </p>
            </div>
            <Link
              href="/actividades"
              className="text-xs font-medium text-[#249F83] hover:underline"
            >
              Ver todas
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {activities.slice(0, 4).map((act) => (
              <div
                key={act.id}
                className="flex items-start gap-2.5 rounded-lg border border-gray-100 p-3"
              >
                <MessageSquareText className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-800">
                    {act.type} · {getUserName(act.agentId)}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-gray-500">
                    {act.notes}
                  </p>
                  <p className="mt-1 text-[11px] text-gray-400">{act.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
