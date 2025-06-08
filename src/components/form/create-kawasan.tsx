"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { toast } from "@/hooks/use-toast";
import { createKawasan, getKawasanByName } from "@/lib/actions/kawasan";
import { Link } from "lucide-react";
import { useState } from "react";

const FormSchema = z.object({
  namaKawasan: z.string().min(2, {
    message: "Nama kawasan must be at least 2 characters.",
  }),
  letak: z.string().min(2, {
    message: "Letak must be at least 2 characters.",
  }),
  noRegistrasi: z.string().min(2, {
    message: "No Registrasi must be at least 2 characters.",
  }),
  kategoriKawasan: z.enum(
    ["Cagar_Alam", "Suaka_Margasatwa", "Taman_Wisata_Alam", "KAS/KPA"],
    {
      errorMap: () => ({ message: "Kategori Kawasan is required" }),
    }
  ),
});

export function KawasanForm() {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      namaKawasan: "",
      letak: "",
      noRegistrasi: "",
      kategoriKawasan: "Cagar_Alam",
    },
  });

  const formSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);

    const checkKawasanName = await getKawasanByName(data.namaKawasan);
    if (checkKawasanName.data) {
      toast({
        title: "Kawasan already exist",
        description: "Please use another Kawasan name",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const checkKawasanNoRegistrasi = await getKawasanByName(data.noRegistrasi);
    if (checkKawasanNoRegistrasi.data) {
      toast({
        title: "No Registrasi already exist",
        description: "Please use another No Registrasi",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const addKawasan = await createKawasan(data);
    if (addKawasan instanceof Error || !addKawasan.success) {
      toast({
        title: "Failed submitted data",
        description: "Please try again later",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    toast({
      title: "Data submitted successfully",
      description: "Thank you for submitting your data",
      variant: "default",
    });
    setLoading(false);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(formSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="namaKawasan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Kawasan</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Nama Kawasan"
                  required
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="letak"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Letak</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Nama daerah atau lokasi"
                  required
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="noRegistrasi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>No Registrasi</FormLabel>
              <FormControl>
                <Input type="text" placeholder="No Registrasi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="kategoriKawasan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori Kawasan</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Kategori Kawasan" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Cagar_Alam">Cagar Alam</SelectItem>
                  <SelectItem value="Suaka_Margasatwa">
                    Suaka Margasatwa
                  </SelectItem>
                  <SelectItem value="Taman_Wisata_Alam">
                    Taman Wisata Alam
                  </SelectItem>
                  <SelectItem value="KAS/KPA">KAS/KPA</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                You can manage email addresses in your{" "}
                <Link href="/examples/forms">email settings</Link>.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Loading..." : "Hitung"}
        </Button>
      </form>
    </Form>
  );
}
