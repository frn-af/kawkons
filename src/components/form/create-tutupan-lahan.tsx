"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { createTutupanLahan } from "@/lib/actions/monitoring";
import { useState } from "react";

const FormSchema = z.object({
  kawasanId: z.number({
    required_error: "Kawasan is required.",
  }),
  jenisTutupan: z
    .string({
      required_error: "Jenis tutupan is required.",
    })
    .min(1, {
      message: "Jenis tutupan must be at least 1 character.",
    }),
  luasHa: z.string().optional(),
  persentase: z.string().optional(),
  tahunData: z.number().optional(),
  sumberData: z.string().optional(),
  metodeAnalisis: z.string().optional(),
});

interface TutupanLahanFormProps {
  selectedKawasanId?: number;
  onSubmitSuccess?: (data: any) => void;
}

export function CreateTutupanLahanForm({
  selectedKawasanId,
  onSubmitSuccess,
}: TutupanLahanFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      kawasanId: selectedKawasanId || 0,
      jenisTutupan: "",
      luasHa: "",
      persentase: "",
      tahunData: new Date().getFullYear(),
      sumberData: "",
      metodeAnalisis: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    try {
      const result = await createTutupanLahan(data);

      if (result.success) {
        toast({
          title: "Success",
          description: "Data tutupan lahan berhasil dibuat.",
        });
        form.reset();
        onSubmitSuccess?.(result.data);
      } else {
        toast({
          title: "Error",
          description: result.error || "Gagal membuat data tutupan lahan.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat membuat data tutupan lahan.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="kawasanId"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <Input type="hidden" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="jenisTutupan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jenis Tutupan *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Contoh: Hutan Primer, Hutan Sekunder, Semak Belukar, dll"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="luasHa"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Luas (Ha)</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan luas dalam hektar" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="persentase"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Persentase (%)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Masukkan persentase dari total kawasan"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="tahunData"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tahun Data</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Masukkan tahun data"
                  {...field}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sumberData"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sumber Data</FormLabel>
              <FormControl>
                <Input
                  placeholder="Contoh: Landsat 8, Sentinel-2, Survey Lapangan, dll"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="metodeAnalisis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Metode Analisis</FormLabel>
              <FormControl>
                <Input
                  placeholder="Contoh: Klasifikasi Supervised, Visual Interpretation, dll"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Menyimpan..." : "Simpan Data Tutupan Lahan"}
        </Button>
      </form>
    </Form>
  );
}
