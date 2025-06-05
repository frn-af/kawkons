"use client";
import { CreateForm } from "@/components/create-form";
import { ResultDialog } from "@/components/result-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Data } from "@/lib/db/schema";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Data | undefined>();

  const handleOpen = (data: Data) => {
    setFormData(data);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <main className="h-full max-w-screen-md mx-auto p-10">
      <div className="w-full flex justify-center items-center h-full p-4">
        <Card className="w-2/3">
          <CardHeader className="flex justify-between w-full">
            <div className="flex justify-between w-full">
              <h1>Cek IMT Anda</h1>
              <Link href="/imt">
                <Button className="capitalize">lihat data lain</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <CreateForm onSubmitAction={handleOpen} />
            <ResultDialog isOpen={isOpen} onClose={handleClose} data={formData!} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
