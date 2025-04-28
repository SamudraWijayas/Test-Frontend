"use client";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";

// Definisikan tipe untuk artikel
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

const dummyArticles: Article[] = [
  {
    id: "1",
    imageUrl:
      "/images/young-male-designer-using-graphics-tablet-while-working-with-com.jpg",
    createdAt: new Date().toISOString(),
    title: "Dummy Article 1",
    content: "This is a dummy article content for article 1.",
    category: { name: "design" },
  },
  {
    id: "2",
    imageUrl:
      "/images/young-male-designer-using-graphics-tablet-while-working-with-com.jpg",
    createdAt: new Date().toISOString(),
    title: "Dummy Article 2",
    content: "This is a dummy article content for article 2.",
    category: { name: "technology" },
  },
  {
    id: "3",
    imageUrl:
      "/images/young-male-designer-using-graphics-tablet-while-working-with-com.jpg",
    createdAt: new Date().toISOString(),
    title: "Dummy Article 3",
    content: "This is a dummy article content for article 3.",
    category: { name: "news" },
  },
];

export default function Home() {
  // Deklarasikan tipe data untuk state articles
  const [articles, setArticles] = useState<Article[]>([]);
  const [, setScrolled] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          "https://test-fe.mysellerpintar.com/api/articles"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setArticles(data.data); // Assuming the API response is in the "data" field
      } catch (error) {
        console.error("Failed to fetch articles, using dummy data", error);
        setArticles(dummyArticles);
      }
    };

    fetchArticles();

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // Keep the dependency array empty since dummyArticles is constant

  return (
    <>
      <Head>
        <title>The Journal</title>
      </Head>

      <Navbar />

      {/* HERO */}
      <header className="relative w-full bg-blue-600 text-white py-28 text-center overflow-hidden">
        {/* Background Image */}
        <Image
          src="/images/young-male-designer-using-graphics-tablet-while-working-with-com.jpg"
          alt="Background"
          layout="fill"
          objectFit="cover"
          className="opacity-20"
        />

        {/* Overlay Content */}
        <div className="relative z-10 flex flex-col items-center space-y-6">
          <div className="space-y-3">
            {/* Small title */}
            <p className="text-sm font-medium">Blog genzet</p>

            {/* Big title */}
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              The Journal : Design Resources,
              <br />
              Interviews, and Industry News
            </h1>

            {/* Subtitle */}
            <p className="text-lg">Your daily dose of design insights!</p>
          </div>

          {/* Search bar */}
          <div className="w-full flex justify-center px-4">
            <div className="flex flex-col md:flex-row items-center gap-2 p-3 bg-blue-500/60 backdrop-blur-md rounded-xl w-fit">
              {/* Select */}
              <Select>
                <SelectTrigger className="w-full md:w-[180px] bg-white text-black rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="news">News</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              {/* Search Input */}
              <div className="relative w-full md:flex-[2]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search articles"
                  className="w-80 pl-10 bg-white text-black rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold mb-10">
          Showing {articles.length} Articles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => {
            const formattedDate = new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }).format(new Date(article.createdAt));

            return (
              <Link
                key={article.id}
                href={`/dashboard/user/artikel/${article.id}`}
              >
                <ArticleCard
                  image={
                    article.imageUrl ||
                    "/images/young-male-designer-using-graphics-tablet-while-working-with-com.jpg"
                  }
                  date={formattedDate}
                  title={article.title}
                  description={article.content}
                  tags={[article.category.name]}
                />
              </Link>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-12 space-x-2">
          <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
            Previous
          </button>
          <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
            1
          </button>
          <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
            Next
          </button>
        </div>
      </main>

      <Footer />
    </>
  );
}
