"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProfile } from "@/hooks/useProfile";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

interface Category {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

function getTokenFromCookie() {
  if (typeof document === "undefined") return null; // Safe for server-side
  const cookies = document.cookie.split("; ");
  const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));
  return tokenCookie ? tokenCookie.split("=")[1] : null;
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

export default function ArtikelListPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editCategoryName, setEditCategoryName] = useState("");
  const [deleteCategoryName, setDeleteCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const categoriesPerPage = 10;
  const { user } = useProfile(); // Assuming there is { user, isLoading }

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      // Menggunakan axios untuk fetch data kategori
      const res = await axios.get(
        "https://test-fe.mysellerpintar.com/api/categories"
      );

      // Pastikan response berhasil
      setCategories(res.data.data);
      setTotalPages(Math.ceil(res.data.data.length / categoriesPerPage));
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim() || !user?.id) return;

    const token = getTokenFromCookie();
    if (!token) {
      console.error("Token not found in cookie");
      toast.error("Token not found, please login.");
      return;
    }

    try {
      // Menggunakan axios untuk POST request
      const res = await axios.post(
        "https://test-fe.mysellerpintar.com/api/categories",
        {
          name: newCategoryName,
          userId: user.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Pastikan response status adalah sukses
      if (res.status !== 200) throw new Error("Failed to add category");

      fetchCategories(); // Refresh category list
      setNewCategoryName(""); // Clear input
      toast.success("Category added successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add category.");
    }
  };

  const handleEditCategory = async () => {
    if (!editCategoryName.trim() || !editingCategoryId || !user) {
      console.error("User is not authenticated or invalid data");
      toast.error("Please fill out all fields.");
      return;
    }

    const token = getTokenFromCookie();
    if (!token) {
      console.error("Token not found in cookie");
      toast.error("Token not found, please login.");
      return;
    }

    try {
      // Menggunakan axios untuk PUT request
      const res = await axios.put(
        `https://test-fe.mysellerpintar.com/api/categories/${editingCategoryId}`,
        {
          name: editCategoryName,
          userId: user.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Pastikan response status adalah sukses
      if (res.status !== 200) throw new Error("Failed to edit category");

      fetchCategories(); // Refresh category list
      setIsEditModalOpen(false);
      setEditingCategoryId(null);
      setEditCategoryName(""); // Clear input
      toast.success("Category edited successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to edit category.");
    }
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    const token = getTokenFromCookie();
    if (!token) {
      console.error("Token not found in cookie");
      toast.error("Token not found, please login.");
      return;
    }

    try {
      // Menggunakan axios untuk melakukan request DELETE
      const res = await axios.delete(
        `https://test-fe.mysellerpintar.com/api/categories/${categoryToDelete}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Pastikan response status adalah 200 atau 204 untuk sukses
      if (res.status !== 200 && res.status !== 204) {
        throw new Error("Failed to delete category");
      }

      // Panggil kembali fetchCategories untuk memperbarui daftar kategori
      fetchCategories();

      // Reset modal dan kategori yang dihapus
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
      setDeleteCategoryName("");

      // Tampilkan toast sukses
      toast.success("Category deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete category.");
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = filteredCategories.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <main className="bg-white rounded-lg">
      <div className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">
          Total Categories: {filteredCategories.length}
        </h1>
      </div>

      <hr className="border-b-1 border-gray-300/50 my-2" />

      <div className="flex justify-between items-center mb-4 p-4">
        <input
          type="text"
          placeholder="Search by category name"
          className="border border-gray-300 rounded-md py-2 px-4 text-sm focus:outline-none w-64"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Sheet>
          <SheetTrigger asChild>
            <Button className="bg-blue-600 text-white">+ Add Category</Button>
          </SheetTrigger>
          <SheetContent className="fixed inset-0 m-auto w-96 max-h-[35vh] rounded-md bg-white shadow-lg flex flex-col">
            <SheetHeader>
              <SheetTitle className="font-bold text-[18px]">
                Add Category
              </SheetTitle>
            </SheetHeader>

            <div className="grid w-full max-w-sm items-center gap-1.5 px-4">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Input Category"
                className="border-gray-200"
              />
            </div>

            <SheetFooter className="flex flex-row justify-end gap-2 mt-4 px-4">
              <SheetClose asChild>
                <Button variant="outline" className="border-gray-200">
                  Cancel
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button
                  className="bg-blue-600 text-white"
                  onClick={handleAddCategory}
                  disabled={!user?.id}
                >
                  Add
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Category</th>
              <th className="p-3">Created at</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentCategories.map((category) => (
              <tr key={category.id} className="border-b-1 border-gray-300/50">
                <td className="p-3">{category.name}</td>
                <td className="p-3">{formatDate(category.createdAt)}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => {
                      setEditingCategoryId(category.id);
                      setEditCategoryName(category.name);
                      setIsEditModalOpen(true);
                    }}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setCategoryToDelete(category.id);
                      setDeleteCategoryName(category.name);
                      setIsDeleteModalOpen(true);
                    }}
                    className="text-red-600"
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

      {/* Edit Category Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Edit Category</h2>
            <div className="mb-4">
              <Label htmlFor="category" className="mb-3">
                Category
              </Label>
              <Input
                id="category"
                className="border-gray-300"
                value={editCategoryName}
                onChange={(e) => setEditCategoryName(e.target.value)}
                placeholder="Input Category"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => setIsEditModalOpen(false)}
                variant="outline"
                className="border-gray-200"
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditCategory}
                disabled={!editCategoryName}
                className="bg-blue-600 text-white"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Category Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Delete Category</h2>
            <p>
              Delete category “{deleteCategoryName}”? This will remove it from
              master data permanently.
            </p>
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                onClick={() => setIsDeleteModalOpen(false)}
                variant="outline"
                className="border-gray-200"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteCategory}
                className="bg-red-600 text-white"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
