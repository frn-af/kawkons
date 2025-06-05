"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { getImtByNohp, newData } from "@/actions/action"
import { Data } from "@/lib/db/schema"
import { useState } from "react"

type CrudProps = {
  onSubmitAction: (data: Data) => void
}

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  no_hp: z.string().min(10, {
    message: "No HP must be at least 10 characters.",
  }),
  tinggi_badan: z.coerce.number().min(1, {
    message: "Tinggi badan must be at least 1 characters.",
  }),
  berat_badan: z.coerce.number().min(1, {
    message: "Berat badan must be at least 1 characters.",
  })
})

export function CreateForm({ onSubmitAction }: CrudProps) {
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      no_hp: undefined,
      tinggi_badan: undefined,
      berat_badan: undefined
    },
  })

  const formSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true)

    const checkNoHP = await getImtByNohp(data.no_hp)
    if (checkNoHP.length > 0) {
      toast({
        title: "No HP already exist",
        description: "Please use another No HP",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    const addData = await newData(data)
    if (addData instanceof Error || !addData) {
      toast({
        title: "Failed submitted data",
        description: "Please try again later",
        variant: "destructive",
      })
      setLoading(false)
      return
    }
    toast({
      title: "Data submitted successfully",
      description: "Thank you for submitting your data",
      variant: "default",
    })
    onSubmitAction(addData[0]!)
    setLoading(false)
    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(formSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="Nama" required {...field} />
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
              <FormLabel>No.HP</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="08XXXXXXXXXX"
                  {...field}
                  required
                  value={field.value || ""}
                  onChange={(e) => {
                    const value = e.target.value
                    field.onChange(value.replace(/\D/g, ""))
                  }}
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
              <FormLabel>Tinggi Badan *(cm)</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="Tinggi badan anda"
                  {...field}
                  required
                  value={field.value || ""}
                  onChange={(e) => {
                    const value = e.target.value
                    field.onChange(value.replace(/\D/g, ""))
                  }}
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
              <FormLabel>Berat Badan *(kg)</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="Berat badan anda"
                  {...field}
                  required
                  value={field.value || ""}
                  onChange={(e) => {
                    const value = e.target.value
                    field.onChange(value.replace(/\D/g, ""))
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            "Loading..."
          ) : (
            "Hitung"
          )}
        </Button>
      </form>
    </Form>
  )
}
