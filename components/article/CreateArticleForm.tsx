"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Undo2,
  Redo2,
  Bold,
  Italic,
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowLeft } from "lucide-react";

// Helper function ambil token dari cookie
function getTokenFromCookie() {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split("; ");
  const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));
  return tokenCookie ? tokenCookie.split("=")[1] : null;
}

interface CreateArticleFormProps {
  onCancel: () => void;
}

export default function CreateArticleForm({
  onCancel,
}: CreateArticleFormProps) {
  const [, setThumbnail] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [align, setAlign] = useState<"left" | "center" | "right" | null>(null);
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

      // Pastikan status response adalah 200
      if (res.status !== 200) {
        throw new Error("Failed to fetch categories");
      }

      // Ambil data dari response dan set ke state categories
      console.log("Fetched categories:", res.data);
      setCategories(res.data.data); // <-- ambil dari data.data
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
      toast.error("Authentication required");
      return;
    }

    if (!title || !content || !category) {
      toast.warn("Please fill in all the fields.");
      return;
    }

    try {
      // Menggunakan axios untuk melakukan request POST
      const res = await axios.post(
        "https://test-fe.mysellerpintar.com/api/articles",
        {
          title: title,
          content: content,
          categoryId: category,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Pastikan status response adalah 200 atau 201 untuk sukses
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Failed to create article");
      }

      const data = res.data;
      console.log("Article created:", data);

      // Tampilkan toast sukses
      toast.success("Article created successfully!");

      // Reset form setelah upload
      setTitle("");
      setCategory("");
      setContent("");
      onCancel();
    } catch (error) {
      console.error("Error creating article:", error);
      toast.error("Error creating article!");
    }
  };
  const handleCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    updateToolbarState();
  };

  const updateToolbarState = () => {
    setIsBold(document.queryCommandState("bold"));
    setIsItalic(document.queryCommandState("italic"));

    if (document.queryCommandState("justifyCenter")) setAlign("center");
    else if (document.queryCommandState("justifyRight")) setAlign("right");
    else setAlign("left");
  };

  useEffect(() => {
    document.addEventListener("selectionchange", updateToolbarState);
    return () => {
      document.removeEventListener("selectionchange", updateToolbarState);
    };
  }, []);
  return (
    <div className="p-4">
      <button
        onClick={onCancel}
        className="flex items-center text-sm text-black hover:underline mb-4"
      >
        <ArrowLeft className="mr-2" /> Create Articles
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
        <div className="mb-6 border-1 border-gray-300 rounded-xl">
          {/* Toolbar */}
          <div className="flex items-center gap-2 pb-3 border-b p-4 border-gray-300 bg-white rounded-tl-xl rounded-tr-xl">
            {/* Undo & Redo */}
            <button
              type="button"
              onClick={() => handleCommand("undo")}
              className="p-2 rounded hover:bg-gray-100"
            >
              <Undo2 size={20} />
            </button>
            <button
              type="button"
              onClick={() => handleCommand("redo")}
              className="p-2 rounded hover:bg-gray-100"
            >
              <Redo2 size={20} />
            </button>

            {/* Separator */}
            <div className="h-6 w-px bg-gray-300 mx-2" />

            {/* Bold & Italic */}
            <button
              type="button"
              onClick={() => handleCommand("bold")}
              className={`p-2 rounded hover:bg-gray-100 ${
                isBold ? "text-blue-500" : ""
              }`}
            >
              <Bold size={20} />
            </button>
            <button
              type="button"
              onClick={() => handleCommand("italic")}
              className={`p-2 rounded hover:bg-gray-100 ${
                isItalic ? "text-blue-500" : ""
              }`}
            >
              <Italic size={20} />
            </button>

            {/* Separator */}
            <div className="h-6 w-px bg-gray-300 mx-2" />

            {/* Insert Image */}
            <button
              type="button"
              onClick={() => alert("Insert image belum diimplementasi")}
              className="p-2 rounded hover:bg-gray-100"
              aria-label="Insert image"
            >
              <Image size={20} aria-hidden="true" focusable="false" />
            </button>

            {/* Separator */}
            <div className="h-6 w-px bg-gray-300 mx-2" />

            {/* Align */}
            <button
              type="button"
              onClick={() => handleCommand("justifyLeft")}
              className={`p-2 rounded hover:bg-gray-100 ${
                align === "left" ? "text-blue-500" : ""
              }`}
            >
              <AlignLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => handleCommand("justifyCenter")}
              className={`p-2 rounded hover:bg-gray-100 ${
                align === "center" ? "text-blue-500" : ""
              }`}
            >
              <AlignCenter size={20} />
            </button>
            <button
              type="button"
              onClick={() => handleCommand("justifyRight")}
              className={`p-2 rounded hover:bg-gray-100 ${
                align === "right" ? "text-blue-500" : ""
              }`}
            >
              <AlignRight size={20} />
            </button>
          </div>

          {/* Editable Content */}
          <div
            ref={editorRef}
            contentEditable
            className="border border-gray-300 bg-gray-100 min-h-[200px] p-4 focus:outline-none text-left"
            onInput={(e) => {
              const text = (e.target as HTMLElement).innerHTML;
              setContent(text);
            }}
            suppressContentEditableWarning={true}
          ></div>

          {/* Word Counter */}
          <p className="text-sm text-black mt-1 p-4">
            {
              content
                .replace(/<[^>]+>/g, "")
                .trim()
                .split(/\s+/)
                .filter(Boolean).length
            }{" "}
            Words
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
            Upload
          </Button>
        </div>
      </div>
    </div>
  );
}
