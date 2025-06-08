"use client";

import { DataSection } from "@/components/data-section";
import { BiodiversityForm } from "@/components/form/create-biodiversity";
import { BlokPengelolaanForm } from "@/components/form/create-blok-pengelolaan";
import { NilaiPentingForm } from "@/components/form/create-nilai-penting";
import { OpenAreaForm } from "@/components/form/create-open-area";
import { RPJPForm } from "@/components/form/create-rpjp";
import { SKDocumentForm } from "@/components/form/create-sk-document";
import { CreateTipeEkosistemForm } from "@/components/form/create-tipe-ekosistem";
import { CreateTutupanLahanForm } from "@/components/form/create-tutupan-lahan";
import { Separator } from "@/components/ui/separator";
import { getKeanekaragamanHayati } from "@/lib/actions/biodiversity";
import { getSkDocumentsByKawasan } from "@/lib/actions/kawasan/sk_document";
import {
  getBlokPengelolaanByKawasan,
  getRpjpByKawasan,
} from "@/lib/actions/management";
import {
  getNilaiPenting,
  getOpenAreaByKawasan,
  getTipeEkosistemByKawasan,
  getTutupanLahanByKawasan,
} from "@/lib/actions/monitoring";
import { Kawasan } from "@/lib/db/schema";
import React, { useEffect, useState } from "react";

const labelMap: Record<string, string> = {
  Cagar_Alam: "CA",
  Suaka_Margasatwa: "SM",
  Taman_Wisata_Alam: "TWA",
  "KAS/KPA": "KAS/KPA",
};

interface FeatureDetailProps {
  dataKawasan: Kawasan[] | null;
  selectedFeature: GeoJSON.Feature | null;
}

