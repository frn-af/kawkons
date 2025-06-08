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
import { createNilaiPenting } from "@/lib/actions/monitoring";
import { useState } from "react";

const FormSchema = z.object({
  kawasanId: z.number({
    required_error: "Kawasan is required.",
  }),
  kategoriNilai: z.enum(
    ["Ekologis", "Ekonomis", "Sosial_Budaya", "Ilmiah", "Estetika"],
    {
      errorMap: () => ({ message: "Kategori nilai is required" }),
    }
  ),
  namaNilai: z.string().min(2, {
    message: "Nama nilai must be at least 2 characters.",
  }),
  deskripsi: z.string().optional(),
  tingkatKepentingan: z
    .enum(["Sangat_Tinggi", "Tinggi", "Sedang", "Rendah"])
    .optional(),
  indikatorNilai: z.string().optional(),
  potensiAncaman: z.string().optional(),
  upayaPelestarian: z.string().optional(),
});

interface NilaiPentingFormProps {
  selectedKawasanId?: number;
  onSubmitSuccess?: (data: any) => void;
}

export function NilaiPentingForm({
  selectedKawasanId,
  onSubmitSuccess,
}: NilaiPentingFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      kawasanId: selectedKawasanId || 0,
      kategoriNilai: "Ekologis",
      namaNilai: "",
      deskripsi: "",
      indikatorNilai: "",
      potensiAncaman: "",
      upayaPelestarian: "",
    },
  });

  const formSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);

    const addNilaiPenting = await createNilaiPenting(data);
    if (!addNilaiPenting.success) {
      toast({
        title: "Failed to create Nilai Penting",
        description: "Please try again later",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    toast({
      title: "Nilai Penting created successfully",
      description: "Thank you for submitting your data",
      variant: "default",
    });
    setLoading(false);
    form.reset();
    onSubmitSuccess?.(addNilaiPenting.data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(formSubmit)} className="space-y-6">
        {/* Hidden field for kawasanId since it's pre-selected */}
        <input type="hidden" {...form.register("kawasanId")} />

        <FormField
          control={form.control}
          name="kategoriNilai"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori Nilai</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Kategori Nilai" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Ekologis">Ekologis</SelectItem>
                  <SelectItem value="Ekonomis">Ekonomis</SelectItem>
                  <SelectItem value="Sosial_Budaya">Sosial Budaya</SelectItem>
                  <SelectItem value="Ilmiah">Ilmiah</SelectItem>
                  <SelectItem value="Estetika">Estetika</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="namaNilai"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Nilai</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Nama nilai penting"
                  {...field}
                />
              </FormControl>
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
                  placeholder="Deskripsi nilai penting..."
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
          name="tingkatKepentingan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tingkat Kepentingan</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Tingkat Kepentingan" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Sangat_Tinggi">Sangat Tinggi</SelectItem>
                  <SelectItem value="Tinggi">Tinggi</SelectItem>
                  <SelectItem value="Sedang">Sedang</SelectItem>
                  <SelectItem value="Rendah">Rendah</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="indikatorNilai"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Indikator Nilai</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Indikator nilai penting..."
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
          name="potensiAncaman"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Potensi Ancaman</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Potensi ancaman terhadap nilai..."
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
          name="upayaPelestarian"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upaya Pelestarian</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Upaya pelestarian yang dapat dilakukan..."
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Loading..." : "Create Nilai Penting"}
        </Button>
      </form>
    </Form>
  );
}
