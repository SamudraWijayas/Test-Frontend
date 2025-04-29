"use client";

import { useState, useEffect } from "react";
import ArticleList from "@/components/article/ArticleList";
import CreateArticleForm from "@/components/article/CreateArticleForm";
import EditArticleForm from "@/components/article/EditArticleForm";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

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
  const [, setDeletingArticleId] = useState<Article | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(""); // New state for selected category
  const [searchQuery, setSearchQuery] = useState("");

  const articlesPerPage = 9;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get(
          "https://test-fe.mysellerpintar.com/api/articles"
        );

        // Pastikan status response OK
        if (res.status === 200) {
          setArticles(res.data.data);
          setTotalPages(Math.ceil(res.data.data.length / articlesPerPage));
        } else {
          throw new Error("Failed to fetch articles");
        }
      } catch (err) {
        console.error("Failed to fetch articles", err);
      }
    };

    fetchArticles();
  }, []);

  const fetchCategories = async () => {
    const token = getTokenFromCookie();
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

      if (res.status !== 200) {
        throw new Error("Failed to fetch categories");
      }

      console.log("Fetched categories:", res.data);
      setCategories(res.data.data); 
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory
      ? article.category.id === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    setTotalPages(Math.ceil(filteredArticles.length / articlesPerPage));
    if (currentPage > Math.ceil(filteredArticles.length / articlesPerPage)) {
      setCurrentPage(1);
    }
  }, [filteredArticles, currentPage]);

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );

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
      const res = await axios.delete(
        `https://test-fe.mysellerpintar.com/api/articles/${article.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Pastikan status response OK
      if (res.status !== 200) {
        throw new Error("Failed to delete article");
      }

      const updatedArticles = articles.filter((a) => a.id !== article.id);
      setArticles(updatedArticles);

      setTotalPages(Math.ceil(updatedArticles.length / articlesPerPage));

      setDeletingArticleId(null);

      toast.success("Artikel berhasil dihapus!");
    } catch (error) {
      console.error("Error deleting article:", error);

      toast.error("Gagal menghapus artikel!");
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
          currentArticles={currentArticles} 
          currentPage={currentPage}
          totalPages={totalPages}
          filteredCategories={filteredArticles}
          categories={categories} 
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory} 
          handlePrevPage={handlePrevPage}
          handleNextPage={handleNextPage}
          onAddArticle={() => setIsCreating(true)}
          onEditArticle={handleEditArticle}
          onDeleteArticle={handleDeleteArticle}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery} 
          setCurrentPage={setCurrentPage} 
        />
      )}
    </main>
  );
}
