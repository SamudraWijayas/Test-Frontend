"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";
import { useProfile } from "@/hooks/useProfile";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const { user } = useProfile();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    Cookies.remove("token", { path: "/" });
    Cookies.remove("role", { path: "/" });
    router.push("/login");
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-6 lg:px-20 py-4 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <Image
          src="/frame.png"
          alt="Logo"
          width={148}
          height={32}
          className={`transition-opacity duration-300 ${
            scrolled ? "opacity-0 hidden" : "opacity-100"
          }`}
        />
        <Image
          src="/logo3.png"
          alt="Logo"
          width={148}
          height={32}
          className={`transition-opacity duration-300 ${
            scrolled ? "opacity-100" : "opacity-0 hidden"
          }`}
        />
      </div>

      {/* User Info & Logout */}
      <div className="flex items-center space-x-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-semibold">
              {user ? user.username[0].toUpperCase() : "J"}
            </div>
            {user && (
              <span
                className={`hidden md:inline font-medium transition-colors duration-300 ${
                  scrolled ? "text-blue-600" : "text-white"
                }`}
              >
                {user.username}
              </span>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white w-40">
            <DropdownMenuItem>
              <span className="text-sm text-gray-700 font-bold">Akun Saya</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="border-t-2 border-gray-200/50 my-1" />
            <DropdownMenuItem>
              <span
                onClick={handleLogout}
                className="flex items-center text-sm text-red-600 font-bold cursor-pointer"
              >
                <LogOut className="mr-2" />
                Keluar
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
