"use client";

import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-6 lg:px-20 py-4 z-50 bg-white shadow-md">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        {/* Logo utama, tampil saat belum scroll */}
        <Image
          src="/logo3.png"
          alt="Logo"
          width={148}
          height={32}
          className="opacity-100"
        />
      </div>

      {/* User Info */}
      <div className="flex items-center space-x-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-semibold">
              J
            </div>
            <div className="hidden md:inline hover:underline font-medium transition-colors duration-300">
              James Dean
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white w-40">
            <DropdownMenuItem>
              <span className=" text-sm text-gray-700 font-bold">
                My Account
              </span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="border-t-2 border-gray-200/50 my-1" />
            <DropdownMenuItem>
              <a
                href="#"
                className="flex text-center items-center text-sm text-red-600 font-bold"
              >
                <LogOut className="mr-2" />
                Log out
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
