"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { artikelSchema } from "@/lib/zodSchema";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "@/lib/axios";
import { useEffect } from "react";

const ArtikelForm = ({ artikelId }: { artikelId?: string }) => {
  const form = useForm<z.infer<typeof artikelSchema>>({
    resolver: zodResolver(artikelSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  useEffect(() => {
    const fetchArtikel = async () => {
      if (!artikelId) return;
      try {
        const res = await axios.get(`/artikel/${artikelId}`);
        form.reset({
          title: res.data.title,
          content: res.data.content,
        });
      } catch (err) {
        console.error("Gagal mengambil data artikel", err);
      }
    };
    fetchArtikel();
  }, [artikelId, form]);

  const onSubmit = async (data: z.infer<typeof artikelSchema>) => {
    if (artikelId) await axios.put(`/artikel/${artikelId}`, data);
    else await axios.post("/artikel", data);
    window.location.href = "/dashboard/admin/artikel";
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Input {...form.register("title")} placeholder="Judul" />
      <Input {...form.register("content")} placeholder="Konten" />
      <Button type="submit">Simpan</Button>
    </form>
  );
};

export default ArtikelForm;
