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
import { createKeanekaragamanHayati } from "@/lib/actions/biodiversity";
import { useState } from "react";

const FormSchema = z.object({
  kawasanId: z.number({
    required_error: "Kawasan is required.",
  }),
  kategori: z.enum(["Flora", "Fauna", "Mikroorganisme"], {
    errorMap: () => ({ message: "Kategori is required" }),
  }),
  namaIlmiah: z.string().optional(),
  namaLokal: z.string().optional(),
  family: z.string().optional(),
  statusKonservasi: z
    .enum(["LC", "NT", "VU", "EN", "CR", "EW", "EX"])
    .optional(),
  endemisitas: z.boolean().optional(),
  populasiEstimasi: z.number().optional(),
  habitatUtama: z.string().optional(),
  ancamanUtama: z.string().optional(),
  tahunSurvey: z.number().optional(),
  surveyor: z.string().optional(),
});

interface BiodiversityFormProps {
  selectedKawasanId?: number;
  onSubmitSuccess?: (data: any) => void;
}

export function BiodiversityForm({
  selectedKawasanId,
  onSubmitSuccess,
}: BiodiversityFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      kawasanId: selectedKawasanId || 0,
      kategori: "Flora",
      namaIlmiah: "",
      namaLokal: "",
      family: "",
      endemisitas: false,
      habitatUtama: "",
      ancamanUtama: "",
      surveyor: "",
    },
  });

  const formSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);

    const addBiodiversity = await createKeanekaragamanHayati(data);
    if (!addBiodiversity.success) {
      toast({
        title: "Failed to create Biodiversity data",
        description: "Please try again later",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    toast({
      title: "Biodiversity data created successfully",
      description: "Thank you for submitting your data",
      variant: "default",
    });
    setLoading(false);
    form.reset();
    onSubmitSuccess?.(addBiodiversity.data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(formSubmit)} className="space-y-6">
        {/* Hidden field for kawasanId since it's pre-selected */}
        <input type="hidden" {...form.register("kawasanId")} />

        <FormField
          control={form.control}
          name="kategori"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Flora">Flora</SelectItem>
                  <SelectItem value="Fauna">Fauna</SelectItem>
                  <SelectItem value="Mikroorganisme">Mikroorganisme</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="namaIlmiah"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Ilmiah</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Nama ilmiah spesies"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="namaLokal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Lokal</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Nama lokal/vernakular"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="family"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Family</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Family taksonomi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="statusKonservasi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status Konservasi</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Status Konservasi" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="LC">Least Concern (LC)</SelectItem>
                  <SelectItem value="NT">Near Threatened (NT)</SelectItem>
                  <SelectItem value="VU">Vulnerable (VU)</SelectItem>
                  <SelectItem value="EN">Endangered (EN)</SelectItem>
                  <SelectItem value="CR">Critically Endangered (CR)</SelectItem>
                  <SelectItem value="EW">Extinct in the Wild (EW)</SelectItem>
                  <SelectItem value="EX">Extinct (EX)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="populasiEstimasi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimasi Populasi</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Jumlah estimasi populasi"
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
          name="habitatUtama"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Habitat Utama</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Deskripsi habitat utama..."
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
          name="ancamanUtama"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ancaman Utama</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Deskripsi ancaman utama..."
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
          name="tahunSurvey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tahun Survey</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Tahun dilakukan survey"
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
          name="surveyor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Surveyor</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Nama surveyor/peneliti"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Loading..." : "Create Biodiversity Data"}
        </Button>
      </form>
    </Form>
  );
}
