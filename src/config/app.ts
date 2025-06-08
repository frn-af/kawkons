/**
 * Application configuration constants
 */

export const APP_CONFIG = {
  name: "Kawasan Konservasi Management System",
  version: "1.0.0",
  description: "Management system for conservation areas in Indonesia",
} as const;

export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  timeout: 30000, // 30 seconds
} as const;

export const DATABASE_CONFIG = {
  maxConnections: 10,
  connectionTimeout: 60000, // 1 minute
} as const;

export const PAGINATION_CONFIG = {
  defaultPageSize: 10,
  maxPageSize: 100,
} as const;

export const FILE_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedImageTypes: ["image/jpeg", "image/png", "image/webp"],
  allowedDocumentTypes: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
} as const;

export const MAP_CONFIG = {
  defaultCenter: [-2.5489, 118.0149], // Indonesia center
  defaultZoom: 5,
  minZoom: 3,
  maxZoom: 18,
} as const;

export const TOAST_CONFIG = {
  duration: 5000, // 5 seconds
  position: "top-right",
} as const;
