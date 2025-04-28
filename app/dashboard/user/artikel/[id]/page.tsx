import { notFound } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import Navbar from "@/components/NavbarWhite";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

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

  try {
    // Fetch article by ID using axios
    const articleResponse = await axios.get(
      `https://test-fe.mysellerpintar.com/api/articles/${id}`
    );
    const article: Article = articleResponse.data;

    if (!article) return notFound();

    // Fetch all articles for "Artikel lainnya"
    const allArticlesResponse = await axios.get(
      `https://test-fe.mysellerpintar.com/api/articles`
    );

    const allArticles: Article[] = Array.isArray(allArticlesResponse.data)
      ? allArticlesResponse.data
      : allArticlesResponse.data.data ?? [];

    // Filter out the current article
    const otherArticles = allArticles.filter((a) => a.id !== article.id);

    // Limit to 3 articles
    const limitedArticles = otherArticles.slice(0, 3);

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
          </article>

          <section className="mt-12">
            <h3 className="text-2xl font-semibold mb-4">Artikel lainnya</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {limitedArticles.map((otherArticle) => {
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
            {/* Lihat Semua Button */}
            <div className="text-center mt-4">
              <Link href="/dashboard/user/artikel" className="text-blue-500">
                Lihat Semua Artikel
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  } catch (error) {
    console.error("Error fetching article data:", error);
    return notFound();
  }
}
