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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { createBlokPengelolaan } from "@/lib/actions/management";
import { useState } from "react";

const FormSchema = z.object({
  kawasanId: z.number({
    required_error: "Kawasan is required.",
  }),
  namaBlok: z.string().min(2, {
    message: "Nama blok must be at least 2 characters.",
  }),
  luasHa: z.string().optional(),
  fungsiBlok: z.string().optional(),
  koordinatBatas: z.string().optional(),
  keterangan: z.string().optional(),
});

interface BlokPengelolaanFormProps {
  selectedKawasanId?: number;
  onSubmitSuccess?: (data: any) => void;
}

export function BlokPengelolaanForm({
  selectedKawasanId,
  onSubmitSuccess,
}: BlokPengelolaanFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      kawasanId: selectedKawasanId || 0,
      namaBlok: "",
      luasHa: "",
      fungsiBlok: "",
      koordinatBatas: "",
      keterangan: "",
    },
  });

  const formSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);

    const addBlokPengelolaan = await createBlokPengelolaan(data);
    if (!addBlokPengelolaan.success) {
      toast({
        title: "Failed to create Blok Pengelolaan",
        description: "Please try again later",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    toast({
      title: "Blok Pengelolaan created successfully",
      description: "Thank you for submitting your data",
      variant: "default",
    });
    setLoading(false);
    form.reset();
    onSubmitSuccess?.(addBlokPengelolaan.data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(formSubmit)} className="space-y-6">
        {/* Hidden field for kawasanId since it's pre-selected */}
        <input type="hidden" {...form.register("kawasanId")} />

        <FormField
          control={form.control}
          name="namaBlok"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Blok</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Nama blok pengelolaan"
                  {...field}
                />
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
          name="fungsiBlok"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fungsi Blok</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Fungsi dari blok pengelolaan"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="koordinatBatas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Koordinat Batas</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Koordinat batas blok..."
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
          {loading ? "Loading..." : "Create Blok Pengelolaan"}
        </Button>
      </form>
    </Form>
  );
}
