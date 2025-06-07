// lib/actions/kawasan.ts
'use server';

import { db } from '@/lib/db';
import { kawasan } from '@/lib/db/schema';
import { eq, like, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function createKawasan(data: {
  namaKawasan: string;
  letak?: string;
}) {
  try {
    const result = await db.insert(kawasan).values({
      namaKawasan: data.namaKawasan,
      letak: data.letak,
    }).returning();

    revalidatePath('/kawasan');
    return { success: true, data: result[0] };
  } catch (error) {
    return { success: false, error: 'Failed to create kawasan' };
  }
}

export async function getKawasan(id: number) {
  try {
    const result = await db.query.kawasan.findFirst({
      where: eq(kawasan.id, id),
      with: {
        skDocuments: true,
        blokPengelolaan: true,
        rpjp: true,
        tipeEkosistem: true,
        tutupanLahan: true,
        openArea: true,
        keanekaragamanHayati: true,
        nilaiPenting: true,
        surveyMonitoring: true,
      }
    });
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: 'Failed to get kawasan' };
  }
}

export async function getAllKawasan(search?: string) {
  try {
    const whereClause = search
      ? like(kawasan.namaKawasan, `%${search}%`)
      : undefined;

    const result = await db.query.kawasan.findMany({
      where: whereClause,
      orderBy: [desc(kawasan.createdAt)],
    });

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: 'Failed to get kawasan list' };
  }
}

export async function updateKawasan(id: number, data: {
  namaKawasan?: string;
  letak?: string;
}) {
  try {
    const result = await db.update(kawasan)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(kawasan.id, id))
      .returning();

    revalidatePath('/kawasan');
    return { success: true, data: result[0] };
  } catch (error) {
    return { success: false, error: 'Failed to update kawasan' };
  }
}

export async function deleteKawasan(id: number) {
  try {
    await db.delete(kawasan).where(eq(kawasan.id, id));
    revalidatePath('/kawasan');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete kawasan' };
  }
}

export async function getKawasanOverview(id: number) {
  try {
    const result = await db.query.kawasan.findFirst({
      where: eq(kawasan.id, id),
      with: {
        skDocuments: {
          columns: { id: true }
        },
        blokPengelolaan: {
          columns: { id: true }
        },
        keanekaragamanHayati: {
          columns: { id: true, endemisitas: true }
        }
      }
    });

    if (!result) {
      return { success: false, error: 'Kawasan not found' };
    }

    const overview = {
      ...result,
      jumlahSk: result.skDocuments.length,
      jumlahBlok: result.blokPengelolaan.length,
      jumlahSpesies: result.keanekaragamanHayati.length,
      spesiesEndemik: result.keanekaragamanHayati.filter(s => s.endemisitas).length,
    };

    return { success: true, data: overview };
  } catch (error) {
    return { success: false, error: 'Failed to get kawasan overview' };
  }
}
