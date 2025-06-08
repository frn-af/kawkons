"use client";
import { KawasanForm } from "@/components/form/create-kawasan";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="h-full max-w-screen-md mx-auto p-10">
      <div className="w-full flex justify-center items-center p-4">
        <Card className="w-2/3">
          <CardHeader className="flex justify-between w-full">
            <div className="flex justify-between w-full">
              <h1>Cek IMT Anda</h1>
            </div>
          </CardHeader>
          <CardContent>
            <KawasanForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
