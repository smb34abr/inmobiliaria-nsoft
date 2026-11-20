export type UserRole = "Administrador" | "Gerente" | "Agente inmobiliario";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  active: boolean;
  avatarInitials: string;
  joinedAt: string;
}

export type ClientType = "Propietario" | "Comprador" | "Inquilino";

export interface Client {
  id: string;
  name: string;
  type: ClientType;
  phone: string;
  email: string;
  rfcNif: string;
  address: string;
  notes: string;
  createdAt: string;
}

export type PropertyStatus =
  | "Captado"
  | "Publicado"
  | "Visitado"
  | "Oferta"
  | "Vendido";

export type PropertyType =
  | "Casa"
  | "Departamento"
  | "Terreno"
  | "Local comercial"
  | "Oficina";

export interface Property {
  id: string;
  code: string;
  title: string;
  type: PropertyType;
  address: string;
  price: number;
  status: PropertyStatus;
  photoUrl: string;
  description: string;
  agentId: string;
  ownerId: string;
  capturedAt: string;
}

export type ActivityType =
  | "Llamada"
  | "WhatsApp"
  | "Correo"
  | "Reunión"
  | "Visita";

export interface Activity {
  id: string;
  type: ActivityType;
  date: string;
  agentId: string;
  clientId?: string;
  propertyId?: string;
  notes: string;
}

export type VisitStatus = "Programada" | "Realizada" | "Cancelada";

export interface Visit {
  id: string;
  date: string;
  propertyId: string;
  clientId: string;
  agentId: string;
  status: VisitStatus;
  result: string;
}

export type LeadStage =
  | "Nuevo"
  | "Contactado"
  | "Interesado"
  | "Visita programada"
  | "Oferta realizada"
  | "Cerrado"
  | "Perdido";

export type LeadOrigin =
  | "Portal inmobiliario"
  | "Facebook"
  | "Instagram"
  | "Referido"
  | "Página web"
  | "Llamada directa";

export interface PipelineLead {
  id: string;
  clientName: string;
  phone: string;
  origin: LeadOrigin;
  propertyId: string;
  agentId: string;
  stage: LeadStage;
  estimatedValue: number;
  updatedAt: string;
}
