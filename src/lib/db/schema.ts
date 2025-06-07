// lib/db/schema.ts
import { pgTable, serial, varchar, text, timestamp, integer, decimal, pgEnum, boolean, date } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const jenisSkEnum = pgEnum('jenis_sk', ['SK_Pengukuhan', 'SK_Penetapan', 'SK_6620', 'SK_128_DPCLS']);
export const statusEnum = pgEnum('status', ['Draft', 'Approved', 'Active', 'Completed']);
export const kondisiEnum = pgEnum('kondisi', ['Baik', 'Sedang', 'Rusak']);
export const jenisPembukaanEnum = pgEnum('jenis_pembukaan', ['Alami', 'Antropogenik', 'Campuran']);
export const statusPemulihanEnum = pgEnum('status_pemulihan', ['Belum', 'Proses', 'Selesai']);
export const kategoriEnum = pgEnum('kategori', ['Flora', 'Fauna', 'Mikroorganisme']);
export const statusKonservasiEnum = pgEnum('status_konservasi', ['LC', 'NT', 'VU', 'EN', 'CR', 'EW', 'EX']);
export const kategoriNilaiEnum = pgEnum('kategori_nilai', ['Ekologis', 'Ekonomis', 'Sosial_Budaya', 'Ilmiah', 'Estetika']);
export const tingkatKepentinganEnum = pgEnum('tingkat_kepentingan', ['Sangat_Tinggi', 'Tinggi', 'Sedang', 'Rendah']);
export const jenisSurveyEnum = pgEnum('jenis_survey', ['Biodiversity', 'Land_Cover', 'Ecosystem_Health', 'Socio_Economic']);