export const FeatureDetail = React.memo(
  ({ dataKawasan, selectedFeature }: FeatureDetailProps) => {
    const [isSKDialogOpen, setIsSKDialogOpen] = useState(false);
    const [isBiodiversityDialogOpen, setIsBiodiversityDialogOpen] =
      useState(false);
    const [isBlokDialogOpen, setIsBlokDialogOpen] = useState(false);
    const [isNilaiDialogOpen, setIsNilaiDialogOpen] = useState(false);
    const [isOpenAreaDialogOpen, setIsOpenAreaDialogOpen] = useState(false);
    const [isRPJPDialogOpen, setIsRPJPDialogOpen] = useState(false);
    const [isEkosistemDialogOpen, setIsEkosistemDialogOpen] = useState(false);
    const [isTutupanDialogOpen, setIsTutupanDialogOpen] = useState(false);

    // State for storing fetched data
    const [skDocuments, setSkDocuments] = useState<any[]>([]);
    const [biodiversityData, setBiodiversityData] = useState<any[]>([]);
    const [blokData, setBlokData] = useState<any[]>([]);
    const [nilaiData, setNilaiData] = useState<any[]>([]);
    const [openAreaData, setOpenAreaData] = useState<any[]>([]);
    const [rpjpData, setRpjpData] = useState<any[]>([]);
    const [ekosistemData, setEkosistemData] = useState<any[]>([]);
    const [tutupanData, setTutupanData] = useState<any[]>([]);
    const [dataLoading, setDataLoading] = useState(true); // Fetch data when kawasan changes
    useEffect(() => {
      const fetchData = async () => {
        // Early return if required data is not available
        if (!dataKawasan || !selectedFeature) {
          setDataLoading(false);
          return;
        }

        const currentKawasan = dataKawasan.find(
          (k) => k.noRegistrasi === selectedFeature.properties?.NOREGKK
        );

        if (!currentKawasan) {
          setDataLoading(false);
          return;
        }

        setDataLoading(true);

        try {
          // Fetch all data types
          const [
            skDocsResult,
            biodiversityResult,
            blokResult,
            nilaiResult,
            openAreaResult,
            rpjpResult,
            ekosistemResult,
            tutupanResult,
          ] = await Promise.all([
            getSkDocumentsByKawasan(currentKawasan.id),
            getKeanekaragamanHayati(currentKawasan.id),
            getBlokPengelolaanByKawasan(currentKawasan.id),
            getNilaiPenting(currentKawasan.id),
            getOpenAreaByKawasan(currentKawasan.id),
            getRpjpByKawasan(currentKawasan.id),
            getTipeEkosistemByKawasan(currentKawasan.id),
            getTutupanLahanByKawasan(currentKawasan.id),
          ]); // Update state with fetched data
          setSkDocuments(
            skDocsResult.success && skDocsResult.data ? skDocsResult.data : []
          );
          setBiodiversityData(
            biodiversityResult.success && biodiversityResult.data
              ? biodiversityResult.data
              : []
          );
          setBlokData(
            blokResult.success && blokResult.data ? blokResult.data : []
          );
          setNilaiData(
            nilaiResult.success && nilaiResult.data ? nilaiResult.data : []
          );
          setOpenAreaData(
            openAreaResult.success && openAreaResult.data
              ? openAreaResult.data
              : []
          );
          setRpjpData(
            rpjpResult.success && rpjpResult.data ? rpjpResult.data : []
          );
          setEkosistemData(
            ekosistemResult.success && ekosistemResult.data
              ? ekosistemResult.data
              : []
          );
          setTutupanData(
            tutupanResult.success && tutupanResult.data
              ? tutupanResult.data
              : []
          );
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setDataLoading(false);
        }
      };

      fetchData();
    }, [dataKawasan, selectedFeature]);

    if (!dataKawasan || !selectedFeature) return <p>Loading...</p>;

    const kawasan = dataKawasan.find(
      (k) => k.noRegistrasi === selectedFeature.properties?.NOREGKK
    );

    if (!kawasan) {
      return (
        <h2 className="text-lg font-semibold mb-4">Kawasan tidak ditemukan</h2>
      );
    }

    return (
      <>
        <h2 className="text-lg font-semibold mb-4 capitalize">
          {labelMap[kawasan.kategoriKawasan] ?? kawasan.kategoriKawasan}
          {kawasan.namaKawasan}
        </h2>
        <Separator className="mb-4" />
        <ul className="mb-6">
          <li className="mb-2">
            <strong>No Registrasi:</strong> {kawasan.noRegistrasi}
          </li>
          <li className="mb-2">
            <strong>Letak:</strong> {kawasan.letak}
          </li>
        </ul>{" "}
        <div className="space-y-3">
          <DataSection
            title="SK Documents"
            data={skDocuments}
            isDialogOpen={isSKDialogOpen}
            onDialogChange={setIsSKDialogOpen}
            buttonText="Add SK Document"
            dialogTitle={`Create SK Document for ${kawasan.namaKawasan}`}
            borderColor="border-blue-500"
            renderDataItem={(doc: any) => (
              <>
                <p className="font-medium">{doc.jenisSk?.replace(/_/g, " ")}</p>
                {doc.nomorSk && (
                  <p className="text-sm text-gray-600">No: {doc.nomorSk}</p>
                )}
                {doc.tanggalSk && (
                  <p className="text-sm text-gray-600">
                    Tanggal: {doc.tanggalSk}
                  </p>
                )}
                {doc.instansiPenerbit && (
                  <p className="text-sm text-gray-600">
                    Instansi: {doc.instansiPenerbit}
                  </p>
                )}
              </>
            )}
          >
            <SKDocumentForm
              selectedKawasanId={kawasan.id}
              onSubmitSuccess={async () => {
                setIsSKDialogOpen(false);
                const result = await getSkDocumentsByKawasan(kawasan.id);
                if (result.success && result.data) setSkDocuments(result.data);
              }}
            />
          </DataSection>

          <DataSection
            title="Biodiversity Data"
            data={biodiversityData}
            isDialogOpen={isBiodiversityDialogOpen}
            onDialogChange={setIsBiodiversityDialogOpen}
            buttonText="Add Biodiversity Data"
            dialogTitle={`Create Biodiversity Data for ${kawasan.namaKawasan}`}
            borderColor="border-green-500"
            renderDataItem={(item: any) => (
              <>
                <p className="font-medium">
                  {item.namaLokal || item.namaIlmiah || "Unknown Species"}
                </p>
                {item.namaIlmiah && (
                  <p className="text-sm text-gray-600 italic">
                    {item.namaIlmiah}
                  </p>
                )}
                {item.kategori && (
                  <p className="text-sm text-gray-600">
                    Kategori: {item.kategori}
                  </p>
                )}
                {item.statusKonservasi && (
                  <p className="text-sm text-gray-600">
                    Status: {item.statusKonservasi}
                  </p>
                )}
                {item.habitatUtama && (
                  <p className="text-sm text-gray-600">
                    Habitat: {item.habitatUtama}
                  </p>
                )}
              </>
            )}
          >
            <BiodiversityForm
              selectedKawasanId={kawasan.id}
              onSubmitSuccess={async () => {
                setIsBiodiversityDialogOpen(false);
                const result = await getKeanekaragamanHayati(kawasan.id);
                if (result.success && result.data)
                  setBiodiversityData(result.data);
              }}
            />
          </DataSection>

          <DataSection
            title="Management Blocks"
            data={blokData}
            isDialogOpen={isBlokDialogOpen}
            onDialogChange={setIsBlokDialogOpen}
            buttonText="Add Management Block"
            dialogTitle={`Create Management Block for ${kawasan.namaKawasan}`}
            borderColor="border-orange-500"
            renderDataItem={(item: any) => (
              <>
                <p className="font-medium">{item.namaBlok}</p>
                {item.fungsiBlok && (
                  <p className="text-sm text-gray-600">
                    Fungsi: {item.fungsiBlok}
                  </p>
                )}
                {item.luasHa && (
                  <p className="text-sm text-gray-600">
                    Luas: {item.luasHa} Ha
                  </p>
                )}
                {item.keterangan && (
                  <p className="text-sm text-gray-600">{item.keterangan}</p>
                )}
              </>
            )}
          >
            <BlokPengelolaanForm
              selectedKawasanId={kawasan.id}
              onSubmitSuccess={async () => {
                setIsBlokDialogOpen(false);
                const result = await getBlokPengelolaanByKawasan(kawasan.id);
                if (result.success && result.data) setBlokData(result.data);
              }}
            />
          </DataSection>

          <DataSection
            title="Important Values"
            data={nilaiData}
            isDialogOpen={isNilaiDialogOpen}
            onDialogChange={setIsNilaiDialogOpen}
            buttonText="Add Important Values"
            dialogTitle={`Create Important Values for ${kawasan.namaKawasan}`}
            borderColor="border-purple-500"
            renderDataItem={(item: any) => (
              <>
                <p className="font-medium">{item.namaNilai}</p>
                {item.kategoriNilai && (
                  <p className="text-sm text-gray-600">
                    Kategori: {item.kategoriNilai}
                  </p>
                )}
                {item.tingkatKepentingan && (
                  <p className="text-sm text-gray-600">
                    Tingkat: {item.tingkatKepentingan}
                  </p>
                )}
                {item.deskripsi && (
                  <p className="text-sm text-gray-600">{item.deskripsi}</p>
                )}
              </>
            )}
          >
            <NilaiPentingForm
              selectedKawasanId={kawasan.id}
              onSubmitSuccess={async () => {
                setIsNilaiDialogOpen(false);
                const result = await getNilaiPenting(kawasan.id);
                if (result.success && result.data) setNilaiData(result.data);
              }}
            />
          </DataSection>

          <DataSection
            title="Open Areas"
            data={openAreaData}
            isDialogOpen={isOpenAreaDialogOpen}
            onDialogChange={setIsOpenAreaDialogOpen}
            buttonText="Add Open Area"
            dialogTitle={`Create Open Area Data for ${kawasan.namaKawasan}`}
            borderColor="border-yellow-500"
            renderDataItem={(item: any) => (
              <>
                <p className="font-medium">{item.namaArea}</p>
                {item.jenisPembukaan && (
                  <p className="text-sm text-gray-600">
                    Jenis: {item.jenisPembukaan}
                  </p>
                )}
                {item.luasHa && (
                  <p className="text-sm text-gray-600">
                    Luas: {item.luasHa} Ha
                  </p>
                )}
                {item.penyebab && (
                  <p className="text-sm text-gray-600">{item.penyebab}</p>
                )}
              </>
            )}
          >
            <OpenAreaForm
              selectedKawasanId={kawasan.id}
              onSubmitSuccess={async () => {
                setIsOpenAreaDialogOpen(false);
                const result = await getOpenAreaByKawasan(kawasan.id);
                if (result.success && result.data) setOpenAreaData(result.data);
              }}
            />
          </DataSection>

          <DataSection
            title="RPJP Documents"
            data={rpjpData}
            isDialogOpen={isRPJPDialogOpen}
            onDialogChange={setIsRPJPDialogOpen}
            buttonText="Add RPJP Document"
            dialogTitle={`Create RPJP Document for ${kawasan.namaKawasan}`}
            borderColor="border-indigo-500"
            renderDataItem={(item: any) => (
              <>
                <p className="font-medium">
                  RPJP {item.periodeAwal} - {item.periodeAkhir}
                </p>
                {item.tujuan && (
                  <p className="text-sm text-gray-600">Tujuan: {item.tujuan}</p>
                )}
                {item.status && (
                  <p className="text-sm text-gray-600">Status: {item.status}</p>
                )}
              </>
            )}
          >
            <RPJPForm
              selectedKawasanId={kawasan.id}
              onSubmitSuccess={async () => {
                setIsRPJPDialogOpen(false);
                const result = await getRpjpByKawasan(kawasan.id);
                if (result.success && result.data) setRpjpData(result.data);
              }}
            />
          </DataSection>

          <DataSection
            title="Ecosystem Types"
            data={ekosistemData}
            isDialogOpen={isEkosistemDialogOpen}
            onDialogChange={setIsEkosistemDialogOpen}
            buttonText="Add Ecosystem Type"
            dialogTitle={`Create Ecosystem Type for ${kawasan.namaKawasan}`}
            borderColor="border-teal-500"
            renderDataItem={(item: any) => (
              <>
                <p className="font-medium">{item.namaEkosistem}</p>
                {item.deskripsi && (
                  <p className="text-sm text-gray-600">{item.deskripsi}</p>
                )}
                {item.persentaseKawasan && (
                  <p className="text-sm text-gray-600">
                    Persentase: {item.persentaseKawasan}%
                  </p>
                )}
                {item.kondisi && (
                  <p className="text-sm text-gray-600">
                    Kondisi: {item.kondisi}
                  </p>
                )}
              </>
            )}
          >
            <CreateTipeEkosistemForm
              selectedKawasanId={kawasan.id}
              onSubmitSuccess={async () => {
                setIsEkosistemDialogOpen(false);
                const result = await getTipeEkosistemByKawasan(kawasan.id);
                if (result.success && result.data)
                  setEkosistemData(result.data);
              }}
            />
          </DataSection>

          <DataSection
            title="Land Cover Data"
            data={tutupanData}
            isDialogOpen={isTutupanDialogOpen}
            onDialogChange={setIsTutupanDialogOpen}
            buttonText="Add Land Cover Data"
            dialogTitle={`Create Land Cover Data for ${kawasan.namaKawasan}`}
            borderColor="border-red-500"
            renderDataItem={(item: any) => (
              <>
                <p className="font-medium">{item.jenisTutupan}</p>
                {item.luasHa && (
                  <p className="text-sm text-gray-600">
                    Luas: {item.luasHa} Ha
                  </p>
                )}
                {item.persentase && (
                  <p className="text-sm text-gray-600">
                    Persentase: {item.persentase}%
                  </p>
                )}
                {item.tahunData && (
                  <p className="text-sm text-gray-600">
                    Tahun Data: {item.tahunData}
                  </p>
                )}
              </>
            )}
          >
            <CreateTutupanLahanForm
              selectedKawasanId={kawasan.id}
              onSubmitSuccess={async () => {
                setIsTutupanDialogOpen(false);
                const result = await getTutupanLahanByKawasan(kawasan.id);
                if (result.success && result.data) setTutupanData(result.data);
              }}
            />
          </DataSection>
        </div>
      </>
    );
  }
);

FeatureDetail.displayName = "FeatureDetail";
