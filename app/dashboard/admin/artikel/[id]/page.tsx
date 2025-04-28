"use client";

import { useParams } from "next/navigation"; // Menggunakan useParams dari next/navigation
import { useEffect, useState } from "react";

type Artikel = {
  id: string;
  title: string;
  content: string;
  createdAt: string; // atau properti lain sesuai API kamu
};

const ArtikelDetailPage = () => {
  const { id } = useParams(); // Ambil id dari URL
  const [artikel, setArtikel] = useState<Artikel | null>(null);

  useEffect(() => {
    if (id) {
      // Ambil data artikel berdasarkan id
      fetch(`https://test-fe.mysellerpintar.com/api/articles/${id}`)
        .then((response) => response.json())
        .then((data) => setArtikel(data))
        .catch((error) => console.error("Gagal mengambil artikel", error));
    }
  }, [id]);

  if (!artikel) {
    return <div>Loading...</div>; // Menampilkan loading ketika data belum tersedia
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold">{artikel.title}</h1>
      <div className="mt-4">
        <p>{artikel.content}</p>
      </div>
    </div>
  );
};

export default ArtikelDetailPage;
