import Image from "next/image";
import ArticleCard from "@/components/ArticleCard";
import Navbar from "@/components/NavbarWhite";

const articles = [
  {
    image:
      "/images/young-male-designer-using-graphics-tablet-while-working-with-com.jpg",
    date: "April 18, 2025",
    title: "Cybersecurity Essentials Every Developer Should Know",
    description:
      "Protect your work and users with fundamental cybersecurity techniques and solutions.",
    tags: ["Technology", "Security"],
  },
  {
    image:
      "/images/young-male-designer-using-graphics-tablet-while-working-with-com.jpg",
    date: "April 18, 2025",
    title: "The Future of Work: Remote-First Teams and Digital Tools",
    description:
      "How companies are crafting remote-first policies and using collaboration tools.",
    tags: ["Remote", "Tools"],
  },
  {
    image:
      "/images/young-male-designer-using-graphics-tablet-while-working-with-com.jpg",
    date: "April 18, 2025",
    title: "The Future of Work: Remote-First Teams and Digital Tools",
    description:
      "How companies are crafting remote-first policies and using collaboration tools.",
    tags: ["Remote", "Tools"],
  },
  // Tambahkan artikel lainnya...
];

export default function ArticlePage() {
  return (
    <div className="bg-white text-black">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 pb-10 pt-26">
        <article>
          <p className="text-sm text-gray-500 text-center">
            February 8, 2024 · Creativity, Agile
          </p>
          <h1 className="text-3xl font-bold mt-2 mb-6 text-center">
            Figma’s New Dev Mode: A Game-Changer for Designers & Developers
          </h1>

          <div className="relative w-full h-50 lg:h-100 mb-8">
            <Image
              src="/images/young-male-designer-using-graphics-tablet-while-working-with-com.jpg"
              alt="Man working with two monitors"
              fill
              className="object-cover rounded-xl"
            />
          </div>

          <p className="mb-4">
            Di dunia digital modern, kolaborasi antara desainer dan developer
            seringkali penuh tantangan. Namun, Figma memperkenalkan fitur baru
            bernama <strong>Dev Mode</strong> yang menghadirkan cara baru untuk
            meningkatkan komunikasi dan alur kerja.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">Apa itu Dev Mode?</h2>
          <p className="mb-4">
            Dev Mode adalah fitur di Figma yang memfokuskan tampilan khusus bagi
            developer, memungkinkan mereka untuk lebih mudah membaca spesifikasi
            desain dan mengambil aset yang dibutuhkan.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">Fitur Utama</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>Inspeksi Desain yang Lebih Detil</li>
            <li>Dokumentasi Otomatis</li>
            <li>Integrasi dengan Tools Developer</li>
            <li>Mode Navigasi yang Ramah Developer</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-2">Pemikiran Akhir</h2>
          <p className="mb-4">
            Dengan Dev Mode, Figma berhasil menjembatani jurang komunikasi
            antara desainer dan developer. Ini adalah langkah maju dalam
            efisiensi tim produk.
          </p>
        </article>

        <section className="mt-12">
          <h3 className="text-2xl font-semibold mb-4">Artikel lainnya</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, idx) => (
              <ArticleCard key={idx} {...article} />
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-blue-50 text-center py-6 mt-12 text-sm text-gray-600">
        <p>© 2025 LogicIpsum. All rights reserved.</p>
      </footer>
    </div>
  );
}
