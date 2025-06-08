// Utility functions for effectiveness management
import type { EfektivitasPengelolaan } from "@/lib/db/schema";

export type EfektivitasCategory =
  | "belum_dilakukan"
  | "tidak_efektif"
  | "kurang_efektif"
  | "efektif";

/**
 * Calculate effectiveness category from score
 * 0: Belum Dilakukan Penilaian
 * 1-33: Tidak Efektif
 * 34-66: Kurang Efektif
 * 67-100: Efektif
 */
export function calculateEfektivitasCategory(
  skor: number
): EfektivitasCategory {
  if (skor === 0) return "belum_dilakukan";
  if (skor >= 1 && skor <= 33) return "tidak_efektif";
  if (skor >= 34 && skor <= 66) return "kurang_efektif";
  if (skor >= 67 && skor <= 100) return "efektif";

  // Default fallback for invalid scores
  return "belum_dilakukan";
}

/**
 * Get category display name in Indonesian
 */
export function getEfektivitasCategoryDisplay(
  category: EfektivitasCategory
): string {
  const displayNames = {
    belum_dilakukan: "Belum Dilakukan Penilaian",
    tidak_efektif: "Tidak Efektif",
    kurang_efektif: "Kurang Efektif",
    efektif: "Efektif",
  };

  return displayNames[category];
}

/**
 * Get category color for UI display
 */
export function getEfektivitasCategoryColor(
  category: EfektivitasCategory
): string {
  const colors = {
    belum_dilakukan: "bg-gray-100 text-gray-800 border-gray-300",
    tidak_efektif: "bg-red-100 text-red-800 border-red-300",
    kurang_efektif: "bg-yellow-100 text-yellow-800 border-yellow-300",
    efektif: "bg-green-100 text-green-800 border-green-300",
  };

  return colors[category];
}

/**
 * Validate effectiveness score
 */
export function validateEfektivitasScore(skor: number): boolean {
  return Number.isInteger(skor) && skor >= 0 && skor <= 100;
}

/**
 * Format effectiveness data for display
 */
export function formatEfektivitasData(data: EfektivitasPengelolaan) {
  const category = calculateEfektivitasCategory(data.skor);

  return {
    ...data,
    kategori: category,
    kategoriDisplay: getEfektivitasCategoryDisplay(category),
    kategoriColor: getEfektivitasCategoryColor(category),
  };
}
