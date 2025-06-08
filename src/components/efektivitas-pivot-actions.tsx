"use client";

import { CreateEfektivitasForm } from "@/components/form/create-efektivitas";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  deleteEfektivitas,
  getEfektivitasByKawasan,
} from "@/lib/actions/monitoring/efektivitas";
import type { EfektivitasAssessment, Kawasan } from "@/types";
import { Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PivotActionsProps {
  kawasanId: number;
  namaKawasan: string;
  kawasanList: Kawasan[];
  onDataChange: () => void;
}

export function EfektivitasPivotActions({
  kawasanId,
  namaKawasan,
  kawasanList,
  onDataChange,
}: PivotActionsProps) {
  const [open, setOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [assessments, setAssessments] = useState<EfektivitasAssessment[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadAssessments = async () => {
    if (!open && !viewDialogOpen) return;

    setLoading(true);
    try {
      const data = await getEfektivitasByKawasan(kawasanId);
      setAssessments(data);
    } catch (error) {
      console.error("Error loading assessments:", error);
      toast.error("Gagal memuat data assessment");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssessments();
  }, [open, viewDialogOpen, kawasanId]);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteEfektivitas(id);
      toast.success("Data berhasil dihapus");
      await loadAssessments();
      onDataChange();
    } catch (error) {
      console.error("Error deleting assessment:", error);
      toast.error("Gagal menghapus data");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSuccess = () => {
    loadAssessments();
    onDataChange();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Buka menu aksi</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Aksi untuk {namaKawasan}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Eye className="mr-2 h-4 w-4" />
              Lihat Semua Assessment
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Data Assessment Efektivitas - {namaKawasan}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="text-muted-foreground">Memuat data...</div>
                </div>
              ) : assessments.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-muted-foreground mb-4">
                    Belum ada data assessment untuk kawasan ini
                  </div>
                  <CreateEfektivitasForm
                    kawasanList={kawasanList}
                    onSuccess={handleSuccess}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">
                      Total {assessments.length} assessment
                    </h4>
                    <CreateEfektivitasForm
                      kawasanList={kawasanList}
                      onSuccess={handleSuccess}
                    />
                  </div>

                  <div className="grid gap-4">
                    {assessments.map((assessment) => (
                      <div
                        key={assessment.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <div className="font-medium">
                            Tahun {assessment.tahun}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Skor: {assessment.skor}/100
                          </div>
                          {assessment.keterangan && (
                            <div className="text-sm text-muted-foreground mt-1">
                              {assessment.keterangan}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <CreateEfektivitasForm
                            kawasanList={kawasanList}
                            existingData={assessment}
                            onSuccess={handleSuccess}
                          />

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Konfirmasi Penghapusan
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Apakah Anda yakin ingin menghapus data
                                  assessment tahun {assessment.tahun} untuk
                                  kawasan {namaKawasan}? Tindakan ini tidak
                                  dapat dibatalkan.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(assessment.id)}
                                  disabled={deletingId === assessment.id}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  {deletingId === assessment.id
                                    ? "Menghapus..."
                                    : "Hapus"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>{" "}
        <CreateEfektivitasForm
          kawasanList={kawasanList.filter((k) => k.id === kawasanId)}
          onSuccess={onDataChange}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
