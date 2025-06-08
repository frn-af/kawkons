"use client";

import { EfektivitasPivotActions } from "@/components/efektivitas-pivot-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { EfektivitasData, Kawasan } from "@/types";
import {
  calculateEfektivitasCategory,
  getEfektivitasCategoryColor,
  getEfektivitasCategoryDisplay,
} from "@/utils/efektivitas";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

// Type for pivot table data structure
export interface PivotEfektivitasData {
  id: string;
  namaKawasan: string;
  kategoriKawasan: string;
  yearScores: Record<number, number>; // year -> score mapping
  latestScore: number;
  latestYear: number;
  category: string;
}

interface CreateEfektivitasColumnsProps {
  availableYears: number[];
  kawasanList: Kawasan[];
  onDataChange: () => void;
}

export function createEfektivitasColumns({
  availableYears,
  kawasanList,
  onDataChange,
}: CreateEfektivitasColumnsProps): ColumnDef<PivotEfektivitasData>[] {
  const columns: ColumnDef<PivotEfektivitasData>[] = [
    // Row number column
    {
      id: "rowNumber",
      header: "No",
      cell: ({ row }) => (
        <div className="w-12 text-center font-medium">{row.index + 1}</div>
      ),
    },
    // Kawasan name column
    {
      accessorKey: "namaKawasan",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground"
        >
          Nama Kawasan
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium min-w-[200px]">
          {row.getValue("namaKawasan")}
        </div>
      ),
    },
  ];

  // Add year columns dynamically
  availableYears.forEach((year) => {
    columns.push({
      id: year.toString(),
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground"
        >
          {year}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const data = row.original;
        const score = data.yearScores[year];

        if (score === undefined || score === 0) {
          return (
            <div className="text-center text-muted-foreground text-lg">0</div>
          );
        }

        return (
          <div className="text-center">
            <div className="font-bold text-lg">{score}</div>
          </div>
        );
      },
      sortingFn: (rowA, rowB) => {
        const scoreA = rowA.original.yearScores[year] || 0;
        const scoreB = rowB.original.yearScores[year] || 0;
        return scoreA - scoreB;
      },
    });
  });
  // Latest assessment column
  columns.push({
    id: "latestAssessment",
    header: "Penilaian Terakhir",
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="text-center">
          <div className="font-bold text-lg">{data.latestScore}</div>
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      return rowA.original.latestScore - rowB.original.latestScore;
    },
  });

  // Category column
  columns.push({
    id: "category",
    header: "Keterangan",
    cell: ({ row }) => {
      const data = row.original;
      if (data.latestScore === 0) {
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            Belum Dilakukan Penilaian
          </Badge>
        );
      }

      const category = calculateEfektivitasCategory(data.latestScore);
      return (
        <Badge className={getEfektivitasCategoryColor(category)}>
          {getEfektivitasCategoryDisplay(category)}
        </Badge>
      );
    },
  });

  // Actions column
  columns.push({
    id: "actions",
    header: "Aksi",
    enableHiding: false,
    cell: ({ row }) => {
      const data = row.original;
      return (
        <EfektivitasPivotActions
          kawasanId={parseInt(data.id)}
          namaKawasan={data.namaKawasan}
          kawasanList={kawasanList}
          onDataChange={onDataChange}
        />
      );
    },
  });

  return columns;
}

// Transform flat data to pivot table format
export function transformToPivotData(
  data: EfektivitasData[],
  kawasanList: any[]
): PivotEfektivitasData[] {
  const kawasanMap = new Map<
    number,
    { namaKawasan: string; kategoriKawasan: string }
  >();

  // Create kawasan lookup map
  kawasanList.forEach((kawasan) => {
    kawasanMap.set(kawasan.id, {
      namaKawasan: kawasan.namaKawasan,
      kategoriKawasan: kawasan.kategoriKawasan,
    });
  });

  // Group data by kawasan
  const groupedData = new Map<number, EfektivitasData[]>();
  data.forEach((item) => {
    if (item.kawasanId) {
      if (!groupedData.has(item.kawasanId)) {
        groupedData.set(item.kawasanId, []);
      }
      groupedData.get(item.kawasanId)!.push(item);
    }
  });

  // Transform to pivot format
  const result: PivotEfektivitasData[] = [];

  groupedData.forEach((assessments, kawasanId) => {
    const kawasanInfo = kawasanMap.get(kawasanId);
    if (!kawasanInfo) return;

    const yearScores: Record<number, number> = {};
    let latestScore = 0;
    let latestYear = 0;

    assessments.forEach((assessment) => {
      yearScores[assessment.tahun] = assessment.skor;
      if (assessment.tahun > latestYear) {
        latestYear = assessment.tahun;
        latestScore = assessment.skor;
      }
    });

    result.push({
      id: kawasanId.toString(),
      namaKawasan: kawasanInfo.namaKawasan,
      kategoriKawasan: kawasanInfo.kategoriKawasan,
      yearScores,
      latestScore,
      latestYear,
      category: calculateEfektivitasCategory(latestScore),
    });
  });

  // Also include kawasan that have no assessments yet
  kawasanList.forEach((kawasan) => {
    if (!groupedData.has(kawasan.id)) {
      result.push({
        id: kawasan.id.toString(),
        namaKawasan: kawasan.namaKawasan,
        kategoriKawasan: kawasan.kategoriKawasan,
        yearScores: {},
        latestScore: 0,
        latestYear: 0,
        category: "belum_dilakukan",
      });
    }
  });

  return result.sort((a, b) => a.namaKawasan.localeCompare(b.namaKawasan));
}
