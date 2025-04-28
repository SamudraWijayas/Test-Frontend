"use client"; // Pastikan komponen ini adalah komponen sisi klien

import { useProfile } from "@/hooks/useProfile"; // Import hook baru

export function Header() {
  const { user } = useProfile(); // Pakai hook

  return (
    <header className="flex items-center justify-between p-4 bg-white text-black w-full">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-slate-900">Articles</h1>
      </div>

      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-200 text-blue-900 font-semibold">
          {user ? user.username[0].toUpperCase() : "J"}
        </div>
        {user && (
          <span className="hidden md:inline font-medium text-slate-900 transition-colors duration-300">
            {user.username}
          </span>
        )}
      </div>
    </header>
  );
}
