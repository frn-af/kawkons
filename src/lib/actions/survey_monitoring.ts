
// lib/actions/survey-monitoring.ts
'use server'

import { db } from '@/lib/db'
import { surveyMonitoring } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function createSurveyMonitoring(data: {
  kawasanId: number
  jenisSurvey?: 'Biodiversity' | 'Land_Cover' | 'Ecosystem_Health' | 'Socio_Economic'
  tanggalSurvey?: string
  timSurvey?: string
  metodologi?: string
  hasilUtama?: string
  rekomendasi?: string
  fileLaporan?: string
}) {
  try {
    const result = await db.insert(surveyMonitoring).values(data).returning()
    revalidatePath('/survey-monitoring')
    return { success: true, data: result[0] }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function getSurveyMonitoring(kawasanId?: number) {
  try {
    const query = kawasanId
      ? db.select().from(surveyMonitoring).where(eq(surveyMonitoring.kawasanId, kawasanId))
      : db.select().from(surveyMonitoring)

    const result = await query
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function getSurveyMonitoringById(id: number) {
  try {
    const result = await db.select().from(surveyMonitoring).where(eq(surveyMonitoring.id, id))
    return { success: true, data: result[0] }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function updateSurveyMonitoring(id: number, data: {
  kawasanId?: number
  jenisSurvey?: 'Biodiversity' | 'Land_Cover' | 'Ecosystem_Health' | 'Socio_Economic'
  tanggalSurvey?: string
  timSurvey?: string
  metodologi?: string
  hasilUtama?: string
  rekomendasi?: string
  fileLaporan?: string
}) {
  try {
    const result = await db.update(surveyMonitoring).set(data).where(eq(surveyMonitoring.id, id)).returning()
    revalidatePath('/survey-monitoring')
    return { success: true, data: result[0] }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function deleteSurveyMonitoring(id: number) {
  try {
    const result = await db.delete(surveyMonitoring).where(eq(surveyMonitoring.id, id)).returning()
    revalidatePath('/survey-monitoring')
    return { success: true, data: result[0] }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
