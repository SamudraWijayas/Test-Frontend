import { notFound } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import Navbar from "@/components/NavbarWhite";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";

interface Article {
  id: string;
  imageUrl: string | null;
  createdAt: string;
  title: string;
  content: string;
  category: {
    name: string;
  };
}

export default async function DetailArtikelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(
    `https://test-fe.mysellerpintar.com/api/articles/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) return notFound();

  const article: Article = await res.json();

  if (!article) return notFound();

  // Fetch all articles for "Artikel lainnya"
  const resAll = await fetch(
    `https://test-fe.mysellerpintar.com/api/articles`,
    { cache: "no-store" }
  );

  if (!resAll.ok) return notFound();

  const allArticlesResponse = await resAll.json();

  const allArticles: Article[] = Array.isArray(allArticlesResponse)
    ? allArticlesResponse
    : allArticlesResponse.data ?? [];

  const otherArticles = allArticles.filter((a) => a.id !== article.id);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(article.createdAt));

  return (
    <div className="bg-white text-black">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 pb-10 pt-26">
        <article>
          <p className="text-sm text-gray-500 text-center">
            {formattedDate} · {article.category.name}
          </p>
          <h1 className="text-3xl font-bold mt-2 mb-6 text-center">
            {article.title}
          </h1>

          <div className="relative w-full h-50 lg:h-100 mb-8">
            <Image
              src="/images/young-male-designer-using-graphics-tablet-while-working-with-com.jpg"
              alt="Man working with two monitors"
              fill
              className="object-cover rounded-xl"
            />
          </div>

          <p className="mb-4">{article.content}</p>

          {/* <h2 className="text-xl font-semibold mt-6 mb-2">Apa itu Dev Mode?</h2>
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
          </p> */}
        </article>

        <section className="mt-12">
          <h3 className="text-2xl font-semibold mb-4">Artikel lainnya</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherArticles.map((otherArticle) => {
              const otherFormattedDate = new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }).format(new Date(otherArticle.createdAt));
              return (
                <Link
                  key={otherArticle.id}
                  href={`/dashboard/user/artikel/${otherArticle.id}`}
                >
                  <ArticleCard
                    image={
                      otherArticle.imageUrl ??
                      "/images/young-male-designer-using-graphics-tablet-while-working-with-com.jpg"
                    }
                    date={otherFormattedDate}
                    title={otherArticle.title}
                    description={
                      otherArticle.content.length > 100
                        ? otherArticle.content.substring(0, 100) + "..."
                        : otherArticle.content
                    }
                    tags={[otherArticle.category.name]}
                  />
                </Link>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
