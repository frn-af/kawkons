// lib/actions/tipe-ekosistem.ts
'use server';

import { db } from '@/lib/db';
import { tipeEkosistem } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function createTipeEkosistem(data: {
  kawasanId: number;
  namaEkosistem: string;
  luasHa?: string;
  persentaseKawasan?: string;
  kondisi?: 'Baik' | 'Sedang' | 'Rusak';
  deskripsi?: string;
}) {
  try {
    const result = await db.insert(tipeEkosistem).values({
      kawasanId: data.kawasanId,
      namaEkosistem: data.namaEkosistem,
      luasHa: data.luasHa,
      persentaseKawasan: data.persentaseKawasan,
      kondisi: data.kondisi || 'Baik',
      deskripsi: data.deskripsi,
    }).returning();

    revalidatePath('/kawasan');
    return { success: true, data: result[0] };
  } catch (error) {
    return { success: false, error: 'Failed to create tipe ekosistem' };
  }
}

export async function getTipeEkosistemByKawasan(kawasanId: number) {
  try {
    const result = await db.query.tipeEkosistem.findMany({
      where: eq(tipeEkosistem.kawasanId, kawasanId),
      with: {
        kawasan: {
          columns: { namaKawasan: true }
        }
      }
    });

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: 'Failed to get tipe ekosistem' };
  }
}

export async function getTipeEkosistem(id: number) {
  try {
    const result = await db.query.tipeEkosistem.findFirst({
      where: eq(tipeEkosistem.id, id),
      with: {
        kawasan: true
      }
    });

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: 'Failed to get tipe ekosistem' };
  }
}

export async function updateTipeEkosistem(id: number, data: {
  namaEkosistem?: string;
  luasHa?: string;
  persentaseKawasan?: string;
  kondisi?: 'Baik' | 'Sedang' | 'Rusak';
  deskripsi?: string;
}) {
  try {
    const result = await db.update(tipeEkosistem)
      .set(data)
      .where(eq(tipeEkosistem.id, id))
      .returning();

    revalidatePath('/kawasan');
    return { success: true, data: result[0] };
  } catch (error) {
    return { success: false, error: 'Failed to update tipe ekosistem' };
  }
}

export async function deleteTipeEkosistem(id: number) {
  try {
    await db.delete(tipeEkosistem).where(eq(tipeEkosistem.id, id));
    revalidatePath('/kawasan');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete tipe ekosistem' };
  }
}

export async function getTipeEkosistemByKondisi(kondisi: 'Baik' | 'Sedang' | 'Rusak') {
  try {
    const result = await db.query.tipeEkosistem.findMany({
      where: eq(tipeEkosistem.kondisi, kondisi),
      with: {
        kawasan: {
          columns: { namaKawasan: true }
        }
      }
    });

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: 'Failed to get tipe ekosistem by kondisi' };
  }
}

export async function getEkosistemSummary(kawasanId: number) {
  try {
    const result = await db.query.tipeEkosistem.findMany({
      where: eq(tipeEkosistem.kawasanId, kawasanId),
      with: {
        kawasan: {
          columns: { namaKawasan: true }
        }
      }
    });

    const totalPersentase = result.reduce((sum, ekosistem) => {
      return sum + (parseFloat(ekosistem.persentaseKawasan || '0'));
    }, 0);

    const kondisiSummary = result.reduce((acc, ekosistem) => {
      const kondisi = ekosistem.kondisi || 'Baik';
      acc[kondisi] = (acc[kondisi] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      success: true,
      data: result,
      totalPersentase,
      kondisiSummary
    };
  } catch (error) {
    return { success: false, error: 'Failed to get ekosistem summary' };
  }
}
