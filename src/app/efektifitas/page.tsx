"use client";

import { CreateEfektivitasForm } from "@/components/form/create-efektivitas";
import { ExportEfektivitas } from "@/components/form/export-efektivitas";
import { ImportEfektivitas } from "@/components/form/import-efektivitas";
import { TrendAnalysis } from "@/components/trend-analysis";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getAllKawasan } from "@/lib/actions/kawasan";
import {
  getAllEfektivitas,
  getEfektivitasStatistics,
} from "@/lib/actions/monitoring";
import type { Kawasan } from "@/lib/db/schema";
import type { EfektivitasData } from "@/types";
import {
  calculateEfektivitasCategory,
  getEfektivitasCategoryColor,
  getEfektivitasCategoryDisplay,
} from "@/utils/efektivitas";
import {
  AlertCircle,
  BarChart3,
  Calendar,
  CheckCircle,
  Filter,
  MapPin,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Statistics {
  totalKawasan: number;
  averageScore: number;
  categoryCounts: Record<string, number>;
  recentAssessments: number;
  totalAssessments: number;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "excellent":
      return "bg-green-100 text-green-800 border-green-300";
    case "good":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "moderate":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "poor":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "excellent":
    case "good":
      return <CheckCircle className="h-4 w-4" />;
    case "moderate":
      return <AlertCircle className="h-4 w-4" />;
    case "poor":
      return <XCircle className="h-4 w-4" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
};

const getThreatColor = (level: string) => {
  switch (level) {
    case "high":
      return "bg-red-100 text-red-800 border-red-300";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "low":
      return "bg-green-100 text-green-800 border-green-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

export default function EfektifitasPage() {
  const [efektivitasData, setEfektivitasData] = useState<EfektivitasData[]>([]);
  const [kawasanList, setKawasanList] = useState<Kawasan[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const [efektivitas, kawasan, stats] = await Promise.all([
        getAllEfektivitas(),
        getAllKawasan(),
        getEfektivitasStatistics(),
      ]);

      setEfektivitasData(efektivitas);
      setKawasanList(kawasan.data || []);
      setStatistics(stats);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Filter data by selected year
  const filteredData = efektivitasData.filter(
    (item) => item.tahun === selectedYear
  );

  // Get available years
  const availableYears = [
    ...new Set(efektivitasData.map((item) => item.tahun)),
  ].sort((a, b) => b - a);

  // Calculate current year statistics
  const currentYearStats = filteredData.reduce((acc, item) => {
    const category = calculateEfektivitasCategory(item.skor);
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (isLoading) {
    return (
      <main className="container mx-auto p-6 pt-20 space-y-6">
        <div className="text-center py-12">
          <div className="text-lg">Memuat data efektivitas...</div>
        </div>
      </main>
    );
  }
  return (
    <main className="container mx-auto p-6 pt-20 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Efektifitas Pengelolaan Kawasan
          </h1>
          <p className="text-muted-foreground mt-2">
            Penilaian dan monitoring efektifitas pengelolaan kawasan konservasi
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/">
              <MapPin className="h-4 w-4 mr-2" />
              Kembali ke Peta
            </Link>
          </Button>
          <ImportEfektivitas kawasanList={kawasanList} onSuccess={loadData} />
          <ExportEfektivitas
            kawasanList={kawasanList}
            availableYears={availableYears}
          />
          <CreateEfektivitasForm
            kawasanList={kawasanList}
            onSuccess={loadData}
          />
        </div>
      </div>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">
                  {statistics?.totalKawasan || 0}
                </div>
                <div className="text-xs text-muted-foreground">
                  Total Kawasan
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">
                  {statistics?.averageScore || 0}
                </div>
                <div className="text-xs text-muted-foreground">
                  Skor Rata-rata
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
              <div>
                <div className="text-2xl font-bold">
                  {statistics?.totalAssessments || 0}
                </div>
                <div className="text-xs text-muted-foreground">
                  Total Penilaian
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">
                  {statistics?.recentAssessments || 0}
                </div>
                <div className="text-xs text-muted-foreground">
                  Penilaian {new Date().getFullYear()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Year Filter */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filter Tahun:</span>
        </div>
        <div className="flex gap-2">
          {availableYears.map((year) => (
            <Button
              key={year}
              variant={selectedYear === year ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </Button>
          ))}
        </div>
      </div>{" "}
      {/* Effectiveness by Category */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(currentYearStats).map(([category, count]) => (
          <Card key={category}>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">{count}</div>
                <Badge className={getEfektivitasCategoryColor(category as any)}>
                  {getEfektivitasCategoryDisplay(category as any)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>{" "}
      {/* Trend Analysis */}
      {efektivitasData.length > 0 && <TrendAnalysis data={efektivitasData} />}
      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Data Efektivitas Tahun {selectedYear}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Tidak ada data untuk tahun {selectedYear}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredData.map((item) => {
                const category = calculateEfektivitasCategory(item.skor);
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{item.namaKawasan}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.kategoriKawasan?.replace(/_/g, " ")}
                      </div>
                      {item.keterangan && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {item.keterangan}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold">{item.skor}</div>
                        <div className="text-xs text-muted-foreground">
                          Skor
                        </div>
                      </div>
                      <Badge className={getEfektivitasCategoryColor(category)}>
                        {getEfektivitasCategoryDisplay(category)}
                      </Badge>
                      <div className="w-32">
                        <Progress value={item.skor} className="h-2" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
