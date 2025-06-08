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
import { createSkDocument } from "@/lib/actions/kawasan/sk_document";
import { useState } from "react";

const FormSchema = z.object({
  kawasanId: z.number({
    required_error: "Kawasan is required.",
  }),
  jenisSk: z.enum(
    ["SK_Pengukuhan", "SK_Penetapan", "SK_6620", "SK_128_DPCLS"],
    {
      errorMap: () => ({ message: "Jenis SK is required" }),
    }
  ),
  nomorSk: z.string().optional(),
  tanggalSk: z.string().optional(),
  instansiPenerbit: z.string().optional(),
  filePath: z.string().optional(),
  keterangan: z.string().optional(),
});

interface SKDocumentFormProps {
  selectedKawasanId?: number;
  onSubmitSuccess?: (data: any) => void;
}

export function SKDocumentForm({
  selectedKawasanId,
  onSubmitSuccess,
}: SKDocumentFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      kawasanId: selectedKawasanId || 0,
      jenisSk: "SK_Pengukuhan",
      nomorSk: "",
      tanggalSk: "",
      instansiPenerbit: "",
      filePath: "",
      keterangan: "",
    },
  });

  const formSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);

    const addSKDocument = await createSkDocument(data);
    if (!addSKDocument.success) {
      toast({
        title: "Failed to create SK Document",
        description: "Please try again later",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    toast({
      title: "SK Document created successfully",
      description: "Thank you for submitting your data",
      variant: "default",
    });
    setLoading(false);
    form.reset();
    onSubmitSuccess?.(addSKDocument.data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(formSubmit)} className="space-y-6">
        {/* Hidden field for kawasanId since it's pre-selected */}
        <input type="hidden" {...form.register("kawasanId")} />

        <FormField
          control={form.control}
          name="jenisSk"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jenis SK</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Jenis SK" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="SK_Pengukuhan">SK Pengukuhan</SelectItem>
                  <SelectItem value="SK_Penetapan">SK Penetapan</SelectItem>
                  <SelectItem value="SK_6620">SK 6620</SelectItem>
                  <SelectItem value="SK_128_DPCLS">SK 128 DPCLS</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nomorSk"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor SK</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Nomor Surat Keputusan"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tanggalSk"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tanggal SK</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="instansiPenerbit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instansi Penerbit</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Nama instansi yang menerbitkan SK"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="filePath"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File Path</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Path ke file SK" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="keterangan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keterangan</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Keterangan tambahan..."
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Loading..." : "Create SK Document"}
        </Button>
      </form>
    </Form>
  );
}
