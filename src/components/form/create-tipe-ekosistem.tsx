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
import { createTipeEkosistem } from "@/lib/actions/monitoring";
import { useState } from "react";

const FormSchema = z.object({
  kawasanId: z.number({
    required_error: "Kawasan is required.",
  }),
  namaEkosistem: z
    .string({
      required_error: "Nama ekosistem is required.",
    })
    .min(1, {
      message: "Nama ekosistem must be at least 1 character.",
    }),
  luasHa: z.string().optional(),
  persentaseKawasan: z.string().optional(),
  kondisi: z.enum(["Baik", "Sedang", "Rusak"]).optional(),
  deskripsi: z.string().optional(),
});

interface TipeEkosistemFormProps {
  selectedKawasanId?: number;
  onSubmitSuccess?: (data: any) => void;
}

export function CreateTipeEkosistemForm({
  selectedKawasanId,
  onSubmitSuccess,
}: TipeEkosistemFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      kawasanId: selectedKawasanId || 0,
      namaEkosistem: "",
      luasHa: "",
      persentaseKawasan: "",
      kondisi: "Baik",
      deskripsi: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    try {
      const result = await createTipeEkosistem(data);

      if (result.success) {
        toast({
          title: "Success",
          description: "Tipe ekosistem berhasil dibuat.",
        });
        form.reset();
        onSubmitSuccess?.(result.data);
      } else {
        toast({
          title: "Error",
          description: result.error || "Gagal membuat tipe ekosistem.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat membuat tipe ekosistem.",
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
          name="namaEkosistem"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Ekosistem *</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama ekosistem" {...field} />
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
            name="persentaseKawasan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Persentase Kawasan (%)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Masukkan persentase terhadap kawasan"
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
          name="kondisi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kondisi</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kondisi ekosistem" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Baik">Baik</SelectItem>
                  <SelectItem value="Sedang">Sedang</SelectItem>
                  <SelectItem value="Rusak">Rusak</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deskripsi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Masukkan deskripsi ekosistem"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Menyimpan..." : "Simpan Tipe Ekosistem"}
        </Button>
      </form>
    </Form>
  );
}
