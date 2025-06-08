// lib/actions/keanekaragaman-hayati.ts
'use server'

import { db } from '@/lib/db'
import { keanekaragamanHayati } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function createKeanekaragamanHayati(data: {
  kawasanId: number
  kategori: 'Flora' | 'Fauna' | 'Mikroorganisme'
  namaIlmiah?: string
  namaLokal?: string
  family?: string
  statusKonservasi?: 'LC' | 'NT' | 'VU' | 'EN' | 'CR' | 'EW' | 'EX'
  endemisitas?: boolean
  populasiEstimasi?: number
  habitatUtama?: string
  ancamanUtama?: string
  tahunSurvey?: number
  surveyor?: string
}) {
  try {
    const result = await db.insert(keanekaragamanHayati).values(data).returning()
    revalidatePath('/keanekaragaman-hayati')
    return { success: true, data: result[0] }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function getKeanekaragamanHayati(kawasanId?: number) {
  try {
    const query = kawasanId
      ? db.select().from(keanekaragamanHayati).where(eq(keanekaragamanHayati.kawasanId, kawasanId))
      : db.select().from(keanekaragamanHayati)

    const result = await query
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function getKeanekaragamanHayatiById(id: number) {
  try {
    const result = await db.select().from(keanekaragamanHayati).where(eq(keanekaragamanHayati.id, id))
    return { success: true, data: result[0] }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function updateKeanekaragamanHayati(id: number, data: {
  kawasanId?: number
  kategori?: 'Flora' | 'Fauna' | 'Mikroorganisme'
  namaIlmiah?: string
  namaLokal?: string
  family?: string
  statusKonservasi?: 'LC' | 'NT' | 'VU' | 'EN' | 'CR' | 'EW' | 'EX'
  endemisitas?: boolean
  populasiEstimasi?: number
  habitatUtama?: string
  ancamanUtama?: string
  tahunSurvey?: number
  surveyor?: string
}) {
  try {
    const result = await db.update(keanekaragamanHayati).set(data).where(eq(keanekaragamanHayati.id, id)).returning()
    revalidatePath('/keanekaragaman-hayati')
    return { success: true, data: result[0] }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function deleteKeanekaragamanHayati(id: number) {
  try {
    const result = await db.delete(keanekaragamanHayati).where(eq(keanekaragamanHayati.id, id)).returning()
    revalidatePath('/keanekaragaman-hayati')
    return { success: true, data: result[0] }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}


