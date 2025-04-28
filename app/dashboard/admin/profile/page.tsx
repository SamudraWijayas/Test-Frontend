// File: app/user-profile/page.tsx

"use client";

import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";

export default function UserProfile() {
  const { user } = useProfile();
  const router = useRouter();

  return (
    <>
      <div className="flex flex-col h-[80vh]">

        {/* Konten Utama */}
        <div className="flex-grow flex flex-col justify-center items-center">
          {/* Judul */}
          <h1 className="text-xl font-semibold mb-6">User Profile</h1>

          {/* Inisial Avatar */}
          <div className="w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center text-lg font-semibold text-blue-700 mb-6">
            {user ? user.username[0].toUpperCase() : "J"}
          </div>

          {/* Informasi User */}
          <div className="space-y-4 w-full max-w-xs">
            {/* Username */}
            <div className="flex items-center justify-between bg-gray-100 rounded-md px-4 py-2">
              <span className="font-medium">Username :</span>
              {user && <span>{user.username}</span>}
            </div>

            {/* Password */}
            <div className="flex items-center justify-between bg-gray-100 rounded-md px-4 py-2">
              <span className="font-medium">Password :</span>
              <span>******</span>
            </div>

            {/* Role */}
            <div className="flex items-center justify-between bg-gray-100 rounded-md px-4 py-2">
              <span className="font-medium">Role :</span>
              {user && <span>{user.role}</span>}
            </div>
          </div>

          {/* Tombol Kembali */}
          <button
            onClick={() => router.push("/dashboard/admin/artikel")}
            className="mt-8 w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm"
          >
            Back to home
          </button>
        </div>
      </div>
    </>
  );
}
