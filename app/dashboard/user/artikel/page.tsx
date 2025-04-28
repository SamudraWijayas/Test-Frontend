"use client";

import Image from "next/image";
import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import * as React from "react";
import axios from 'axios';
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

const ITEMS_PER_PAGE = 9; // Number of articles per page

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
  // Add other dummy articles here...
];
function getTokenFromCookie() {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split("; ");
  const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));
  return tokenCookie ? tokenCookie.split("=")[1] : null;
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>(dummyArticles); // Initialize with dummy data
  const [currentPage, setCurrentPage] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const [, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Reset currentPage to 1 when selectedCategory changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Reset currentPage to 1 when searchQuery changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    const fetchCategories = async () => {
      const token = getTokenFromCookie(); // Function to get the token from cookies
      if (!token) {
        alert("Authentication required");
        return;
      }

      try {
        const res = await axios.get(
          "https://test-fe.mysellerpintar.com/api/categories",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status !== 200) throw new Error("Failed to fetch categories");

        setCategories(res.data.data); // Store categories from data.data
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const categoryQuery = selectedCategory
          ? `&category=${encodeURIComponent(selectedCategory)}`
          : "";
        const searchQueryParam = searchQuery
          ? `&search=${encodeURIComponent(searchQuery)}`
          : "";

        const response = await axios.get(
          `https://test-fe.mysellerpintar.com/api/articles?page=${currentPage}&limit=${ITEMS_PER_PAGE}${categoryQuery}${searchQueryParam}`
        );

        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }

        setArticles(response.data.data); // Update articles with real data from API
        setTotalArticles(response.data.total); // Update total articles count
      } catch (error) {
        console.error("Failed to fetch articles, using dummy data", error);
        setArticles(dummyArticles); // Use dummy data as fallback
        setTotalArticles(dummyArticles.length); // Use dummy data length for total count
      }
      setIsLoading(false);
    };

    fetchArticles();
  }, [currentPage, selectedCategory, searchQuery]);

  const totalPages = Math.ceil(totalArticles / ITEMS_PER_PAGE);

  // Menghitung artikel yang ditampilkan


  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
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
            <p className="text-sm font-medium">Blog genzet</p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              The Journal : Design Resources,
              <br />
              Interviews, and Industry News
            </h1>
            <p className="text-lg">Your daily dose of design insights!</p>
          </div>

          {/* Search bar */}
          <div className="w-full flex justify-center px-4">
            <div className="flex flex-col md:flex-row items-center gap-2 p-3 bg-blue-500/60 backdrop-blur-md rounded-xl w-fit">
              <Select
                onValueChange={(value) => setSelectedCategory(value)}
                value={selectedCategory || ""}
              >
                <SelectTrigger className="w-full md:w-[180px] bg-white text-black rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup className="bg-white">
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <div className="relative w-full md:flex-[2]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search articles"
                  className="w-80 pl-10 bg-white text-black rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} // Menangani perubahan pada search query
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold mb-10">
          Showing{" "}
          {Math.min(
            ITEMS_PER_PAGE,
            totalArticles - (currentPage - 1) * ITEMS_PER_PAGE
          )}{" "}
          of {totalArticles} Articles
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
        <div className="flex justify-center items-center mt-12 space-x-2 text-sm font-medium">
          {/* Tombol Previous */}
          <button
            onClick={handlePrevPage}
            className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100"
            disabled={currentPage === 1}
          >
            &lt; Previous
          </button>

          {/* Halaman 1 */}
          {currentPage > 2 && (
            <>
              <button
                onClick={() => handlePageClick(1)}
                className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100"
              >
                1
              </button>
              <span className="px-2">...</span>
            </>
          )}

          {/* Halaman aktif */}
          <button className="flex items-center justify-center w-8 h-8 rounded-md bg-gray-100 text-black">
            {currentPage}
          </button>

          {/* Halaman terakhir */}
          {currentPage < totalPages - 1 && (
            <>
              <span className="px-2">...</span>
              <button
                onClick={() => handlePageClick(totalPages)}
                className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100"
              >
                {totalPages}
              </button>
            </>
          )}

          {/* Tombol Next */}
          <button
            onClick={handleNextPage}
            className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100"
            disabled={currentPage === totalPages}
          >
            Next &gt;
          </button>
        </div>
      </main>

      <Footer />
    </>
  );
}
