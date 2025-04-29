"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import {
  Undo2,
  Redo2,
  Bold,
  Images,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

interface Category {
  id: string;
  name?: string;
}

interface ArticleData {
  id: string | number;
  title: string;
  category?: Category;
  content: string;
  imageUrl?: string | null;
}

interface EditArticleFormProps {
  initialData: ArticleData;
  onCancel: () => void;
}

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
  const [title, setTitle] = useState(initialData.title || "");
  const [category, setCategory] = useState(initialData.category?.id || "");
  const [content, setContent] = useState(initialData.content || "");
  const editorRef = useRef<HTMLDivElement>(null);

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [align, setAlign] = useState<"left" | "center" | "right" | null>(null);

  // Helper to call onUpdate with current form data
  // const callOnUpdate = (
  //   newTitle: string,
  //   newCategory: string,
  //   newContent: string
  // ) => {
  //   onUpdate({
  //     id: initialData.id,
  //     title: newTitle,
  //     category: { id: newCategory },
  //     content: newContent,
  //     imageUrl: previewUrl,
  //   });
  // };
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
    initialData.imageUrl || ""
  );

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

      if (res.status !== 200) throw new Error("Failed to fetch categories");

      setCategories(res.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

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
      let imageUrl = initialData.imageUrl || "";

      // Jika user memilih gambar baru, upload dulu ke server
      if (image) {
        const formData = new FormData();
        formData.append("image", image);

        const uploadRes = await axios.post(
          "https://test-fe.mysellerpintar.com/api/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (uploadRes.status !== 200) {
          throw new Error("Failed to upload image");
        }

        imageUrl = uploadRes.data.imageUrl;
      }

      const res = await axios.put(
        `https://test-fe.mysellerpintar.com/api/articles/${initialData.id}`,
        {
          title,
          content,
          categoryId: category,
          imageUrl,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Failed to update article");
      }

      // toast.success("Article updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating article:", error);
      toast.error("Error updating article!");
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
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  return (
    <div className="p-4">
      <button
        onClick={onCancel}
        className="text-sm text-blue-500 hover:underline mb-4"
      >
        ← Back to Articles
      </button>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Image</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer">
            <Input
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleImageChange}
              className="hidden"
              id="image"
            />
            <label htmlFor="image" className="cursor-pointer">
              <p className="text-gray-400">Click to select files</p>
              <p className="text-gray-300 text-sm">
                Support File Type: jpg or png
              </p>
            </label>
          </div>
          <div className="relative w-32 h-32 rounded">
            <Image
              src={
                previewUrl ||
                "/images/young-male-designer-using-graphics-tablet-while-working-with-com.jpg"
              }
              alt="Preview"
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          </div>
        </div>
        {/* Title */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Title</label>
          <Input
            placeholder="Input title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>

        {/* Category */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Category</label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
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
              <Images size={20} aria-hidden="true" focusable="false" />
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
            Update
          </Button>
        </div>
      </div>
    </div>
  );
}
