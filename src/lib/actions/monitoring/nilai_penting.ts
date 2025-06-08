
// lib/actions/nilai-penting.ts
'use server'

import { db } from '@/lib/db'
import { nilaiPenting } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function createNilaiPenting(data: {
  kawasanId: number
  kategoriNilai: 'Ekologis' | 'Ekonomis' | 'Sosial_Budaya' | 'Ilmiah' | 'Estetika'
  namaNilai: string
  deskripsi?: string
  tingkatKepentingan?: 'Sangat_Tinggi' | 'Tinggi' | 'Sedang' | 'Rendah'
  indikatorNilai?: string
  potensiAncaman?: string
  upayaPelestarian?: string
}) {
  try {
    const result = await db.insert(nilaiPenting).values(data).returning()
    revalidatePath('/nilai-penting')
    return { success: true, data: result[0] }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function getNilaiPenting(kawasanId?: number) {
  try {
    const query = kawasanId
      ? db.select().from(nilaiPenting).where(eq(nilaiPenting.kawasanId, kawasanId))
      : db.select().from(nilaiPenting)

    const result = await query
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function getNilaiPentingById(id: number) {
  try {
    const result = await db.select().from(nilaiPenting).where(eq(nilaiPenting.id, id))
    return { success: true, data: result[0] }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function updateNilaiPenting(id: number, data: {
  kawasanId?: number
  kategoriNilai?: 'Ekologis' | 'Ekonomis' | 'Sosial_Budaya' | 'Ilmiah' | 'Estetika'
  namaNilai?: string
  deskripsi?: string
  tingkatKepentingan?: 'Sangat_Tinggi' | 'Tinggi' | 'Sedang' | 'Rendah'
  indikatorNilai?: string
  potensiAncaman?: string
  upayaPelestarian?: string
}) {
  try {
    const result = await db.update(nilaiPenting).set(data).where(eq(nilaiPenting.id, id)).returning()
    revalidatePath('/nilai-penting')
    return { success: true, data: result[0] }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function deleteNilaiPenting(id: number) {
  try {
    const result = await db.delete(nilaiPenting).where(eq(nilaiPenting.id, id)).returning()
    revalidatePath('/nilai-penting')
    return { success: true, data: result[0] }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
