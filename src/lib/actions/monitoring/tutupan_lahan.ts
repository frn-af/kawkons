// lib/actions/tutupan-lahan.ts
'use server';

import { db } from '@/lib/db';
import { tutupanLahan } from '@/lib/db/schema';
import { eq, and, gte, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function createTutupanLahan(data: {
  kawasanId: number;
  jenisTutupan: string;
  luasHa?: string;
  persentase?: string;
  tahunData?: number;
  sumberData?: string;
  metodeAnalisis?: string;
}) {
  try {
    const result = await db.insert(tutupanLahan).values({
      kawasanId: data.kawasanId,
      jenisTutupan: data.jenisTutupan,
      luasHa: data.luasHa,
      persentase: data.persentase,
      tahunData: data.tahunData,
      sumberData: data.sumberData,
      metodeAnalisis: data.metodeAnalisis,
    }).returning();

    revalidatePath('/kawasan');
    return { success: true, data: result[0] };
  } catch (error) {
    return { success: false, error: 'Failed to create tutupan lahan' };
  }
}

export async function getTutupanLahanByKawasan(kawasanId: number) {
  try {
    const result = await db.query.tutupanLahan.findMany({
      where: eq(tutupanLahan.kawasanId, kawasanId),
      orderBy: [desc(tutupanLahan.tahunData)],
      with: {
        kawasan: {
          columns: { namaKawasan: true }
        }
      }
    });

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: 'Failed to get tutupan lahan' };
  }
}

export async function getTutupanLahan(id: number) {
  try {
    const result = await db.query.tutupanLahan.findFirst({
      where: eq(tutupanLahan.id, id),
      with: {
        kawasan: true
      }
    });

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: 'Failed to get tutupan lahan' };
  }
}

export async function updateTutupanLahan(id: number, data: {
  jenisTutupan?: string;
  luasHa?: string;
  persentase?: string;
  tahunData?: number;
  sumberData?: string;
  metodeAnalisis?: string;
}) {
  try {
    const result = await db.update(tutupanLahan)
      .set(data)
      .where(eq(tutupanLahan.id, id))
      .returning();

    revalidatePath('/kawasan');
    return { success: true, data: result[0] };
  } catch (error) {
    return { success: false, error: 'Failed to update tutupan lahan' };
  }
}

export async function deleteTutupanLahan(id: number) {
  try {
    await db.delete(tutupanLahan).where(eq(tutupanLahan.id, id));
    revalidatePath('/kawasan');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete tutupan lahan' };
  }
}

export async function getTutupanLahanByYear(kawasanId: number, year: number) {
  try {
    const result = await db.query.tutupanLahan.findMany({
      where: and(
        eq(tutupanLahan.kawasanId, kawasanId),
        eq(tutupanLahan.tahunData, year)
      ),
      with: {
        kawasan: {
          columns: { namaKawasan: true }
        }
      }
    });

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: 'Failed to get tutupan lahan by year' };
  }
}

export async function getTutupanLahanChange(kawasanId: number, startYear: number) {
  try {
    const result = await db.query.tutupanLahan.findMany({
      where: and(
        eq(tutupanLahan.kawasanId, kawasanId),
        gte(tutupanLahan.tahunData, startYear)
      ),
      orderBy: [tutupanLahan.jenisTutupan, tutupanLahan.tahunData],
      with: {
        kawasan: {
          columns: { namaKawasan: true }
        }
      }
    });

    // Group by jenis tutupan and calculate changes
    const grouped = result.reduce((acc, item) => {
      const key = item.jenisTutupan;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {} as Record<string, typeof result>);

    const changes = Object.entries(grouped).map(([jenis, data]) => {
      const sorted = data.sort((a, b) => (a.tahunData || 0) - (b.tahunData || 0));
      return {
        jenisTutupan: jenis,
        data: sorted.map((item, index) => ({
          ...item,
          luasSebelum: index > 0 ? sorted[index - 1].luasHa : null,
          perubahan: index > 0 ?
            parseFloat(item.luasHa || '0') - parseFloat(sorted[index - 1].luasHa || '0') : 0
        }))
      };
    });

    return { success: true, data: changes };
  } catch (error) {
    return { success: false, error: 'Failed to get tutupan lahan change analysis' };
  }
}

export async function getRecentTutupanLahan(years: number = 5) {
  try {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - years;

    const result = await db.query.tutupanLahan.findMany({
      where: gte(tutupanLahan.tahunData, startYear),
      orderBy: [desc(tutupanLahan.tahunData)],
      with: {
        kawasan: {
          columns: { namaKawasan: true }
        }
      }
    });

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: 'Failed to get recent tutupan lahan' };
  }
}
