import { z } from "zod";

// Kawasan schema
export const KawasanSchema = z.object({
  id: z.string().min(1, "ID is required"),
  namaKawasan: z.string().min(1, "Nama kawasan is required"),
  noRegistrasi: z.string().min(1, "No registrasi is required"),
  kategoriKawasan: z.enum([
    "Cagar_Alam",
    "Suaka_Margasatwa",
    "Taman_Wisata_Alam",
    "KAS/KPA",
  ]),
  letak: z.string().min(1, "Letak is required"),
});

// SK Document schema
export const SKDocumentSchema = z.object({
  kawasanId: z.string().min(1, "Kawasan ID is required"),
  jenisSk: z.string().min(1, "Jenis SK is required"),
  nomorSk: z.string().optional(),
  tanggalSk: z.string().optional(),
  instansiPenerbit: z.string().optional(),
});

// Biodiversity schema
export const BiodiversitySchema = z
  .object({
    kawasanId: z.string().min(1, "Kawasan ID is required"),
    namaLokal: z.string().optional(),
    namaIlmiah: z.string().optional(),
    kategori: z.string().optional(),
    statusKonservasi: z.string().optional(),
    habitatUtama: z.string().optional(),
  })
  .refine((data) => data.namaLokal || data.namaIlmiah, {
    message: "Either nama lokal or nama ilmiah is required",
  });

// Management Block schema
export const ManagementBlockSchema = z.object({
  kawasanId: z.string().min(1, "Kawasan ID is required"),
  namaBlok: z.string().min(1, "Nama blok is required"),
  fungsiBlok: z.string().optional(),
  luasHa: z.number().positive().optional(),
  keterangan: z.string().optional(),
});

// Important Value schema
export const ImportantValueSchema = z.object({
  kawasanId: z.string().min(1, "Kawasan ID is required"),
  namaNilai: z.string().min(1, "Nama nilai is required"),
  kategoriNilai: z.string().optional(),
  tingkatKepentingan: z.string().optional(),
  deskripsi: z.string().optional(),
});

// Open Area schema
export const OpenAreaSchema = z.object({
  kawasanId: z.string().min(1, "Kawasan ID is required"),
  namaArea: z.string().min(1, "Nama area is required"),
  jenisPembukaan: z.string().optional(),
  luasHa: z.number().positive().optional(),
  penyebab: z.string().optional(),
});

// RPJP schema
export const RPJPSchema = z
  .object({
    kawasanId: z.string().min(1, "Kawasan ID is required"),
    periodeAwal: z.number().int().min(1900).max(2100),
    periodeAkhir: z.number().int().min(1900).max(2100),
    tujuan: z.string().optional(),
    status: z.string().optional(),
  })
  .refine((data) => data.periodeAkhir > data.periodeAwal, {
    message: "Periode akhir must be greater than periode awal",
  });

// Ecosystem Type schema
export const EcosystemTypeSchema = z.object({
  kawasanId: z.string().min(1, "Kawasan ID is required"),
  namaEkosistem: z.string().min(1, "Nama ekosistem is required"),
  deskripsi: z.string().optional(),
  persentaseKawasan: z.number().min(0).max(100).optional(),
  kondisi: z.string().optional(),
});

// Land Cover schema
export const LandCoverSchema = z.object({
  kawasanId: z.string().min(1, "Kawasan ID is required"),
  jenisTutupan: z.string().min(1, "Jenis tutupan is required"),
  luasHa: z.number().positive().optional(),
  persentase: z.number().min(0).max(100).optional(),
  tahunData: z.number().int().min(1900).max(2100).optional(),
});

// Form validation schemas (for create operations)
export const CreateKawasanSchema = KawasanSchema.omit({ id: true });
export const CreateSKDocumentSchema = SKDocumentSchema;
export const CreateBiodiversitySchema = BiodiversitySchema;
export const CreateManagementBlockSchema = ManagementBlockSchema;
export const CreateImportantValueSchema = ImportantValueSchema;
export const CreateOpenAreaSchema = OpenAreaSchema;
export const CreateRPJPSchema = RPJPSchema;
export const CreateEcosystemTypeSchema = EcosystemTypeSchema;
export const CreateLandCoverSchema = LandCoverSchema;
