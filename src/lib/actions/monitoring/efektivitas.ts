// lib/actions/monitoring/efektivitas.ts
"use server";

import { db } from "@/lib/db";
import type { InsertEfektivitasPengelolaan } from "@/lib/db/schema";
import { efektivitasPengelolaan, kawasan } from "@/lib/db/schema";
import { calculateEfektivitasCategory } from "@/utils/efektivitas";
import { desc, eq } from "drizzle-orm";

/**
 * Get all efektivitas data with kawasan information
 */
export async function getAllEfektivitas() {
  try {
    const result = await db
      .select({
        id: efektivitasPengelolaan.id,
        kawasanId: efektivitasPengelolaan.kawasanId,
        tahun: efektivitasPengelolaan.tahun,
        skor: efektivitasPengelolaan.skor,
        keterangan: efektivitasPengelolaan.keterangan,
        createdAt: efektivitasPengelolaan.createdAt,
        namaKawasan: kawasan.namaKawasan,
        kategoriKawasan: kawasan.kategoriKawasan,
      })
      .from(efektivitasPengelolaan)
      .leftJoin(kawasan, eq(efektivitasPengelolaan.kawasanId, kawasan.id))
      .orderBy(desc(efektivitasPengelolaan.tahun), kawasan.namaKawasan);

    return result;
  } catch (error) {
    console.error("Error fetching efektivitas data:", error);
    throw new Error("Failed to fetch efektivitas data");
  }
}

/**
 * Get efektivitas data by kawasan ID
 */
export async function getEfektivitasByKawasan(kawasanId: number) {
  try {
    const result = await db
      .select()
      .from(efektivitasPengelolaan)
      .where(eq(efektivitasPengelolaan.kawasanId, kawasanId))
      .orderBy(desc(efektivitasPengelolaan.tahun));

    return result;
  } catch (error) {
    console.error("Error fetching efektivitas by kawasan:", error);
    throw new Error("Failed to fetch efektivitas data for kawasan");
  }
}

/**
 * Get efektivitas data by year
 */
export async function getEfektivitasByYear(tahun: number) {
  try {
    const result = await db
      .select({
        id: efektivitasPengelolaan.id,
        kawasanId: efektivitasPengelolaan.kawasanId,
        tahun: efektivitasPengelolaan.tahun,
        skor: efektivitasPengelolaan.skor,
        keterangan: efektivitasPengelolaan.keterangan,
        createdAt: efektivitasPengelolaan.createdAt,
        namaKawasan: kawasan.namaKawasan,
        kategoriKawasan: kawasan.kategoriKawasan,
      })
      .from(efektivitasPengelolaan)
      .leftJoin(kawasan, eq(efektivitasPengelolaan.kawasanId, kawasan.id))
      .where(eq(efektivitasPengelolaan.tahun, tahun))
      .orderBy(kawasan.namaKawasan);

    return result;
  } catch (error) {
    console.error("Error fetching efektivitas by year:", error);
    throw new Error("Failed to fetch efektivitas data for year");
  }
}

/**
 * Create new efektivitas record
 */
export async function createEfektivitas(data: InsertEfektivitasPengelolaan) {
  try {
    const result = await db
      .insert(efektivitasPengelolaan)
      .values(data)
      .returning();

    return result[0];
  } catch (error) {
    console.error("Error creating efektivitas:", error);
    throw new Error("Failed to create efektivitas record");
  }
}

/**
 * Update efektivitas record
 */
export async function updateEfektivitas(
  id: number,
  data: Partial<InsertEfektivitasPengelolaan>
) {
  try {
    const result = await db
      .update(efektivitasPengelolaan)
      .set(data)
      .where(eq(efektivitasPengelolaan.id, id))
      .returning();

    return result[0];
  } catch (error) {
    console.error("Error updating efektivitas:", error);
    throw new Error("Failed to update efektivitas record");
  }
}

/**
 * Delete efektivitas record
 */
export async function deleteEfektivitas(id: number) {
  try {
    await db
      .delete(efektivitasPengelolaan)
      .where(eq(efektivitasPengelolaan.id, id));

    return { success: true };
  } catch (error) {
    console.error("Error deleting efektivitas:", error);
    throw new Error("Failed to delete efektivitas record");
  }
}

/**
 * Get effectiveness statistics
 */
export async function getEfektivitasStatistics() {
  try {
    const allData = await db
      .select({
        skor: efektivitasPengelolaan.skor,
        tahun: efektivitasPengelolaan.tahun,
        kawasanId: efektivitasPengelolaan.kawasanId,
        kategoriKawasan: kawasan.kategoriKawasan,
      })
      .from(efektivitasPengelolaan)
      .leftJoin(kawasan, eq(efektivitasPengelolaan.kawasanId, kawasan.id)); // Get total count of all kawasan from kawasan table
    const totalKawasanResult = await db.select().from(kawasan);
    const totalKawasan = totalKawasanResult.length;

    const averageScore =
      allData.length > 0
        ? allData.reduce((acc, curr) => acc + curr.skor, 0) / allData.length
        : 0;

    // Count by category
    const categoryCounts = allData.reduce((acc, curr) => {
      const category = calculateEfektivitasCategory(curr.skor);
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Recent assessments (current year)
    const currentYear = new Date().getFullYear();
    const recentAssessments = allData.filter(
      (d) => d.tahun === currentYear
    ).length;

    return {
      totalKawasan,
      averageScore: Math.round(averageScore * 10) / 10,
      categoryCounts,
      recentAssessments,
      totalAssessments: allData.length,
    };
  } catch (error) {
    console.error("Error getting efektivitas statistics:", error);
    throw new Error("Failed to get effectiveness statistics");
  }
}

/**
 * Bulk insert effectiveness data (for data import)
 */
export async function bulkInsertEfektivitas(
  dataArray: InsertEfektivitasPengelolaan[]
) {
  try {
    const result = await db
      .insert(efektivitasPengelolaan)
      .values(dataArray)
      .returning();

    return result;
  } catch (error) {
    console.error("Error bulk inserting efektivitas:", error);
    throw new Error("Failed to bulk insert efektivitas data");
  }
}

/**
 * Get trend data for analytics
 */
export async function getEfektivitasTrends() {
  try {
    const result = await db
      .select({
        id: efektivitasPengelolaan.id,
        kawasanId: efektivitasPengelolaan.kawasanId,
        tahun: efektivitasPengelolaan.tahun,
        skor: efektivitasPengelolaan.skor,
        namaKawasan: kawasan.namaKawasan,
        kategoriKawasan: kawasan.kategoriKawasan,
      })
      .from(efektivitasPengelolaan)
      .leftJoin(kawasan, eq(efektivitasPengelolaan.kawasanId, kawasan.id))
      .orderBy(efektivitasPengelolaan.tahun, kawasan.namaKawasan);

    return result;
  } catch (error) {
    console.error("Error fetching trend data:", error);
    throw new Error("Failed to fetch trend data");
  }
}
