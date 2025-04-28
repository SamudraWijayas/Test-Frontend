"use client";

import { useState, useEffect } from "react";
import ArticleList from "@/components/article/ArticleList";
import CreateArticleForm from "@/components/article/CreateArticleForm";
import EditArticleForm from "@/components/article/EditArticleForm"; // Tambahin Import ini

interface Article {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  category: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    username: string;
  };
}

interface Category {
  id: string;
  name: string;
}

function getTokenFromCookie() {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split("; ");
  const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));
  return tokenCookie ? tokenCookie.split("=")[1] : null;
}

export default function ArtikelListPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); // New state for categories
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [, setDeletingArticleId] = useState<Article | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(""); // New state for selected category
  const [searchQuery, setSearchQuery] = useState("");

  const articlesPerPage = 10;

  useEffect(() => {
    // Fetching articles
    fetch("https://test-fe.mysellerpintar.com/api/articles")
      .then((res) => res.json())
      .then((data) => {
        setArticles(data.data);
        setTotalPages(Math.ceil(data.data.length / articlesPerPage));
      })
      .catch((err) => console.error("Failed to fetch articles", err));
  }, []);

  const fetchCategories = async () => {
    const token = getTokenFromCookie();
    if (!token) {
      alert("Authentication required");
      return;
    }

    try {
      const res = await fetch(
        "https://test-fe.mysellerpintar.com/api/categories",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch categories");

      const data = await res.json();
      console.log("Fetched categories:", data);
      setCategories(data.data); // <-- ambil dari data.data
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );

  const filteredArticles = currentArticles.filter((article) => {
    const matchesSearch = article.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory
      ? article.category.id === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleEditArticle = (article: Article) => {
    setEditingArticle(article);
  };

  const handleDeleteArticle = async (article: Article) => {
    const token = getTokenFromCookie();
    if (!token) {
      alert("Authentication required");
      return;
    }

    try {
      const res = await fetch(
        `https://test-fe.mysellerpintar.com/api/articles/${article.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete article");
      }

      // Update articles state by removing deleted article
      const updatedArticles = articles.filter((a) => a.id !== article.id);
      setArticles(updatedArticles);

      // Update total pages
      setTotalPages(Math.ceil(updatedArticles.length / articlesPerPage));

      // Reset deletingArticleId state
      setDeletingArticleId(null);
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("Failed to delete article");
    }
  };

  return (
    <main className="bg-white rounded-lg">
      {isCreating ? (
        <CreateArticleForm onCancel={() => setIsCreating(false)} />
      ) : editingArticle ? (
        <EditArticleForm
          initialData={editingArticle}
          onCancel={() => setEditingArticle(null)}
        />
      ) : (
        <ArticleList
          articles={articles}
          currentArticles={filteredArticles} // Pass filtered articles here
          currentPage={currentPage}
          totalPages={totalPages}
          filteredCategories={filteredArticles}
          categories={categories} // Pass categories to ArticleList
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory} // Pass setter function for category
          handlePrevPage={handlePrevPage}
          handleNextPage={handleNextPage}
          onAddArticle={() => setIsCreating(true)}
          onEditArticle={handleEditArticle}
          onDeleteArticle={handleDeleteArticle}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery} // Pass setter function for search query
          setCurrentPage={setCurrentPage} // 🔥 INI DITAMBAH
        />
      )}
    </main>
  );
}
