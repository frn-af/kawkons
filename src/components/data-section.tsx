"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode } from "react";

interface DataSectionProps<T = any> {
  title: string;
  data: T[];
  isDialogOpen: boolean;
  onDialogChange: (open: boolean) => void;
  buttonText: string;
  dialogTitle: string;
  borderColor: string;
  children: ReactNode; // Form component
  renderDataItem: (item: T) => ReactNode;
  isLoading?: boolean;
  emptyMessage?: string;
}

export const DataSection = <T extends { id: string }>({
  title,
  data,
  isDialogOpen,
  onDialogChange,
  buttonText,
  dialogTitle,
  borderColor,
  children,
  renderDataItem,
  isLoading = false,
  emptyMessage = "No data available",
}: DataSectionProps<T>) => {
  if (isLoading) {
    return (
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-2">{title}</h3>
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }
  return (
    <>
      {data.length > 0 ? (
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">
            {title} ({data.length})
          </h3>
          <div className="space-y-2">
            {data.map((item: any) => (
              <div key={item.id} className={`border-l-4 ${borderColor} pl-3`}>
                {renderDataItem(item)}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Dialog open={isDialogOpen} onOpenChange={onDialogChange}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              {buttonText}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{dialogTitle}</DialogTitle>
            </DialogHeader>
            {children}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
