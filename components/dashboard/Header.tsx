"use client";

import { useProfile } from "@/hooks/useProfile";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { user } = useProfile();

  return (
    <header className="flex items-center justify-between bg-white text-black w-full px-8 py-4">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-slate-900">Articles</h1>
      </div>

      <div className="flex items-center space-x-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-semibold">
              {user ? user.username[0].toUpperCase() : "J"}
            </div>
            {user && (
              <span className="hidden md:inline font-medium transition-colors duration-300">
                {user.username}
              </span>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white w-40">
            <DropdownMenuItem>
              <Link href="/dashboard/admin/profile">
                <span className="text-sm text-gray-700 font-bold">
                  Akun Saya
                </span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
