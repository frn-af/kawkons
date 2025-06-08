"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { bulkInsertEfektivitas } from "@/lib/actions/monitoring";
import type { Kawasan } from "@/lib/db/schema";
import {
  calculateEfektivitasCategory,
  getEfektivitasCategoryDisplay,
} from "@/utils/efektivitas";
import {
  AlertCircle,
  CheckCircle,
  Download,
  FileText,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";

interface ImportRecord {
  namaKawasan: string;
  tahun: number;
  skor: number;
  keterangan?: string;
  status: "valid" | "invalid" | "duplicate";
  error?: string;
  kawasanId?: number;
}

interface ImportEfektivitasProps {
  kawasanList: Kawasan[];
  onSuccess?: () => void;
}

export function ImportEfektivitas({
  kawasanList,
  onSuccess,
}: ImportEfektivitasProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [importData, setImportData] = useState<ImportRecord[]>([]);
  const [step, setStep] = useState<"upload" | "preview" | "complete">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const text = await file.text();
      const records = parseCSV(text);
      const validatedRecords = validateRecords(records);
      setImportData(validatedRecords);
      setStep("preview");
    } catch (error) {
      console.error("Error parsing file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const parseCSV = (text: string): Partial<ImportRecord>[] => {
    const lines = text.split("\n").filter((line) => line.trim());
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

    return lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim());
      const record: Partial<ImportRecord> = {};

      headers.forEach((header, index) => {
        const value = values[index];
        switch (header) {
          case "nama_kawasan":
          case "nama kawasan":
          case "kawasan":
            record.namaKawasan = value;
            break;
          case "tahun":
          case "year":
            record.tahun = parseInt(value);
            break;
          case "skor":
          case "score":
          case "nilai":
            record.skor = parseFloat(value);
            break;
          case "keterangan":
          case "description":
          case "notes":
            record.keterangan = value;
            break;
        }
      });

      return record;
    });
  };

  const validateRecords = (
    records: Partial<ImportRecord>[]
  ): ImportRecord[] => {
    return records.map((record) => {
      const errors: string[] = [];

      if (!record.namaKawasan) {
        errors.push("Nama kawasan harus diisi");
      }

      if (!record.tahun || record.tahun < 2000 || record.tahun > 2030) {
        errors.push("Tahun harus antara 2000-2030");
      }

      if (record.skor === undefined || record.skor < 0 || record.skor > 100) {
        errors.push("Skor harus antara 0-100");
      }

      // Find matching kawasan
      const matchingKawasan = kawasanList.find(
        (k) => k.namaKawasan.toLowerCase() === record.namaKawasan?.toLowerCase()
      );

      if (!matchingKawasan) {
        errors.push("Kawasan tidak ditemukan dalam database");
      }

      return {
        namaKawasan: record.namaKawasan || "",
        tahun: record.tahun || 0,
        skor: record.skor || 0,
        keterangan: record.keterangan,
        kawasanId: matchingKawasan?.id,
        status: errors.length > 0 ? "invalid" : "valid",
        error: errors.join(", "),
      } as ImportRecord;
    });
  };

  const handleImport = async () => {
    setIsLoading(true);
    try {
      const validRecords = importData.filter(
        (record) => record.status === "valid"
      );
      const dataToInsert = validRecords.map((record) => ({
        kawasanId: record.kawasanId!,
        tahun: record.tahun,
        skor: record.skor,
        keterangan: record.keterangan || null,
      }));

      await bulkInsertEfektivitas(dataToInsert);
      setStep("complete");
      onSuccess?.();
    } catch (error) {
      console.error("Error importing data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTemplate = () => {
    const template = `nama_kawasan,tahun,skor,keterangan
Contoh Kawasan 1,2024,85,Efektivitas baik
Contoh Kawasan 2,2024,65,Perlu peningkatan`;

    const blob = new Blob([template], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template_efektivitas.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const validCount = importData.filter((r) => r.status === "valid").length;
  const invalidCount = importData.filter((r) => r.status === "invalid").length;
  const resetDialog = () => {
    setStep("upload");
    setImportData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetDialog();
    }
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            console.log("Import button clicked");
            setOpen(true);
          }}
        >
          <Upload className="h-4 w-4 mr-2" />
          Import Data
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Data Efektivitas</DialogTitle>
        </DialogHeader>

        {step === "upload" && (
          <div className="space-y-4">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Upload File CSV</h3>
              <p className="text-muted-foreground mb-4">
                Upload file CSV dengan kolom: nama_kawasan, tahun, skor,
                keterangan
              </p>
            </div>

            <div className="space-y-2">
              <Input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={isLoading}
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadTemplate}
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </div>
            </div>

            {isLoading && (
              <div className="text-center py-4 text-muted-foreground">
                Memproses file...
              </div>
            )}
          </div>
        )}

        {step === "preview" && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Card className="flex-1">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {validCount}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Data Valid
                  </div>
                </CardContent>
              </Card>
              <Card className="flex-1">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {invalidCount}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Data Invalid
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="max-h-60 overflow-y-auto border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-2 text-left">Kawasan</th>
                    <th className="p-2 text-left">Tahun</th>
                    <th className="p-2 text-left">Skor</th>
                    <th className="p-2 text-left">Kategori</th>
                    <th className="p-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {importData.map((record, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{record.namaKawasan}</td>
                      <td className="p-2">{record.tahun}</td>
                      <td className="p-2">{record.skor}</td>
                      <td className="p-2">
                        {record.status === "valid" && (
                          <Badge variant="outline">
                            {getEfektivitasCategoryDisplay(
                              calculateEfektivitasCategory(record.skor)
                            )}
                          </Badge>
                        )}
                      </td>
                      <td className="p-2">
                        {record.status === "valid" ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Valid
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Invalid
                          </Badge>
                        )}
                        {record.error && (
                          <div className="text-xs text-red-600 mt-1">
                            {record.error}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep("upload")}
                className="flex-1"
              >
                Kembali
              </Button>
              <Button
                onClick={handleImport}
                disabled={validCount === 0 || isLoading}
                className="flex-1"
              >
                {isLoading ? "Mengimpor..." : `Import ${validCount} Data`}
              </Button>
            </div>
          </div>
        )}

        {step === "complete" && (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 mx-auto text-green-600 mb-4" />
            <h3 className="text-lg font-medium mb-2">Import Berhasil!</h3>
            <p className="text-muted-foreground mb-4">
              {validCount} data efektivitas berhasil diimpor.
            </p>
            <Button onClick={() => setOpen(false)}>Tutup</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
