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
import { createRpjp } from "@/lib/actions/management";
import { useState } from "react";

const FormSchema = z.object({
  kawasanId: z.number({
    required_error: "Kawasan is required.",
  }),
  periodeAwal: z.number().optional(),
  periodeAkhir: z.number().optional(),
  tujuan: z.string().optional(),
  strategi: z.string().optional(),
  targetIndikator: z.string().optional(),
  anggaran: z.string().optional(),
  status: z.enum(["Draft", "Approved", "Active", "Completed"]).optional(),
  fileDokumen: z.string().optional(),
});

interface RPJPFormProps {
  selectedKawasanId?: number;
  onSubmitSuccess?: (data: any) => void;
}

export function RPJPForm({
  selectedKawasanId,
  onSubmitSuccess,
}: RPJPFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      kawasanId: selectedKawasanId || 0,
      tujuan: "",
      strategi: "",
      targetIndikator: "",
      anggaran: "",
      status: "Draft",
      fileDokumen: "",
    },
  });

  const formSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);

    const addRPJP = await createRpjp(data);
    if (!addRPJP.success) {
      toast({
        title: "Failed to create RPJP",
        description: "Please try again later",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    toast({
      title: "RPJP created successfully",
      description: "Thank you for submitting your data",
      variant: "default",
    });
    setLoading(false);
    form.reset();
    onSubmitSuccess?.(addRPJP.data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(formSubmit)} className="space-y-6">
        {/* Hidden field for kawasanId since it's pre-selected */}
        <input type="hidden" {...form.register("kawasanId")} />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="periodeAwal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Periode Awal</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Tahun awal periode"
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
            name="periodeAkhir"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Periode Akhir</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Tahun akhir periode"
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
        </div>

        <FormField
          control={form.control}
          name="tujuan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tujuan</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tujuan RPJP..."
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
          name="strategi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Strategi</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Strategi pencapaian tujuan..."
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
          name="targetIndikator"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Indikator</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Target dan indikator keberhasilan..."
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
          name="anggaran"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Anggaran</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Estimasi anggaran" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fileDokumen"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File Dokumen</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Path ke file dokumen RPJP"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Loading..." : "Create RPJP"}
        </Button>
      </form>
    </Form>
  );
}
