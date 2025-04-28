"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Newspaper, Tag, LogOut } from "lucide-react";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import Image from "next/image";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("token", { path: "/" });
    Cookies.remove("role", { path: "/" });
    router.push("/login");
  };
  const navItems = [
    { href: "/dashboard/admin/artikel", label: "Articles", icon: Newspaper },
    { href: "/dashboard/admin/category", label: "Category", icon: Tag },
    { href: null, label: "Logout", icon: LogOut, onClick: handleLogout },
  ];

  return (
    <Sidebar className="bg-blue-600 text-white">
      <SidebarHeader>
        <div className="text-xl font-bold p-4">
          {" "}
          <Image src="/frame.png" alt="Logo" height={32} width={148} className="opacity-100" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            if (item.onClick) {
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="flex items-center gap-2 py-2 px-4 rounded hover:bg-blue-500 w-full text-left"
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 py-2 px-4 rounded
                    ${
                      isActive
                        ? "bg-blue-500 font-semibold"
                        : "hover:bg-blue-500"
                    }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
