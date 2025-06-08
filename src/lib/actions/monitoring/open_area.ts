// lib/actions/open-area.ts
'use server';

import { db } from '@/lib/db';
import { openArea } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function createOpenArea(data: {
  kawasanId: number;
  namaArea?: string;
  luasHa?: string;
  jenisPembukaan?: 'Alami' | 'Antropogenik' | 'Campuran';
  penyebab?: string;
  koordinatLokasi?: string;
  tahunTerbentuk?: number;
  statusPemulihan?: 'Belum' | 'Proses' | 'Selesai';
  rencanaTindakan?: string;
}) {
  try {
    const result = await db.insert(openArea).values({
      kawasanId: data.kawasanId,
      namaArea: data.namaArea,
      luasHa: data.luasHa,
      jenisPembukaan: data.jenisPembukaan,
      penyebab: data.penyebab,
      koordinatLokasi: data.koordinatLokasi,
      tahunTerbentuk: data.tahunTerbentuk,
      statusPemulihan: data.statusPemulihan,
      rencanaTindakan: data.rencanaTindakan,
    }).returning();

    revalidatePath('/kawasan');
    return { success: true, data: result[0] };
  } catch (error) {
    return { success: false, error: 'Failed to create open area' };
  }
}

export async function getOpenAreaByKawasan(kawasanId: number) {
  try {
    const result = await db.query.openArea.findMany({
      where: eq(openArea.kawasanId, kawasanId),
      with: {
        kawasan: {
          columns: { namaKawasan: true }
        }
      }
    });

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: 'Failed to get open area' };
  }
}

export async function getOpenArea(id: number) {
  try {
    const result = await db.query.openArea.findFirst({
      where: eq(openArea.id, id),
      with: {
        kawasan: true
      }
    });

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: 'Failed to get open area' };
  }
}

export async function updateOpenArea(id: number, data: {
  namaArea?: string;
  luasHa?: string;
  jenisPembukaan?: 'Alami' | 'Antropogenik' | 'Campuran';
  penyebab?: string;
  koordinatLokasi?: string;
  tahunTerbentuk?: number;
  statusPemulihan?: 'Belum' | 'Proses' | 'Selesai';
  rencanaTindakan?: string;
}) {
  try {
    const result = await db.update(openArea)
      .set(data)
      .where(eq(openArea.id, id))
      .returning();

    revalidatePath('/kawasan');
    return { success: true, data: result[0] };
  } catch (error) {
    return { success: false, error: 'Failed to update open area' };
  }
}

export async function deleteOpenArea(id: number) {
  try {
    await db.delete(openArea).where(eq(openArea.id, id));
    revalidatePath('/kawasan');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete open area' };
  }
}

export async function getOpenAreaByStatus(statusPemulihan: 'Belum' | 'Proses' | 'Selesai') {
  try {
    const result = await db.query.openArea.findMany({
      where: eq(openArea.statusPemulihan, statusPemulihan),
      with: {
        kawasan: {
          columns: { namaKawasan: true }
        }
      }
    });

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: 'Failed to get open area by status' };
  }
}

export async function getOpenAreaByType(jenisPembukaan: 'Alami' | 'Antropogenik' | 'Campuran') {
  try {
    const result = await db.query.openArea.findMany({
      where: eq(openArea.jenisPembukaan, jenisPembukaan),
      with: {
        kawasan: {
          columns: { namaKawasan: true }
        }
      }
    });

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: 'Failed to get open area by type' };
  }
}

export async function getOpenAreaSummary(kawasanId: number) {
  try {
    const result = await db.query.openArea.findMany({
      where: eq(openArea.kawasanId, kawasanId),
      with: {
        kawasan: {
          columns: { namaKawasan: true }
        }
      }
    });

    const totalLuas = result.reduce((sum, area) => {
      return sum + (parseFloat(area.luasHa || '0'));
    }, 0);

    const statusSummary = result.reduce((acc, area) => {
      const status = area.statusPemulihan || 'Belum';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const typeSummary = result.reduce((acc, area) => {
      const type = area.jenisPembukaan || 'Alami';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      success: true,
      data: result,
      totalLuas,
      statusSummary,
      typeSummary
    };
  } catch (error) {
    return { success: false, error: 'Failed to get open area summary' };
  }
}

export async function getCriticalOpenAreas() {
  try {
    const result = await db.query.openArea.findMany({
      where: and(
        eq(openArea.jenisPembukaan, 'Antropogenik'),
        eq(openArea.statusPemulihan, 'Belum')
      ),
      with: {
        kawasan: {
          columns: { namaKawasan: true }
        }
      }
    });

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: 'Failed to get critical open areas' };
  }
}
