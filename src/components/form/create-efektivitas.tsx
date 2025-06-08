"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { createEfektivitas, updateEfektivitas } from "@/lib/actions/monitoring";
import type { EfektivitasPengelolaan, Kawasan } from "@/lib/db/schema";
import {
  calculateEfektivitasCategory,
  getEfektivitasCategoryColor,
  getEfektivitasCategoryDisplay,
} from "@/utils/efektivitas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const efektivitasSchema = z.object({
  kawasanId: z.number().min(1, "Kawasan harus dipilih"),
  tahun: z.number().min(2000).max(2030),
  skor: z.number().min(0).max(100),
  keterangan: z.string().optional(),
});

type EfektivitasFormData = z.infer<typeof efektivitasSchema>;

interface CreateEfektivitasFormProps {
  kawasanList: Kawasan[];
  existingData?: EfektivitasPengelolaan;
  onSuccess?: () => void;
}

export function CreateEfektivitasForm({
  kawasanList,
  existingData,
  onSuccess,
}: CreateEfektivitasFormProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewCategory, setPreviewCategory] = useState<string | null>(null);

  const form = useForm<EfektivitasFormData>({
    resolver: zodResolver(efektivitasSchema),
    defaultValues: {
      kawasanId: existingData?.kawasanId || 0,
      tahun: existingData?.tahun || new Date().getFullYear(),
      skor: existingData?.skor || 0,
      keterangan: existingData?.keterangan || "",
    },
  });

  const watchedSkor = form.watch("skor");

  // Update preview category when score changes
  useEffect(() => {
    if (watchedSkor !== undefined) {
      const category = calculateEfektivitasCategory(watchedSkor);
      setPreviewCategory(category);
    }
  }, [watchedSkor]);

  async function onSubmit(data: EfektivitasFormData) {
    setIsLoading(true);
    try {
      if (existingData) {
        await updateEfektivitas(existingData.id, data);
      } else {
        await createEfektivitas(data);
      }

      setOpen(false);
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error saving efektivitas:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          {existingData ? (
            <>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Data Efektivitas
            </>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {existingData ? "Edit" : "Tambah"} Data Efektivitas Pengelolaan
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="kawasanId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kawasan</FormLabel>
                  <Select
                    value={field.value.toString()}
                    onValueChange={(value) => field.onChange(parseInt(value))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kawasan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {kawasanList.map((kawasan) => (
                        <SelectItem
                          key={kawasan.id}
                          value={kawasan.id.toString()}
                        >
                          {kawasan.namaKawasan}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tahun"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tahun</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="2000"
                      max="2030"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skor Efektivitas (0-100)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  {previewCategory && (
                    <div className="mt-2">
                      <Badge
                        className={getEfektivitasCategoryColor(
                          previewCategory as any
                        )}
                      >
                        {getEfektivitasCategoryDisplay(previewCategory as any)}
                      </Badge>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="keterangan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keterangan (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Keterangan tambahan..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1"
              >
                Batal
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
