"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Category {
  id: string;
  name?: string;
}

interface ArticleData {
  id: string | number;
  title: string;
  category?: Category;
  content: string;
}

interface EditArticleFormProps {
  initialData: ArticleData;
  onCancel: () => void;
}

// Helper function ambil token dari cookie
function getTokenFromCookie() {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split("; ");
  const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));
  return tokenCookie ? tokenCookie.split("=")[1] : null;
}

export default function EditArticleForm({
  initialData,
  onCancel,
}: EditArticleFormProps) {
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [title, setTitle] = useState(initialData.title || ""); // Set dari initialData
  const [category, setCategory] = useState(initialData.category?.id || ""); // Set dari initialData
  const [content, setContent] = useState(initialData.content || "");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setThumbnail(e.target.files[0]);
    }
  };

  const fetchCategories = async () => {
    const token = getTokenFromCookie();
    if (!token) {
      alert("Authentication required");
      return;
    }

    try {
      // Menggunakan axios untuk melakukan request GET
      const res = await axios.get(
        "https://test-fe.mysellerpintar.com/api/categories",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Pastikan response status adalah 200
      if (res.status !== 200) {
        throw new Error("Failed to fetch categories");
      }

      // Ambil data dari response dan set ke state categories
      setCategories(res.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    const token = getTokenFromCookie();
    if (!token) {
      alert("Authentication required");
      return;
    }

    if (!title || !content || !category) {
      alert("Please fill in all the fields.");
      return;
    }

    try {
      const response = await axios.put(
        `https://test-fe.mysellerpintar.com/api/articles/${initialData.id}`,
        {
          title: title,
          content: content,
          categoryId: category,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Update article with ID:", initialData.id);
      console.log("Article updated:", response.data);

      // Tampilkan pesan Toast sukses
      toast.success("Artikel berhasil diperbarui!");

      onCancel();
    } catch (error) {
      console.error("Error updating article:", error);

      // Tampilkan pesan Toast error jika gagal
      toast.error("Gagal memperbarui artikel!");
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={onCancel}
        className="text-sm text-blue-500 hover:underline mb-4"
      >
        ← Back to Articles
      </button>

      <div className="bg-white p-6 rounded-lg shadow">
        {/* Thumbnail */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Thumbnails</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer">
            <Input
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleThumbnailChange}
              className="hidden"
              id="thumbnail"
            />
            <label htmlFor="thumbnail" className="cursor-pointer">
              <p className="text-gray-400">Click to select files</p>
              <p className="text-gray-300 text-sm">
                Support File Type : jpg or png
              </p>
            </label>
          </div>
        </div>

        {/* Title */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Title</label>
          <Input
            placeholder="Input title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Category */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 rounded-md w-full p-2 focus:outline-none"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">
            The existing category list can be seen in the{" "}
            <Link
              href="/dashboard/admin/category"
              className="text-blue-500 hover:underline"
            >
              category
            </Link>{" "}
            menu
          </p>
        </div>

        {/* Content */}
        <div className="mb-6">
          <Textarea
            placeholder="Type a content..."
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <p className="text-sm text-gray-400 mt-1">
            {content.trim().split(/\s+/).filter(Boolean).length} Words
          </p>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="outline">Preview</Button>
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Update
          </Button>
        </div>
      </div>
    </div>
  );
}
