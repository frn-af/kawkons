"use server"

import { db } from "@/lib/db/db";
import { Data, imtTable, InsertData } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const retryOperation = async <T>(operation: () => Promise<T>, retries = 3, delay = 1000): Promise<T> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await operation();
      if (result !== undefined) {
        return result;
      }
      throw new Error("Operation returned undefined");
    } catch (err) {
      if (attempt < retries) {
        await new Promise(res => setTimeout(res, delay));
      } else {
        throw err;
      }
    }
  }
  throw new Error("Retry operation failed after all attempts");
};

export const getImtData = async (): Promise<Data[]> => {
  try {
    const data = await retryOperation(() => db.query.imtTable.findMany());
    return data || [];
  } catch (error) {
    throw new Error(`Failed to fetch IMT data: ${error}`);
  }
};

export const getImtByNohp = async (no_hp: string): Promise<Data[]> => {
  try {
    const data = await retryOperation(() => db.query.imtTable.findMany({
      where: eq(imtTable.no_hp, no_hp),
    }));
    return data || [];
  } catch (error) {
    throw new Error(`Failed to fetch IMT data by No HP: ${error}`);
  }
};

export const newData = async (data: InsertData): Promise<Data[]> => {
  try {
    const insertedData = await retryOperation(() => db.insert(imtTable).values(data).returning());
    return insertedData || [];
  } catch (error) {
    throw new Error(`Failed to insert new IMT data: ${error}`);
  }
};

export const updateData = async (data: InsertData, id: number): Promise<Data | null> => {
  try {
    const updatedRecords = await retryOperation(() =>
      db.update(imtTable)
        .set({
          name: data.name, no_hp: data.no_hp, tinggi_badan: data.tinggi_badan, berat_badan: data.berat_badan
        })
        .where(eq(imtTable.id, id))
        .returning()
    );

    if (updatedRecords.length === 0) {
      throw new Error(`No records updated for ID ${id}`);
    }

    const updatedData = await retryOperation(() =>
      db.query.imtTable.findFirst({
        where: eq(imtTable.id, updatedRecords[0].id),
      })
    );

    return updatedData ?? null; // Explicitly return null if no data found
  } catch (error) {
    throw new Error(`Failed to update IMT data: ${error}`);
  }
};

export const deleteData = async (id: number): Promise<Data[]> => {
  try {
    const deletedData = await retryOperation(() =>
      db.delete(imtTable)
        .where(eq(imtTable.id, id))
        .returning()
    );
    return deletedData || [];
  } catch (error) {
    throw new Error(`Failed to delete IMT data: ${error}`);
  }
};