// Tables
export const kawasan = pgTable('kawasan', {
  id: serial('id').primaryKey(),
  namaKawasan: varchar('nama_kawasan', { length: 255 }).notNull(),
  letak: text('letak'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const skDocuments = pgTable('sk_documents', {
  id: serial('id').primaryKey(),
  kawasanId: integer('kawasan_id').references(() => kawasan.id, { onDelete: 'cascade' }),
  jenisSk: jenisSkEnum('jenis_sk').notNull(),
  nomorSk: varchar('nomor_sk', { length: 100 }),
  tanggalSk: date('tanggal_sk'),
  instansiPenerbit: varchar('instansi_penerbit', { length: 255 }),
  filePath: varchar('file_path', { length: 500 }),
  keterangan: text('keterangan'),
  createdAt: timestamp('created_at').defaultNow()
});

export const blokPengelolaan = pgTable('blok_pengelolaan', {
  id: serial('id').primaryKey(),
  kawasanId: integer('kawasan_id').references(() => kawasan.id, { onDelete: 'cascade' }),
  namaBlok: varchar('nama_blok', { length: 255 }).notNull(),
  luasHa: decimal('luas_ha', { precision: 12, scale: 4 }),
  fungsiBlok: varchar('fungsi_blok', { length: 255 }),
  koordinatBatas: text('koordinat_batas'),
  keterangan: text('keterangan'),
  createdAt: timestamp('created_at').defaultNow()
});

export const rpjp = pgTable('rpjp', {
  id: serial('id').primaryKey(),
  kawasanId: integer('kawasan_id').references(() => kawasan.id, { onDelete: 'cascade' }),
  periodeAwal: integer('periode_awal'),
  periodeAkhir: integer('periode_akhir'),
  tujuan: text('tujuan'),
  strategi: text('strategi'),
  targetIndikator: text('target_indikator'),
  anggaran: decimal('anggaran', { precision: 15, scale: 2 }),
  status: statusEnum('status').default('Draft'),
  fileDokumen: varchar('file_dokumen', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow()
});

export const tipeEkosistem = pgTable('tipe_ekosistem', {
  id: serial('id').primaryKey(),
  kawasanId: integer('kawasan_id').references(() => kawasan.id, { onDelete: 'cascade' }),
  namaEkosistem: varchar('nama_ekosistem', { length: 255 }).notNull(),
  luasHa: decimal('luas_ha', { precision: 12, scale: 4 }),
  persentaseKawasan: decimal('persentase_kawasan', { precision: 5, scale: 2 }),
  kondisi: kondisiEnum('kondisi').default('Baik'),
  deskripsi: text('deskripsi'),
  createdAt: timestamp('created_at').defaultNow()
});

export const tutupanLahan = pgTable('tutupan_lahan', {
  id: serial('id').primaryKey(),
  kawasanId: integer('kawasan_id').references(() => kawasan.id, { onDelete: 'cascade' }),
  jenisTutupan: varchar('jenis_tutupan', { length: 255 }).notNull(),
  luasHa: decimal('luas_ha', { precision: 12, scale: 4 }),
  persentase: decimal('persentase', { precision: 5, scale: 2 }),
  tahunData: integer('tahun_data'),
  sumberData: varchar('sumber_data', { length: 255 }),
  metodeAnalisis: varchar('metode_analisis', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow()
});

export const openArea = pgTable('open_area', {
  id: serial('id').primaryKey(),
  kawasanId: integer('kawasan_id').references(() => kawasan.id, { onDelete: 'cascade' }),
  namaArea: varchar('nama_area', { length: 255 }),
  luasHa: decimal('luas_ha', { precision: 12, scale: 4 }),
  jenisPembukaan: jenisPembukaanEnum('jenis_pembukaan'),
  penyebab: text('penyebab'),
  koordinatLokasi: varchar('koordinat_lokasi', { length: 255 }),
  tahunTerbentuk: integer('tahun_terbentuk'),
  statusPemulihan: statusPemulihanEnum('status_pemulihan'),
  rencanaTindakan: text('rencana_tindakan'),
  createdAt: timestamp('created_at').defaultNow()
});

export const keanekaragamanHayati = pgTable('keanekaragaman_hayati', {
  id: serial('id').primaryKey(),
  kawasanId: integer('kawasan_id').references(() => kawasan.id, { onDelete: 'cascade' }),
  kategori: kategoriEnum('kategori').notNull(),
  namaIlmiah: varchar('nama_ilmiah', { length: 255 }),
  namaLokal: varchar('nama_lokal', { length: 255 }),
  family: varchar('family', { length: 255 }),
  statusKonservasi: statusKonservasiEnum('status_konservasi'),
  endemisitas: boolean('endemisitas').default(false),
  populasiEstimasi: integer('populasi_estimasi'),
  habitatUtama: varchar('habitat_utama', { length: 255 }),
  ancamanUtama: text('ancaman_utama'),
  tahunSurvey: integer('tahun_survey'),
  surveyor: varchar('surveyor', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow()
});

export const nilaiPenting = pgTable('nilai_penting', {
  id: serial('id').primaryKey(),
  kawasanId: integer('kawasan_id').references(() => kawasan.id, { onDelete: 'cascade' }),
  kategoriNilai: kategoriNilaiEnum('kategori_nilai').notNull(),
  namaNilai: varchar('nama_nilai', { length: 255 }).notNull(),
  deskripsi: text('deskripsi'),
  tingkatKepentingan: tingkatKepentinganEnum('tingkat_kepentingan').default('Sedang'),
  indikatorNilai: text('indikator_nilai'),
  potensiAncaman: text('potensi_ancaman'),
  upayaPelestarian: text('upaya_pelestarian'),
  createdAt: timestamp('created_at').defaultNow()
});

export const surveyMonitoring = pgTable('survey_monitoring', {
  id: serial('id').primaryKey(),
  kawasanId: integer('kawasan_id').references(() => kawasan.id, { onDelete: 'cascade' }),
  jenisSurvey: jenisSurveyEnum('jenis_survey'),
  tanggalSurvey: date('tanggal_survey'),
  timSurvey: varchar('tim_survey', { length: 255 }),
  metodologi: text('metodologi'),
  hasilUtama: text('hasil_utama'),
  rekomendasi: text('rekomendasi'),
  fileLaporan: varchar('file_laporan', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow()
});

// Relations
export const kawasanRelations = relations(kawasan, ({ many }) => ({
  skDocuments: many(skDocuments),
  blokPengelolaan: many(blokPengelolaan),
  rpjp: many(rpjp),
  tipeEkosistem: many(tipeEkosistem),
  tutupanLahan: many(tutupanLahan),
  openArea: many(openArea),
  keanekaragamanHayati: many(keanekaragamanHayati),
  nilaiPenting: many(nilaiPenting),
  surveyMonitoring: many(surveyMonitoring)
}));

export const skDocumentsRelations = relations(skDocuments, ({ one }) => ({
  kawasan: one(kawasan, {
    fields: [skDocuments.kawasanId],
    references: [kawasan.id]
  })
}));

export const blokPengelolaanRelations = relations(blokPengelolaan, ({ one }) => ({
  kawasan: one(kawasan, {
    fields: [blokPengelolaan.kawasanId],
    references: [kawasan.id]
  })
}));

export const rpjpRelations = relations(rpjp, ({ one }) => ({
  kawasan: one(kawasan, {
    fields: [rpjp.kawasanId],
    references: [kawasan.id]
  })
}));

export const tipeEkosistemRelations = relations(tipeEkosistem, ({ one }) => ({
  kawasan: one(kawasan, {
    fields: [tipeEkosistem.kawasanId],
    references: [kawasan.id]
  })
}));

export const tutupanLahanRelations = relations(tutupanLahan, ({ one }) => ({
  kawasan: one(kawasan, {
    fields: [tutupanLahan.kawasanId],
    references: [kawasan.id]
  })
}));

export const openAreaRelations = relations(openArea, ({ one }) => ({
  kawasan: one(kawasan, {
    fields: [openArea.kawasanId],
    references: [kawasan.id]
  })
}));

export const keanekaragamanHayatiRelations = relations(keanekaragamanHayati, ({ one }) => ({
  kawasan: one(kawasan, {
    fields: [keanekaragamanHayati.kawasanId],
    references: [kawasan.id]
  })
}));

export const nilaiPentingRelations = relations(nilaiPenting, ({ one }) => ({
  kawasan: one(kawasan, {
    fields: [nilaiPenting.kawasanId],
    references: [kawasan.id]
  })
}));

export const surveyMonitoringRelations = relations(surveyMonitoring, ({ one }) => ({
  kawasan: one(kawasan, {
    fields: [surveyMonitoring.kawasanId],
    references: [kawasan.id]
  })
}));
