"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

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

interface ArticleListProps {
  articles: Article[];
  currentArticles: Article[];
  filteredCategories: Article[];
  currentPage: number;
  totalPages: number;
  handlePrevPage: () => void;
  handleNextPage: () => void;
  onAddArticle: () => void;
  onEditArticle: (article: Article) => void;
  onDeleteArticle: (article: Article) => void;
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };
  return date.toLocaleString("en-US", options);
}

export default function ArticleList({
  articles,
  currentArticles,
  currentPage,
  totalPages,
  handlePrevPage,
  handleNextPage,
  onAddArticle,
  onEditArticle,
  onDeleteArticle,
  categories,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  setCurrentPage,
}: ArticleListProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);

  const openDeleteModal = (article: Article) => {
    setArticleToDelete(article);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setArticleToDelete(null);
    setShowDeleteModal(false);
  };

  const confirmDelete = () => {
    if (articleToDelete) {
      onDeleteArticle(articleToDelete);
      closeDeleteModal();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">
          Total Articles : {articles.length}
        </h1>
      </div>
      <hr className="border-b-1 border-gray-300/50 my-2" />

      <div className="flex justify-between items-center mb-4 p-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <select
              className="border border-gray-300 rounded-md py-2 px-4 text-sm focus:outline-none"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <input
            type="text"
            placeholder="Search by title"
            className="border border-gray-300 rounded-md py-2 px-4 text-sm focus:outline-none w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button className="bg-blue-600 text-white" onClick={onAddArticle}>
          + Add Articles
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Thumbnails</th>
              <th className="p-3">Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">Author</th>
              <th className="p-3">Created at</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentArticles.map((article) => (
              <tr key={article.id} className="border-b-1 border-gray-300/50">
                <td className="p-3 flex justify-center">
                  <div className="relative w-12 h-12 rounded">
                    <Image
                      src={
                        article.imageUrl ||
                        "/images/young-male-designer-using-graphics-tablet-while-working-with-com.jpg"
                      }
                      layout="fill"
                      objectFit="cover"
                      alt="Background"
                      className="rounded"
                    />
                  </div>
                </td>
                <td className="p-3">{article.title}</td>
                <td className="p-3">{article.category?.name ?? "-"}</td>
                <td className="p-3">{article.user?.username ?? "-"}</td>
                <td className="p-3">{formatDate(article.createdAt)}</td>
                <td className="p-3 space-x-2">
                  <Link
                    href={`/dashboard/admin/artikel/${article.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Preview
                  </Link>
                  <button
                    onClick={() => onEditArticle(article)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(article)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center gap-2 mt-6 mb-4 pb-4">
        <Button onClick={handlePrevPage} disabled={currentPage === 1} size="sm">
          Previous
        </Button>

        {/* Render halaman */}
        {[...Array(totalPages)].map((_, index) => {
          const pageNum = index + 1;
          // Logika untuk tampilkan halaman tertentu dan "..." jika perlu
          if (
            pageNum === 1 ||
            pageNum === totalPages ||
            (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
          ) {
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1 rounded-md text-sm ${
                  pageNum === currentPage
                    ? "bg-gray-100 border border-gray-300"
                    : "hover:bg-gray-200"
                }`}
              >
                {pageNum}
              </button>
            );
          }
          if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
            return (
              <span key={pageNum} className="px-2 text-gray-500">
                ...
              </span>
            );
          }
          return null;
        })}

        <Button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          size="sm"
        >
          Next
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && articleToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full">
            <h2 className="text-lg font-semibold mb-4">Delete Articles</h2>
            <p className="mb-6">
              Deleting this article is permanent and cannot be undone. All
              related content will be removed.
            </p>
            <div className="flex justify-end gap-4">
              <Button
                className="bg-gray-300 text-black"
                onClick={closeDeleteModal}
              >
                Cancel
              </Button>
              <Button className="bg-red-600 text-white" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
