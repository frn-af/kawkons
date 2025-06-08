"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getAllEfektivitas,
  getEfektivitasByKawasan,
  getEfektivitasByYear,
} from "@/lib/actions/monitoring";
import type { Kawasan } from "@/lib/db/schema";
import {
  calculateEfektivitasCategory,
  getEfektivitasCategoryDisplay,
} from "@/utils/efektivitas";
import { Calendar, Download, FileText, Map } from "lucide-react";
import { useState } from "react";

interface ExportEfektivitasProps {
  kawasanList: Kawasan[];
  availableYears: number[];
}

export function ExportEfektivitas({
  kawasanList,
  availableYears,
}: ExportEfektivitasProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [exportType, setExportType] = useState<"all" | "year" | "kawasan">(
    "all"
  );
  const [selectedYear, setSelectedYear] = useState<number>(0);
  const [selectedKawasan, setSelectedKawasan] = useState<number>(0);

  const handleExport = async () => {
    setIsLoading(true);
    try {
      let data;
      let filename = "efektivitas_pengelolaan";

      switch (exportType) {
        case "year":
          data = await getEfektivitasByYear(selectedYear);
          filename += `_${selectedYear}`;
          break;
        case "kawasan":
          data = await getEfektivitasByKawasan(selectedKawasan);
          const kawasanName = kawasanList.find(
            (k) => k.id === selectedKawasan
          )?.namaKawasan;
          filename += `_${kawasanName?.replace(/\s+/g, "_")}`;
          break;
        default:
          data = await getAllEfektivitas();
          break;
      }

      exportToCSV(data, filename);
      setOpen(false);
    } catch (error) {
      console.error("Error exporting data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    const headers = [
      "ID",
      "Nama Kawasan",
      "Kategori Kawasan",
      "Tahun",
      "Skor",
      "Kategori Efektivitas",
      "Keterangan",
      "Tanggal Input",
    ];

    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        [
          row.id,
          `"${row.namaKawasan || ""}"`,
          `"${row.kategoriKawasan?.replace(/_/g, " ") || ""}"`,
          row.tahun,
          row.skor,
          `"${getEfektivitasCategoryDisplay(
            calculateEfektivitasCategory(row.skor)
          )}"`,
          `"${row.keterangan || ""}"`,
          row.createdAt
            ? new Date(row.createdAt).toLocaleDateString("id-ID")
            : "",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToExcel = (data: any[], filename: string) => {
    // Simple tab-separated format that Excel can read
    const headers = [
      "ID",
      "Nama Kawasan",
      "Kategori Kawasan",
      "Tahun",
      "Skor",
      "Kategori Efektivitas",
      "Keterangan",
      "Tanggal Input",
    ];

    const excelContent = [
      headers.join("\t"),
      ...data.map((row) =>
        [
          row.id,
          row.namaKawasan || "",
          row.kategoriKawasan?.replace(/_/g, " ") || "",
          row.tahun,
          row.skor,
          getEfektivitasCategoryDisplay(calculateEfektivitasCategory(row.skor)),
          row.keterangan || "",
          row.createdAt
            ? new Date(row.createdAt).toLocaleDateString("id-ID")
            : "",
        ].join("\t")
      ),
    ].join("\n");

    const blob = new Blob([excelContent], { type: "application/vnd.ms-excel" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.xls`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Export Data Efektivitas</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Pilih Jenis Export
            </label>
            <Select
              value={exportType}
              onValueChange={(value: any) => setExportType(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Semua Data
                  </div>
                </SelectItem>
                <SelectItem value="year">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Per Tahun
                  </div>
                </SelectItem>
                <SelectItem value="kawasan">
                  <div className="flex items-center gap-2">
                    <Map className="h-4 w-4" />
                    Per Kawasan
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {exportType === "year" && (
            <div>
              <label className="text-sm font-medium mb-2 block">
                Pilih Tahun
              </label>
              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tahun" />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {exportType === "kawasan" && (
            <div>
              <label className="text-sm font-medium mb-2 block">
                Pilih Kawasan
              </label>
              <Select
                value={selectedKawasan.toString()}
                onValueChange={(value) => setSelectedKawasan(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kawasan" />
                </SelectTrigger>
                <SelectContent>
                  {kawasanList.map((kawasan) => (
                    <SelectItem key={kawasan.id} value={kawasan.id.toString()}>
                      {kawasan.namaKawasan}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium block">Format File</label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsLoading(true);
                  handleExport().then(() => {
                    // CSV export is handled in handleExport
                  });
                }}
                disabled={
                  isLoading ||
                  (exportType === "year" && !selectedYear) ||
                  (exportType === "kawasan" && !selectedKawasan)
                }
                className="flex-1"
              >
                <FileText className="h-4 w-4 mr-2" />
                CSV
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  setIsLoading(true);
                  try {
                    let data;
                    let filename = "efektivitas_pengelolaan";

                    switch (exportType) {
                      case "year":
                        data = await getEfektivitasByYear(selectedYear);
                        filename += `_${selectedYear}`;
                        break;
                      case "kawasan":
                        data = await getEfektivitasByKawasan(selectedKawasan);
                        const kawasanName = kawasanList.find(
                          (k) => k.id === selectedKawasan
                        )?.namaKawasan;
                        filename += `_${kawasanName?.replace(/\s+/g, "_")}`;
                        break;
                      default:
                        data = await getAllEfektivitas();
                        break;
                    }

                    exportToExcel(data, filename);
                    setOpen(false);
                  } catch (error) {
                    console.error("Error exporting data:", error);
                  } finally {
                    setIsLoading(false);
                  }
                }}
                disabled={
                  isLoading ||
                  (exportType === "year" && !selectedYear) ||
                  (exportType === "kawasan" && !selectedKawasan)
                }
                className="flex-1"
              >
                <FileText className="h-4 w-4 mr-2" />
                Excel
              </Button>
            </div>
          </div>

          <div className="bg-muted p-3 rounded-lg text-sm">
            <div className="font-medium mb-1">Format Export:</div>
            <ul className="text-muted-foreground space-y-1">
              <li>• ID, Nama Kawasan, Kategori</li>
              <li>• Tahun, Skor, Kategori Efektivitas</li>
              <li>• Keterangan, Tanggal Input</li>
            </ul>
          </div>

          {isLoading && (
            <div className="text-center py-2 text-muted-foreground">
              Sedang memproses export...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
