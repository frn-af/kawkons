import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Data } from "@/lib/db/schema";
import { deleteData } from "@/actions/action";

type DeleteProps = {
  data: Data;
  onDelete: (id: number) => void;
};

export function DeleteDialog({ data, onDelete }: DeleteProps) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const response = await deleteData(data.id);

    if (response instanceof Error || !response) {
      toast({
        title: "Failed to delete data",
        description: "Please try again later.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    toast({
      title: "Data deleted successfully",
      description: "The data has been removed.",
      variant: "default",
    });

    setLoading(false);
    onDelete(data.id);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="capitalize">
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Data</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this data? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
