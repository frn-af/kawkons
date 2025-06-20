// Global type definitions for the application

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Kawasan {
  id: number;
  namaKawasan: string;
  noRegistrasi: string | null;
  kategoriKawasan:
    | "Cagar_Alam"
    | "Suaka_Margasatwa"
    | "Taman_Wisata_Alam"
    | "KAS/KPA";
  letak: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface SKDocument {
  id: string;
  kawasanId: string;
  jenisSk: string;
  nomorSk?: string;
  tanggalSk?: string;
  instansiPenerbit?: string;
}

export interface BiodiversityData {
  id: string;
  kawasanId: string;
  namaLokal?: string;
  namaIlmiah?: string;
  kategori?: string;
  statusKonservasi?: string;
  habitatUtama?: string;
}

export interface ManagementBlock {
  id: string;
  kawasanId: string;
  namaBlok: string;
  fungsiBlok?: string;
  luasHa?: number;
  keterangan?: string;
}

export interface ImportantValue {
  id: string;
  kawasanId: string;
  namaNilai: string;
  kategoriNilai?: string;
  tingkatKepentingan?: string;
  deskripsi?: string;
}

export interface OpenArea {
  id: string;
  kawasanId: string;
  namaArea: string;
  jenisPembukaan?: string;
  luasHa?: number;
  penyebab?: string;
}

export interface RPJP {
  id: string;
  kawasanId: string;
  periodeAwal: number;
  periodeAkhir: number;
  tujuan?: string;
  status?: string;
}

export interface EcosystemType {
  id: string;
  kawasanId: string;
  namaEkosistem: string;
  deskripsi?: string;
  persentaseKawasan?: number;
  kondisi?: string;
}

export interface LandCover {
  id: string;
  kawasanId: string;
  jenisTutupan: string;
  luasHa?: number;
  persentase?: number;
  tahunData?: number;
}

export interface EfektivitasData {
  id: number;
  kawasanId: number | null;
  tahun: number;
  skor: number;
  keterangan: string | null;
  createdAt: Date | null;
  namaKawasan: string;
  kategoriKawasan: string;
}

export interface EfektivitasAssessment {
  id: number;
  kawasanId: number | null;
  tahun: number;
  skor: number;
  nilaiEfektivitas:
    | "belum_dilakukan"
    | "tidak_efektif"
    | "kurang_efektif"
    | "efektif"
    | null;
  keterangan: string | null;
  createdAt: Date | null;
}

// Form props interface
export interface FormProps {
  selectedKawasanId: string;
  onSubmitSuccess: () => void;
}

// Map related types
export interface MapFeature extends GeoJSON.Feature {
  properties: {
    NOREGKK: string;
    [key: string]: any;
  };
}
