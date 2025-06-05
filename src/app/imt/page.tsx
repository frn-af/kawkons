"use client";

import { useState, useEffect, useCallback } from 'react';
import { getImtData, updateData, deleteData } from '@/actions/action';
import { Button } from '@/components/ui/button';
import { Data } from '@/lib/db/schema';
import Link from 'next/link';
import { ResultDialog } from '@/components/result-dialog';
import { DeleteDialog } from '@/components/delete-dialog';
import { UpdateForm } from '@/components/update-form';

export default function Imt() {
  const [selectedData, setSelectedData] = useState<Data | null>(null);
  const [data, setData] = useState<Data[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const imtData = await getImtData();
      setData(imtData);
    } catch {
      setError('Failed to fetch IMT data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpen = useCallback((item: Data) => setSelectedData(item), []);
  const handleClose = useCallback(() => setSelectedData(null), []);

  const handleUpdate = useCallback(
    async (updatedItem: Data) => {
      if (!data) return;
      const updatedData = await updateData(updatedItem, updatedItem.id);
      if (updatedData instanceof Error || !updatedData) {
        console.error('Failed to update item');
        return;
      }
      setData((prevData) =>
        prevData
          ? prevData.map((item) =>
            item.id === updatedItem.id ? updatedItem : item
          )
          : null
      );
    },
    [data]
  );

  const handleDelete = useCallback(
    async (id: number) => {
      if (!data) return;
      const response = await deleteData(id);
      if (response instanceof Error || !response) {
        console.error('Failed to delete item');
        return;
      }
      setData((prevData) =>
        prevData ? prevData.filter((item) => item.id !== id) : null
      );
    },
    [data]
  );

  if (loading) {
    return (
      <div className="h-full flex justify-center items-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <main className="h-full max-w-screen-md mx-auto p-10">
      <header className="flex justify-between">
        <h3>IMT List</h3>
        <Link href="/">
          <Button className="capitalize">kembali</Button>
        </Link>
      </header>

      <section className="w-full space-y-4 mt-6">
        {data?.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between w-full border border-primary rounded p-4"
          >
            <div>
              <p>Nama: {item.name}</p>
              <p>No HP: {item.no_hp}</p>
            </div>
            <div className="flex gap-2">
              <Button className="capitalize" onClick={() => handleOpen(item)}>
                Lihat Hasil IMT
              </Button>
              <UpdateForm oldData={item} onUpdate={handleUpdate} />
              <DeleteDialog data={item} onDelete={() => handleDelete(item.id)} />
            </div>
          </div>
        ))}
      </section>

      {selectedData && (
        <ResultDialog isOpen={!!selectedData} onClose={handleClose} data={selectedData} />
      )}
    </main>
  );
}
