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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { createOpenArea } from "@/lib/actions/monitoring";
import { useState } from "react";

const FormSchema = z.object({
  kawasanId: z.number({
    required_error: "Kawasan is required.",
  }),
  namaArea: z.string().optional(),
  luasHa: z.string().optional(),
  jenisPembukaan: z.enum(["Alami", "Antropogenik", "Campuran"]).optional(),
  penyebab: z.string().optional(),
  koordinatLokasi: z.string().optional(),
  tahunTerbentuk: z.number().optional(),
  statusPemulihan: z.enum(["Belum", "Proses", "Selesai"]).optional(),
  rencanaTindakan: z.string().optional(),
});

interface OpenAreaFormProps {
  selectedKawasanId?: number;
  onSubmitSuccess?: (data: any) => void;
}

export function OpenAreaForm({
  selectedKawasanId,
  onSubmitSuccess,
}: OpenAreaFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      kawasanId: selectedKawasanId || 0,
      namaArea: "",
      luasHa: "",
      penyebab: "",
      koordinatLokasi: "",
      rencanaTindakan: "",
    },
  });

  const formSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);

    const addOpenArea = await createOpenArea(data);
    if (!addOpenArea.success) {
      toast({
        title: "Failed to create Open Area",
        description: "Please try again later",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    toast({
      title: "Open Area created successfully",
      description: "Thank you for submitting your data",
      variant: "default",
    });
    setLoading(false);
    form.reset();
    onSubmitSuccess?.(addOpenArea.data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(formSubmit)} className="space-y-6">
        {/* Hidden field for kawasanId since it's pre-selected */}
        <input type="hidden" {...form.register("kawasanId")} />

        <FormField
          control={form.control}
          name="namaArea"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Area</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Nama area terbuka" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="luasHa"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Luas (Ha)</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Luas dalam hektare"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="jenisPembukaan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jenis Pembukaan</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Jenis Pembukaan" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Alami">Alami</SelectItem>
                  <SelectItem value="Antropogenik">Antropogenik</SelectItem>
                  <SelectItem value="Campuran">Campuran</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="penyebab"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Penyebab</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Penyebab pembukaan area..."
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="koordinatLokasi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Koordinat Lokasi</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Koordinat lokasi area"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tahunTerbentuk"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tahun Terbentuk</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Tahun terbentuknya area"
                  {...field}
                  onChange={(e) =>
                    field.onChange(Number(e.target.value) || undefined)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="statusPemulihan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status Pemulihan</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Status Pemulihan" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Belum">Belum</SelectItem>
                  <SelectItem value="Proses">Proses</SelectItem>
                  <SelectItem value="Selesai">Selesai</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rencanaTindakan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rencana Tindakan</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Rencana tindakan untuk area..."
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Loading..." : "Create Open Area"}
        </Button>
      </form>
    </Form>
  );
}
