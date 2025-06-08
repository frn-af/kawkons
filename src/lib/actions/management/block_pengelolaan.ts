// lib/actions/blok-pengelolaan.ts
'use server';

import { db } from '@/lib/db';
import { blokPengelolaan } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function createBlokPengelolaan(data: {
  kawasanId: number;
  namaBlok: string;
  luasHa?: string;
  fungsiBlok?: string;
  koordinatBatas?: string;
  keterangan?: string;
}) {
  try {
    const result = await db.insert(blokPengelolaan).values({
      kawasanId: data.kawasanId,
      namaBlok: data.namaBlok,
      luasHa: data.luasHa,
      fungsiBlok: data.fungsiBlok,
      koordinatBatas: data.koordinatBatas,
      keterangan: data.keterangan,
    }).returning();

    revalidatePath('/kawasan');
    return { success: true, data: result[0] };
  } catch (error) {
    return { success: false, error: 'Failed to create blok pengelolaan' };
  }
}

export async function getBlokPengelolaanByKawasan(kawasanId: number) {
  try {
    const result = await db.query.blokPengelolaan.findMany({
      where: eq(blokPengelolaan.kawasanId, kawasanId),
      with: {
        kawasan: {
          columns: { namaKawasan: true }
        }
      }
    });

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: 'Failed to get blok pengelolaan' };
  }
}

export async function getBlokPengelolaan(id: number) {
  try {
    const result = await db.query.blokPengelolaan.findFirst({
      where: eq(blokPengelolaan.id, id),
      with: {
        kawasan: true
      }
    });

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: 'Failed to get blok pengelolaan' };
  }
}

export async function updateBlokPengelolaan(id: number, data: {
  namaBlok?: string;
  luasHa?: string;
  fungsiBlok?: string;
  koordinatBatas?: string;
  keterangan?: string;
}) {
  try {
    const result = await db.update(blokPengelolaan)
      .set(data)
      .where(eq(blokPengelolaan.id, id))
      .returning();

    revalidatePath('/kawasan');
    return { success: true, data: result[0] };
  } catch (error) {
    return { success: false, error: 'Failed to update blok pengelolaan' };
  }
}

export async function deleteBlokPengelolaan(id: number) {
  try {
    await db.delete(blokPengelolaan).where(eq(blokPengelolaan.id, id));
    revalidatePath('/kawasan');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete blok pengelolaan' };
  }
}

export async function getBlokPengelolaanSummary(kawasanId: number) {
  try {
    const result = await db.query.blokPengelolaan.findMany({
      where: eq(blokPengelolaan.kawasanId, kawasanId),
      with: {
        kawasan: {
          columns: { namaKawasan: true }
        }
      }
    });

    const totalLuas = result.reduce((sum, blok) => {
      return sum + (parseFloat(blok.luasHa || '0'));
    }, 0);

    const summary = result.map(blok => ({
      ...blok,
      persentaseDariTotal: totalLuas > 0 ?
        ((parseFloat(blok.luasHa || '0') / totalLuas) * 100).toFixed(2) : '0'
    }));

    return { success: true, data: summary, totalLuas };
  } catch (error) {
    return { success: false, error: 'Failed to get blok pengelolaan summary' };
  }
}
