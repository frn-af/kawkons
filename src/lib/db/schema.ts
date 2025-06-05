import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const imtTable = pgTable("imt", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  no_hp: varchar().notNull(),
  tinggi_badan: integer().notNull(),
  berat_badan: integer().notNull(),
  timestamp: timestamp('timestamp1').notNull().defaultNow(),
});

export type Data = typeof imtTable.$inferSelect;
export type InsertData = typeof imtTable.$inferInsert;
