// lib/actions/sk-documents.ts
'use server';

import { db } from '@/lib/db';
import { skDocuments } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function createSkDocument(data: {
  kawasanId: number;
  jenisSk: 'SK_Pengukuhan' | 'SK_Penetapan' | 'SK_6620' | 'SK_128_DPCLS';
  nomorSk?: string;
  tanggalSk?: string;
  instansiPenerbit?: string;
  filePath?: string;
  keterangan?: string;
}) {
  try {
    const result = await db.insert(skDocuments).values({
      kawasanId: data.kawasanId,
      jenisSk: data.jenisSk,
      nomorSk: data.nomorSk,
      tanggalSk: data.tanggalSk,
      instansiPenerbit: data.instansiPenerbit,
      filePath: data.filePath,
      keterangan: data.keterangan,
    }).returning();

    revalidatePath('/kawasan');
    return { success: true, data: result[0] };
  } catch (error) {
    return { success: false, error: 'Failed to create SK document' };
  }
}

export async function getSkDocumentsByKawasan(kawasanId: number) {
  try {
    const result = await db.query.skDocuments.findMany({
      where: eq(skDocuments.kawasanId, kawasanId),
      with: {
        kawasan: {
          columns: { namaKawasan: true }
        }
      }
    });

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: 'Failed to get SK documents' };
  }
}

export async function getSkDocument(id: number) {
  try {
    const result = await db.query.skDocuments.findFirst({
      where: eq(skDocuments.id, id),
      with: {
        kawasan: true
      }
    });

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: 'Failed to get SK document' };
  }
}

export async function updateSkDocument(id: number, data: {
  jenisSk?: 'SK_Pengukuhan' | 'SK_Penetapan' | 'SK_6620' | 'SK_128_DPCLS';
  nomorSk?: string;
  tanggalSk?: string;
  instansiPenerbit?: string;
  filePath?: string;
  keterangan?: string;
}) {
  try {
    const result = await db.update(skDocuments)
      .set(data)
      .where(eq(skDocuments.id, id))
      .returning();

    revalidatePath('/kawasan');
    return { success: true, data: result[0] };
  } catch (error) {
    return { success: false, error: 'Failed to update SK document' };
  }
}

export async function deleteSkDocument(id: number) {
  try {
    await db.delete(skDocuments).where(eq(skDocuments.id, id));
    revalidatePath('/kawasan');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete SK document' };
  }
}

export async function getSkDocumentsByType(jenisSk: 'SK_Pengukuhan' | 'SK_Penetapan' | 'SK_6620' | 'SK_128_DPCLS') {
  try {
    const result = await db.query.skDocuments.findMany({
      where: eq(skDocuments.jenisSk, jenisSk),
      with: {
        kawasan: {
          columns: { namaKawasan: true }
        }
      }
    });

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: 'Failed to get SK documents by type' };
  }
}
