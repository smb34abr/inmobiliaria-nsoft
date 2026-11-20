"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  Activity,
  Client,
  LeadStage,
  PipelineLead,
  Property,
  PropertyStatus,
  User,
  Visit,
  VisitStatus,
} from "@/types/crm";
import {
  initialActivities,
  initialClients,
  initialLeads,
  initialProperties,
  initialUsers,
  initialVisits,
} from "@/data/mockData";

interface CrmState {
  users: User[];
  clients: Client[];
  properties: Property[];
  activities: Activity[];
  visits: Visit[];
  leads: PipelineLead[];
  agencyName: string;
}

interface CrmContextValue extends CrmState {
  addUser: (user: Omit<User, "id" | "avatarInitials" | "joinedAt">) => void;
  toggleUserActive: (id: string) => void;
  addClient: (client: Omit<Client, "id" | "createdAt">) => void;
  addProperty: (property: Omit<Property, "id" | "code" | "capturedAt">) => void;
  updatePropertyStatus: (id: string, status: PropertyStatus) => void;
  addActivity: (activity: Omit<Activity, "id">) => void;
  addVisit: (visit: Omit<Visit, "id">) => void;
  updateVisitStatus: (id: string, status: VisitStatus, result?: string) => void;
  addLead: (lead: Omit<PipelineLead, "id" | "updatedAt">) => void;
  updateLeadStage: (id: string, stage: LeadStage) => void;
  setAgencyName: (name: string) => void;
  resetDemoData: () => void;
}

const STORAGE_KEY = "inmocrm_mvp_state_v1";

const defaultState: CrmState = {
  users: initialUsers,
  clients: initialClients,
  properties: initialProperties,
  activities: initialActivities,
  visits: initialVisits,
  leads: initialLeads,
  agencyName: "Inmobiliaria Nsoft",
};

const CrmContext = createContext<CrmContextValue | null>(null);

export function CrmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CrmState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setState(JSON.parse(saved));
      }
    } catch {
      // Fallback to defaultState if localStorage is unavailable or corrupt
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state, hydrated]);

  const today = () => new Date().toISOString().slice(0, 10);

  const addUser: CrmContextValue["addUser"] = (user) => {
    const parts = user.name.trim().split(/\s+/);
    const initials = parts
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("");
    setState((prev) => ({
      ...prev,
      users: [
        {
          ...user,
          id: `u-${Date.now()}`,
          avatarInitials: initials || "US",
          joinedAt: today(),
        },
        ...prev.users,
      ],
    }));
  };

  const toggleUserActive: CrmContextValue["toggleUserActive"] = (id) => {
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id === id ? { ...u, active: !u.active } : u
      ),
    }));
  };

  const addClient: CrmContextValue["addClient"] = (client) => {
    setState((prev) => ({
      ...prev,
      clients: [
        { ...client, id: `c-${Date.now()}`, createdAt: today() },
        ...prev.clients,
      ],
    }));
  };

  const addProperty: CrmContextValue["addProperty"] = (property) => {
    setState((prev) => ({
      ...prev,
      properties: [
        {
          ...property,
          id: `p-${Date.now()}`,
          code: `#INM-${1040 + prev.properties.length + 1}`,
          capturedAt: today(),
        },
        ...prev.properties,
      ],
    }));
  };

  const updatePropertyStatus: CrmContextValue["updatePropertyStatus"] = (
    id,
    status
  ) => {
    setState((prev) => ({
      ...prev,
      properties: prev.properties.map((p) =>
        p.id === id ? { ...p, status } : p
      ),
    }));
  };

  const addActivity: CrmContextValue["addActivity"] = (activity) => {
    setState((prev) => ({
      ...prev,
      activities: [{ ...activity, id: `a-${Date.now()}` }, ...prev.activities],
    }));
  };

  const addVisit: CrmContextValue["addVisit"] = (visit) => {
    setState((prev) => ({
      ...prev,
      visits: [{ ...visit, id: `v-${Date.now()}` }, ...prev.visits],
    }));
  };

  const updateVisitStatus: CrmContextValue["updateVisitStatus"] = (
    id,
    status,
    result
  ) => {
    setState((prev) => ({
      ...prev,
      visits: prev.visits.map((v) =>
        v.id === id
          ? { ...v, status, result: result !== undefined ? result : v.result }
          : v
      ),
    }));
  };

  const addLead: CrmContextValue["addLead"] = (lead) => {
    setState((prev) => ({
      ...prev,
      leads: [
        { ...lead, id: `l-${Date.now()}`, updatedAt: today() },
        ...prev.leads,
      ],
    }));
  };

  const updateLeadStage: CrmContextValue["updateLeadStage"] = (id, stage) => {
    setState((prev) => ({
      ...prev,
      leads: prev.leads.map((l) =>
        l.id === id ? { ...l, stage, updatedAt: today() } : l
      ),
    }));
  };

  const setAgencyName = (agencyName: string) => {
    setState((prev) => ({ ...prev, agencyName }));
  };

  const resetDemoData = () => {
    setState(defaultState);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  return (
    <CrmContext.Provider
      value={{
        ...state,
        addUser,
        toggleUserActive,
        addClient,
        addProperty,
        updatePropertyStatus,
        addActivity,
        addVisit,
        updateVisitStatus,
        addLead,
        updateLeadStage,
        setAgencyName,
        resetDemoData,
      }}
    >
      {children}
    </CrmContext.Provider>
  );
}

export function useCrm() {
  const ctx = useContext(CrmContext);
  if (!ctx) {
    throw new Error("useCrm debe usarse dentro de CrmProvider");
  }
  return ctx;
}
