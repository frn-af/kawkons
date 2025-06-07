// lib/actions/rpjp.ts
'use server';

import { db } from '@/lib/db';
import { rpjp } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function createRpjp(data: {
  kawasanId: number;
  periodeAwal?: number;
  periodeAkhir?: number;
  tujuan?: string;
  strategi?: string;
  targetIndikator?: string;
  anggaran?: string;
  status?: 'Draft' | 'Approved' | 'Active' | 'Completed';
  fileDokumen?: string;
}) {
  try {
    const result = await db.insert(rpjp).values({
      kawasanId: data.kawasanId,
      periodeAwal: data.periodeAwal,
      periodeAkhir: data.periodeAkhir,
      tujuan: data.tujuan,
      strategi: data.strategi,
      targetIndikator: data.targetIndikator,
      anggaran: data.anggaran,
      status: data.status || 'Draft',
      fileDokumen: data.fileDokumen,
    }).returning();

    revalidatePath('/kawasan');
    return { success: true, data: result[0] };
  } catch (error) {
    return { success: false, error: 'Failed to create RPJP' };
  }
}

export async function getRpjpByKawasan(kawasanId: number) {
  try {
    const result = await db.query.rpjp.findMany({
      where: eq(rpjp.kawasanId, kawasanId),
      with: {
        kawasan: {
          columns: { namaKawasan: true }
        }
      }
    });

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: 'Failed to get RPJP' };
  }
}

export async function getRpjp(id: number) {
  try {
    const result = await db.query.rpjp.findFirst({
      where: eq(rpjp.id, id),
      with: {
        kawasan: true
      }
    });

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: 'Failed to get RPJP' };
  }
}

export async function updateRpjp(id: number, data: {
  periodeAwal?: number;
  periodeAkhir?: number;
  tujuan?: string;
  strategi?: string;
  targetIndikator?: string;
  anggaran?: string;
  status?: 'Draft' | 'Approved' | 'Active' | 'Completed';
  fileDokumen?: string;
}) {
  try {
    const result = await db.update(rpjp)
      .set(data)
      .where(eq(rpjp.id, id))
      .returning();

    revalidatePath('/kawasan');
    return { success: true, data: result[0] };
  } catch (error) {
    return { success: false, error: 'Failed to update RPJP' };
  }
}

export async function deleteRpjp(id: number) {
  try {
    await db.delete(rpjp).where(eq(rpjp.id, id));
    revalidatePath('/kawasan');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete RPJP' };
  }
}

export async function getActiveRpjp(kawasanId: number) {
  try {
    const result = await db.query.rpjp.findFirst({
      where: and(
        eq(rpjp.kawasanId, kawasanId),
        eq(rpjp.status, 'Active')
      ),
      with: {
        kawasan: {
          columns: { namaKawasan: true }
        }
      }
    });

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: 'Failed to get active RPJP' };
  }
}

export async function getRpjpByStatus(status: 'Draft' | 'Approved' | 'Active' | 'Completed') {
  try {
    const result = await db.query.rpjp.findMany({
      where: eq(rpjp.status, status),
      with: {
        kawasan: {
          columns: { namaKawasan: true }
        }
      }
    });

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: 'Failed to get RPJP by status' };
  }
}
