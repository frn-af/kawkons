"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { EfektivitasData } from "@/types";
import {
  calculateEfektivitasCategory,
  getEfektivitasCategoryColor,
  getEfektivitasCategoryDisplay,
} from "@/utils/efektivitas";
import { BarChart3, Minus, TrendingDown, TrendingUp } from "lucide-react";
import { useMemo } from "react";

interface TrendAnalysisProps {
  data: EfektivitasData[];
}

export function TrendAnalysis({ data }: TrendAnalysisProps) {
  const analysis = useMemo(() => {
    if (data.length === 0) return null;

    // Group by year and calculate averages
    const yearlyStats = data.reduce((acc, item) => {
      if (!acc[item.tahun]) {
        acc[item.tahun] = {
          total: 0,
          count: 0,
          scores: [],
          categories: {} as Record<string, number>,
        };
      }
      acc[item.tahun].total += item.skor;
      acc[item.tahun].count += 1;
      acc[item.tahun].scores.push(item.skor);

      const category = calculateEfektivitasCategory(item.skor);
      acc[item.tahun].categories[category] =
        (acc[item.tahun].categories[category] || 0) + 1;

      return acc;
    }, {} as Record<number, any>);

    // Calculate averages and trends
    const years = Object.keys(yearlyStats).map(Number).sort();
    const yearlyAverages = years.map((year) => ({
      year,
      average:
        Math.round((yearlyStats[year].total / yearlyStats[year].count) * 10) /
        10,
      count: yearlyStats[year].count,
      categories: yearlyStats[year].categories,
    }));

    // Calculate trend
    let trend: "up" | "down" | "stable" = "stable";
    if (yearlyAverages.length >= 2) {
      const firstYear = yearlyAverages[0];
      const lastYear = yearlyAverages[yearlyAverages.length - 1];
      const difference = lastYear.average - firstYear.average;

      if (difference > 2) trend = "up";
      else if (difference < -2) trend = "down";
    }

    // Group by kawasan to show individual trends
    const kawasanTrends = data.reduce((acc, item) => {
      if (!item.namaKawasan) return acc;

      if (!acc[item.namaKawasan]) {
        acc[item.namaKawasan] = [];
      }
      acc[item.namaKawasan].push(item);
      return acc;
    }, {} as Record<string, EfektivitasData[]>);

    // Calculate kawasan improvements/declines
    const kawasanChanges = Object.entries(kawasanTrends)
      .map(([nama, records]) => {
        const sorted = records.sort((a, b) => a.tahun - b.tahun);
        if (sorted.length < 2) return null;

        const first = sorted[0];
        const last = sorted[sorted.length - 1];
        const change = last.skor - first.skor;

        return {
          nama,
          firstYear: first.tahun,
          lastYear: last.tahun,
          firstScore: first.skor,
          lastScore: last.skor,
          change,
          changePercent: Math.round((change / first.skor) * 100),
          category: calculateEfektivitasCategory(last.skor),
        };
      })
      .filter(Boolean)
      .sort((a, b) => Math.abs(b!.change) - Math.abs(a!.change));

    return {
      yearlyAverages,
      trend,
      kawasanChanges: kawasanChanges.slice(0, 10), // Top 10 changes
    };
  }, [data]);

  if (!analysis) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Tidak ada data untuk analisis trend
        </CardContent>
      </Card>
    );
  }

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case "down":
        return <TrendingDown className="h-5 w-5 text-red-600" />;
      default:
        return <Minus className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Yearly Trend Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analisis Trend Efektivitas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Overall Trend */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <div className="font-medium">Trend Keseluruhan</div>
                <div className="text-sm text-muted-foreground">
                  {analysis.yearlyAverages.length > 1
                    ? `${analysis.yearlyAverages[0].year} - ${
                        analysis.yearlyAverages[
                          analysis.yearlyAverages.length - 1
                        ].year
                      }`
                    : "Data tunggal"}
                </div>
              </div>
              <div
                className={`flex items-center gap-2 ${getTrendColor(
                  analysis.trend
                )}`}
              >
                {getTrendIcon(analysis.trend)}
                <span className="font-medium capitalize">
                  {analysis.trend === "up"
                    ? "Meningkat"
                    : analysis.trend === "down"
                    ? "Menurun"
                    : "Stabil"}
                </span>
              </div>
            </div>

            {/* Yearly Data */}
            <div className="space-y-2">
              <div className="font-medium">Skor Rata-rata per Tahun</div>
              {analysis.yearlyAverages.map((year) => (
                <div
                  key={year.year}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="font-medium">{year.year}</div>
                    <div className="text-sm text-muted-foreground">
                      {year.count} kawasan
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-bold text-lg">{year.average}</div>
                      <div className="text-xs text-muted-foreground">Skor</div>
                    </div>
                    <div className="w-32">
                      <Progress value={year.average} className="h-2" />
                    </div>
                    <Badge
                      className={getEfektivitasCategoryColor(
                        calculateEfektivitasCategory(year.average)
                      )}
                    >
                      {getEfektivitasCategoryDisplay(
                        calculateEfektivitasCategory(year.average)
                      )}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kawasan Changes */}
      {analysis.kawasanChanges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Perubahan Signifikan per Kawasan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysis.kawasanChanges.map((kawasan, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium">{kawasan!.nama}</div>
                    <div className="text-sm text-muted-foreground">
                      {kawasan!.firstYear} → {kawasan!.lastYear}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-sm font-medium">
                        {kawasan!.firstScore} → {kawasan!.lastScore}
                      </div>
                      <div
                        className={`text-xs flex items-center gap-1 ${
                          kawasan!.change > 0
                            ? "text-green-600"
                            : kawasan!.change < 0
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      >
                        {kawasan!.change > 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : kawasan!.change < 0 ? (
                          <TrendingDown className="h-3 w-3" />
                        ) : (
                          <Minus className="h-3 w-3" />
                        )}
                        {kawasan!.change > 0 ? "+" : ""}
                        {kawasan!.change}(
                        {kawasan!.changePercent > 0 ? "+" : ""}
                        {kawasan!.changePercent}%)
                      </div>
                    </div>
                    <Badge
                      className={getEfektivitasCategoryColor(kawasan!.category)}
                    >
                      {getEfektivitasCategoryDisplay(kawasan!.category)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
