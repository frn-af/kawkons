import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/hooks/use-toast";
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
import { useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Data } from "@/lib/db/schema";
import { updateData } from "@/actions/action";

type EditProps = {
  oldData: Data;
  onUpdate: (updatedItem: Data) => void;
};

const FormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  no_hp: z.string().min(10, { message: "No HP must be at least 10 characters." }),
  tinggi_badan: z.coerce.number().min(1, { message: "Height must be valid." }),
  berat_badan: z.coerce.number().min(1, { message: "Weight must be valid." }),
});

export function UpdateForm({ oldData, onUpdate }: EditProps) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: oldData?.name,
      no_hp: oldData?.no_hp,
      tinggi_badan: oldData?.tinggi_badan,
      berat_badan: oldData?.berat_badan,
    },
  });

  const formSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);

    const updatedData = await updateData(data, oldData.id);
    if (updatedData instanceof Error || !updatedData) {
      toast({
        title: "Failed to update data",
        description: "Please try again later.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    toast({
      title: "Data updated successfully",
      description: "The changes have been saved.",
      variant: "default",
    });

    setLoading(false);
    form.reset();
    onUpdate({ ...oldData, ...data });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit(formSubmit)();
            }}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Nama" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="no_hp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No HP</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="08XXXXXXXXXX"
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value.replace(/\D/g, ""))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tinggi_badan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tinggi Badan (cm)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Tinggi badan anda"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="berat_badan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Berat Badan (kg)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Berat badan anda"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Loading..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
